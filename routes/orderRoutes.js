import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createOrderPaymentIntent,
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-payment-intent", protect, createOrderPaymentIntent);
router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;