const SavedDesign = require('../models/SavedDesign');
const crypto = require('crypto');

// ─── POST /api/designs (protected) ───────────────────────────────────────────
// Saves the current room layout (roomName + array of placed items) for the logged-in user.
const createDesign = async (req, res) => {
  try {
    const { roomName, roomPhotoUrl, roomDimensions, budgetCap, items } = req.body;

    // req.user is attached by the `protect` middleware
    const design = await SavedDesign.create({
      userId: req.user._id,
      roomName: roomName || 'My Room',
      roomPhotoUrl,
      roomDimensions,
      budgetCap,
      items: items || [],
    });

    res.status(201).json(design);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── GET /api/designs/mine (protected) ───────────────────────────────────────
// Returns all saved designs belonging to the logged-in user.
// We populate the nested items' product details.
const getMyDesigns = async (req, res) => {
  try {
    const designs = await SavedDesign.find({ userId: req.user._id })
      .populate('items.productId', 'name thumbnailUrl price modelUrl dimensions') // Fetch selected fields
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/designs/shared/:token (public, read-only) ───────────────────────
const getSharedDesign = async (req, res) => {
  try {
    const design = await SavedDesign.findOne({ publicShareToken: req.params.token })
      .select('-userId -publicShareToken')
      .populate('items.productId', 'name category thumbnailUrl price modelUrl dimensions');

    if (!design) return res.status(404).json({ message: 'Shared design not found' });
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/designs/:id (protected) ────────────────────────────────────────
// Fetches a single design by its ID, with product details populated.
const getDesignById = async (req, res) => {
  try {
    const design = await SavedDesign.findById(req.params.id)
      .populate('items.productId');
    
    if (!design) return res.status(404).json({ message: 'Design not found' });

    // Security check: ensure the design belongs to the logged-in user
    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to view this design' });
    }

    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/designs/:id (protected) ────────────────────────────────────────
// Updates a saved design's layout or name.
const updateDesign = async (req, res) => {
  try {
    const { roomName, roomPhotoUrl, roomDimensions, budgetCap, items } = req.body;
    const design = await SavedDesign.findById(req.params.id);

    if (!design) return res.status(404).json({ message: 'Design not found' });

    // Security check: ensure the design belongs to the logged-in user
    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this design' });
    }

    if (roomName !== undefined) design.roomName = roomName;
    if (roomPhotoUrl !== undefined) design.roomPhotoUrl = roomPhotoUrl;
    if (roomDimensions !== undefined) design.roomDimensions = roomDimensions;
    if (budgetCap !== undefined) design.budgetCap = budgetCap;
    if (items !== undefined) design.items = items;

    await design.save();
    // Populate the newly updated items' product details
    await design.populate('items.productId');

    res.json(design);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── POST /api/designs/:id/share (protected) ──────────────────────────────────
const enableDesignSharing = async (req, res) => {
  try {
    const design = await SavedDesign.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to share this design' });
    }

    if (!design.publicShareToken) {
      design.publicShareToken = crypto.randomBytes(24).toString('hex');
      await design.save();
    }
    res.json({ token: design.publicShareToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/designs/:id/share (protected) ────────────────────────────────
const disableDesignSharing = async (req, res) => {
  try {
    const design = await SavedDesign.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to unshare this design' });
    }

    design.publicShareToken = undefined;
    await design.save();
    res.json({ message: 'Design sharing disabled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/designs/:id (protected) ─────────────────────────────────────
// Deletes a saved design — but only if it belongs to the requesting user.
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

module.exports = {
  createDesign,
  getMyDesigns,
  getDesignById,
  getSharedDesign,
  enableDesignSharing,
  disableDesignSharing,
  updateDesign,
  deleteDesign,
};
