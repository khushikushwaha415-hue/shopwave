import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProductReviews, createReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", protect, createReview);

export default router;