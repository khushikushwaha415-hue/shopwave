import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @route GET /api/cart
export const getCart = async(req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route POST /api/cart
export const addToCart = async(req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route PUT /api/cart/:productId
export const updateCartItem = async(req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === req.params.productId
        );
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route DELETE /api/cart/:productId
export const removeFromCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};