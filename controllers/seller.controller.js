const Order = require("../models/Order");
 exports.getSellerOrders = async(req, res) => {
    try{
        const orders = await Order.find({seller: req.params.sellerId})
        .populate("buyer", "name email")
        .populate("populate.product", "name price");
        res.json(orders);
    } catch(err) {
        res.status(500).json({error: "Failed to fetch orders"});
    }
 };

 exports.updateOrderStatus = async(req, res) => {
    const {status} = req.body;
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            {status},
            {new: true}
        );
        res.json(order);
    } catch(err) {
        res.status(500).json({error: "Failed to update order status"});
    }
 };

 exports.notifySeller = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { isNotified: true },
      { new: true }
    );
    res.json({ message: "Seller notified", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to notify seller" });
  }
};
