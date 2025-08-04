const express = require("express");
const { protect, restrictTo, isSeller } = require("../middlewares/authMiddleware.js");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.post("/add", protect, restrictTo("seller"), productController.createProduct);
router.put("/:id", protect, restrictTo("seller"), productController.updateProduct);
router.delete("/:id", protect, restrictTo("seller"), productController.deleteProduct);

module.exports = router;