const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.getProfile = async(req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return res.status(404).json({message: 'User not found'});
    res.json(user);
};


exports.updateProfile = (async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error('User not found');

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token: generateToken(updatedUser._id),
  });
});

exports.updateSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  

    if (!user || user.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }


    user.name = req.body.name || user.name;
    user.shopName = req.body.shopName || user.shopName;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        shopName: updatedUser.shopName,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update seller profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

