import Stripe from "stripe";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { createPaymentIntent } from "../utils/stripeHelper.js";

// @route POST /api/orders/create-payment-intent
export const createOrderPaymentIntent = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        const paymentIntent = await createPaymentIntent(totalAmount);

        res.json({
            clientSecret: paymentIntent.client_secret,
            totalAmount,
        });
    } catch (error) {
        console.error("Payment intent error:", error);
        res.status(500).json({ message: "Failed to create payment intent", error: error.message });
    }
};

// @route POST /api/orders
export const placeOrder = async(req, res) => {
    try {
        const { shippingAddress, paymentIntentId } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Verify the payment with Stripe before creating the order
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
        }));

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: "paid",
            stripePaymentId: paymentIntentId,
            orderStatus: "placed",
        });

        // Clear the cart after successful order
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
};

// @route GET /api/orders/myorders
export const getMyOrders = async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route GET /api/orders (admin only)
export const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route PUT /api/orders/:id/status (admin only)
export const updateOrderStatus = async(req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.orderStatus = orderStatus || order.orderStatus;
        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};