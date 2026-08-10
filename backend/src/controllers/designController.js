const SavedDesign = require('../models/SavedDesign');

// ─── POST /api/designs (protected) ───────────────────────────────────────────
// Saves the current AR placement (product + position/rotation/scale) for the logged-in user.
const createDesign = async (req, res) => {
  try {
    const { productId, roomPhotoUrl, position, rotation, scale } = req.body;

    // req.user is attached by the `protect` middleware
    const design = await SavedDesign.create({
      userId: req.user._id,
      productId,
      roomPhotoUrl,
      position,
      rotation,
      scale,
    });

    res.status(201).json(design);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── GET /api/designs/mine (protected) ───────────────────────────────────────
// Returns all saved designs belonging to the logged-in user.
// We populate the product details so the frontend can display the product name/thumbnail.
const getMyDesigns = async (req, res) => {
  try {
    const designs = await SavedDesign.find({ userId: req.user._id })
      .populate('productId', 'name thumbnailUrl price') // Only fetch selected fields
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/designs/:id (protected) ─────────────────────────────────────
// Deletes a saved design — but only if it belongs to the requesting user.
// This prevents a user from deleting someone else's saved designs.
const deleteDesign = async (req, res) => {
  try {
    const design = await SavedDesign.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });

    // Security check: ensure the design belongs to the logged-in user
    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this design' });
    }

    await design.deleteOne();
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDesign, getMyDesigns, deleteDesign };
