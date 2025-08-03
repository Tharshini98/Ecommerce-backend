const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:productId", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = await Review.findOne({
    product: product._id,
    user: req.user._id,
  });

  if (alreadyReviewed)
    return res.status(400).json({ message: "Already reviewed" });

  const review = new Review({
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
    product: product._id,
  });

  await review.save();

  product.reviews.push(review._id);
  product.numReviews = product.reviews.length;

  const allReviews = await Review.find({ product: product._id });
  const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = totalRating / allReviews.length;

  await product.save();

  res.status(201).json({ message: "Review added" });
});


router.get("/:productId", async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId });
  res.json(reviews);
});

module.exports = router;
