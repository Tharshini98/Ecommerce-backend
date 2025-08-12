const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

 
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const isAlreadyWishlisted = user.wishlist.some((id) =>
      id.toString() === productId
    );

    if (isAlreadyWishlisted) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from wishlist" });
    } else {
      return res.status(404).json({ message: "Item not in wishlist" });
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist }); 
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};