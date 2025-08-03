const express = require('express');
const router = express.Router();
const {getProfile, updateProfile} = require('../controllers/user.controller');
const {protect, isSeller} = require('../middlewares/authMiddleware');
const { updateSellerProfile } = require('../controllers/user.controller');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.put('/profile', protect, isSeller, updateSellerProfile);

module.exports = router;