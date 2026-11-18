const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All favorite routes require authentication
// GET    /api/favorites             — get user's favorites
// POST   /api/favorites/:productId  — add to favorites
// DELETE /api/favorites/:productId — remove from favorites

router.route('/')
  .get(protect, getFavorites);

router.route('/:productId')
  .post(protect, addFavorite)
  .delete(protect, removeFavorite);

module.exports = router;
