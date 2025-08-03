const express = require("express");
const router = express.Router();
const {protect, isSeller} = require("../middlewares/authMiddleware");
const {
    getSellerOrders,
    updateOrderStatus,
    notifySeller
} = require("../controllers/seller.controller");

router.get("/orders/:sellerId", protect, isSeller, getSellerOrders);
router.put("/orders/:orderId/status", protect, isSeller, updateOrderStatus);
router.put("/orders/:orderId/notify", protect, isSeller, notifySeller);

module.exports = router;