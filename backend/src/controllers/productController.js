const Product = require('../models/Product');

// ─── GET /api/products ────────────────────────────────────────────────────────
// Public route — anyone can browse the catalogue.
// Supports optional query params: ?category=Sofa  and  ?search=leather
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build a filter object dynamically based on which query params are provided
    const filter = {};

    if (category) {
      // Case-insensitive match on category field
      filter.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      // Search the product name and description fields
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products (admin only) ─────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── PUT /api/products/:id (admin only) ──────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    // { new: true } returns the updated document instead of the old one
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── DELETE /api/products/:id (admin only) ───────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
