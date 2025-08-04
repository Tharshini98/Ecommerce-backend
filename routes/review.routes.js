// routes/reviewRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  addReview,
  getReviewsForProduct,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// GET all reviews for a product
router.get("/:productId", getReviewsForProduct);

// POST review for a product
router.post("/:productId", protect, addReview);

// DELETE a review (optional, for users/admins)
router.delete("/:productId/:reviewId", protect, deleteReview);

module.exports = router;
