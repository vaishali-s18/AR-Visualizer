const User = require('../models/User');
const Product = require('../models/Product');

// ─── GET /api/favorites (protected) ──────────────────────────────────────────
// Retrieves the list of all favorited products for the logged-in user.
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/favorites/:productId (protected) ──────────────────────────────
// Adds a product to the user's favorites list.
const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify the product exists in the catalogue
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Avoid duplicates
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ message: 'Product added to favourites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/favorites/:productId (protected) ────────────────────────────
// Removes a product from the user's favorites list.
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Product removed from favourites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
