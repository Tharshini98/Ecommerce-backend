const Product = require('../models/Product');

exports.getAllProducts = async(req, res) => {
    const{search, category, minPrice, maxPrice} = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) query.price = {$gte: minPrice || 0, $lte: maxPrice || 200000};

    const products = await Product.find(query).populate('seller', 'name');
    res.json(products);
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
     if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

exports.createProduct = async(req,res) => {
    try {
    const{name, description, price, category, image, stock} = req.body;
    const product = await Product.create({
        name,
        description,
        price,
        category,
        image,
        stock,
        seller: req.user._id
    });

    await product.save();
    res.status(201).json({success: true, product});
} catch(err) {
    res.status(500).json({ success: false, message: err.message });
}
};

exports.updateProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({message: 'Not authorized'});
    }
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
};

exports.deleteProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({message: 'Not authorized'});
    }
    await product.remove();
    res.json({message: 'Product removed'});
};

exports.getAllProductsBySeller = async(req, res) => {
    const products = await Product.find({seller: req.params.sellerId});
    res.json(products);
};