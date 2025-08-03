const Order = require('../models/Order');
const Product = require('../models/Product');


exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    for (const i of items) {
      const product = await Product.findById(i.product);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      totalAmount += product.price * i.quantity;
    }

    const order = await Order.create({
      buyer: req.user.id,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Order creation failed', error });
  }
};


exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id }).populate('items.product');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('buyer items.product');
  res.json(orders);
};

exports.getOrdersBySeller = async(req, res) => {
  try{
    const sellerId = req.params.id;
    const orders = await Order.find({ "items.seller": sellerId }).populate("items.product");

    res.status(200).json(orders);
  } catch(error) {
    console.error("Error fetching seller orders:", error.message);
    res.status(500).json({message:"Failed to fetch seller orders"})
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};


exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order delivery status:", error.message);
    res.status(500).json({ message: 'Failed to update delivery status' });
  }
};

// Mark an order as paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order payment status:", error.message);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};



