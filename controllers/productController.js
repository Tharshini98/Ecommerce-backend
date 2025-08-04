const Product = require('../models/Product');

// @desc    Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice)
      query.price = { $gte: minPrice || 0, $lte: maxPrice || 200000 };

    // Optional pagination support (uncomment if needed)
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;

    const products = await Product.find(query)
      // .skip(skip).limit(limit)
      .populate('seller', 'name');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @desc    Create new product (only for sellers)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      seller: req.user._id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product (seller only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete product (seller only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// @desc    Get all products for a seller
exports.getAllProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seller products' });
  }
};
