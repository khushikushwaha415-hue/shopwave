import Review from "../models/Review.js";

// @route GET /api/reviews/:productId
export const getProductReviews = async(req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        const avgRating =
            reviews.length > 0 ?
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length :
            0;

        res.json({
            reviews,
            count: reviews.length,
            averageRating: Number(avgRating.toFixed(1)),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route POST /api/reviews/:productId
export const createReview = async(req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        const existing = await Review.findOne({
            product: req.params.productId,
            user: req.user._id,
        });

        if (existing) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = await Review.create({
            product: req.params.productId,
            user: req.user._id,
            rating,
            comment,
        });

        const populated = await review.populate("user", "name");
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};