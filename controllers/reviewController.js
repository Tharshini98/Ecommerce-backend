const Review = require("../models/Review");
const Product = require("../models/Product");


exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


exports.addReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const productId = req.params.productId;

    const existing = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || review.product.toString() !== productId) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
