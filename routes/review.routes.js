
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  addReview,
  getReviewsForProduct,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();


router.get("/:productId", getReviewsForProduct);


router.post("/:productId", protect, addReview);


router.delete("/:productId/:reviewId", protect, deleteReview);

module.exports = router;
