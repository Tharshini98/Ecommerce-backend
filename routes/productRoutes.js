const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
} = require('../controllers/productController');

const { protect, isSeller } = require('../middlewares/authMiddleware');

router.get('/', getAllProducts);                   
router.get('/:id', getProductById);                 
router.get('/seller/:sellerId', getProductsBySeller); 


router.post('/', protect, isSeller, createProduct);     
router.put('/:id', protect, isSeller, updateProduct);   
router.delete('/:id', protect, isSeller, deleteProduct); 

module.exports = router;
