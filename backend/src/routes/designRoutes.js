const express = require('express');
const router = express.Router();
const {
  createDesign,
  getMyDesigns,
  getDesignById,
  getSharedDesign,
  enableDesignSharing,
  disableDesignSharing,
  updateDesign,
  deleteDesign,
} = require('../controllers/designController');
const { protect } = require('../middleware/auth');

// All design routes require a logged-in user (JWT)
// POST /api/designs        — save a new AR placement
// GET  /api/designs/mine   — get all my saved designs
// GET  /api/designs/:id    — retrieve details of one design
// PUT  /api/designs/:id    — update a saved design layout/name
// DELETE /api/designs/:id  — delete one of my saved designs

router.post('/', protect, createDesign);
router.get('/mine', protect, getMyDesigns);
router.get('/shared/:token', getSharedDesign);
router.post('/:id/share', protect, enableDesignSharing);
router.delete('/:id/share', protect, disableDesignSharing);
router.get('/:id', protect, getDesignById);
router.put('/:id', protect, updateDesign);
router.delete('/:id', protect, deleteDesign);

module.exports = router;
