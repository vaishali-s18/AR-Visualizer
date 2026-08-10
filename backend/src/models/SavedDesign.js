const mongoose = require('mongoose');

const savedDesignSchema = new mongoose.Schema(
  {
    // Reference to the User who saved it
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Reference to the Product being placed
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    roomPhotoUrl: { type: String }, // Optional: If we capture a screenshot of the room
    // The exact 3D transform data to restore the placement later
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number, required: true },
    },
    rotation: { type: Number },
    scale: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedDesign', savedDesignSchema);
