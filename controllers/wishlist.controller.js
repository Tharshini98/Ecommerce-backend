const User = require("../models/User");
const Product = require("../models/Product");

exports.addToWishlist = async(req, res) => {
    const {productId} = req.params;
    const user = await User.findById(req.user.id);

    if(!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
    }

    res.status(200).json({success: true, wishlist: user.wishlist});

};

exports.removeFromWishList = async(req, res) => {
    const {productId} = req.params;
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
    );
    await user.save();

    res.status(200).json({success: true, wishlist: user.wishlist});
};

exports.getWishlist = async(req, res) => {
    const user = await User.findById(req.user.id).populate("wishlist");

    res.status(200).json({success: true, wishlist: user.wishlist});
};