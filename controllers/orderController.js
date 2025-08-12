const Razorpay = require("razorpay");
const Order = require("../models/Order");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Order creation failed", error: err });
  }
};

exports.savePaidOrder = async (req, res) => {
  try {
    const { items, totalPrice, shipping } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const mappedItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      seller: item.product.seller,  
    }));

    const shippingAddress = {
      fullName: shipping.name,
      address: shipping.address,
      city: shipping.city || "",
      state: shipping.state || "",
      postalCode: shipping.postalCode || "",
      country: shipping.country || "",
    };

    const order = new Order({
      buyer: req.user.id,
      items,
      totalAmount: totalPrice,
      shippingAddress,           
      paymentStatus: "paid",     
      orderStatus: "processing", 
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ message: "Failed to save order" });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user.id }).populate("buyer");
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment details" });
    }



    res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
