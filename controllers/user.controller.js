const User = require('../models/User');

exports.getProfile = async(req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return res.status(404).json({message: 'User not found'});
    res.json(user);
};

exports.updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({message: 'User not found'});

    const{name, email, password} = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    if(password) {
        user.password = password;
    }
     await user.save();

     res.json({message: 'Profile updated successfully'});
};

exports.updateSellerProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user && user.role === 'seller') {
    user.storeName = req.body.storeName || user.storeName;
    user.storeDescription = req.body.storeDescription || user.storeDescription;
    user.storeLogo = req.body.storeLogo || user.storeLogo;
    user.storeAddress = req.body.storeAddress || user.storeAddress;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'Seller not found' });
  }
};
