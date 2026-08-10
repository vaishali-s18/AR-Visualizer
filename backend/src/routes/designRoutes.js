const express = require('express');
const router = express.Router();
const { createDesign, getMyDesigns, deleteDesign } = require('../controllers/designController');
const { protect } = require('../middleware/auth');

// All design routes require a logged-in user (JWT)
// POST /api/designs        — save a new AR placement
// GET  /api/designs/mine   — get all my saved designs
// DELETE /api/designs/:id  — delete one of my saved designs

router.post('/', protect, createDesign);
router.get('/mine', protect, getMyDesigns);
router.delete('/:id', protect, deleteDesign);

module.exports = router;
