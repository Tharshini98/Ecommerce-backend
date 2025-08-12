const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user) => {
    return jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});

};

exports.register = async(req, res) => {
    const {name, email, password, role } = req.body;
    const user = await User.create({name, email, password, role});
    const token = generateToken(user);
   res.status(201).json({
  success: true,
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
})
};

exports.login = async(req, res) => {
    const{email, password} = req.body;
    const user = await User.findOne({email});
    if(!user || !(await user.matchPassword(password))){
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
  success: true,
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

   
    const resetToken = crypto.randomBytes(32).toString('hex');

  
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; 

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; 

    await sendEmail(user.email, 'Password Reset', `Reset your password here: ${resetUrl}`);

    res.json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;


    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password; 
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changedPassword = async (req, res) => {
    const user = await User.findById(req.user.id);
    const {oldPassword, newPassword} = req.body;

    if(!(await user.matchPassword(oldPassword))){
 return res.status(400).json({ message: 'Incorrect current password' });
    }
    user.password = newPassword;
    await user.save();
    res.json({message: 'Password changed successfully'});
};