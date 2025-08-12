const express = require("express");
const {
  getRazorpayKey,
  createRazorpayOrder,
  paymentVerification,
  savePaidOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus 
} = require("../controllers/orderController");

const { protect, isSeller, isBuyer } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/razorpay-key", protect, getRazorpayKey);


router.post("/", protect, isBuyer, createRazorpayOrder);


router.post("/save-order", protect, savePaidOrder);


router.post("/payment-verification", protect, paymentVerification);

router.get("/my", protect, getMyOrders);

router.get("/seller/:id", protect, isSeller, getSellerOrders);

router.put("/:id/status", protect, isSeller, updateOrderStatus);

module.exports = router;
