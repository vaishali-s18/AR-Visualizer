const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products        — public, supports ?category= and ?search=
// POST /api/products       — admin only (add a new product to catalogue)
router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

// GET /api/products/:id    — public (view product detail)
// PUT /api/products/:id    — admin only (edit product)
// DELETE /api/products/:id — admin only (remove product)
router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
