const express = require ("express");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrdersBySeller,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require( "../controllers/orderController");
const { protect, isSeller, isBuyer } = require( "../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, isBuyer, createOrder);

router.get("/myorders", protect, isBuyer, getMyOrders);

router.get("/seller/:id", protect, isSeller, getOrdersBySeller);

router.get("/:id", protect, getOrderById);

router.put("/:id/pay", protect, updateOrderToPaid);

router.put("/:id/deliver", protect, isSeller, updateOrderToDelivered);

module.exports = router;
