const mongoose = require('mongoose');

const savedDesignSchema = new mongoose.Schema(
  {
    // Reference to the User who saved it
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Reference to the Product being placed
    roomPhotoUrl: { type: String }, // Optional: If we capture a screenshot of the room
    roomName: { type: String, default: 'My Room' }, // User-given label for the design
    roomDimensions: {
      width: { type: Number, min: 2, max: 30, default: 8 },
      depth: { type: Number, min: 2, max: 30, default: 8 },
      height: { type: Number, min: 2, max: 8, default: 3.5 },
    },
    budgetCap: { type: Number, min: 0 },
    publicShareToken: { type: String, unique: true, sparse: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
          z: { type: Number, required: true },
        },
        rotation: { type: Number, default: 0 },
        scale: { type: Number, default: 1 },
        color: { type: String, match: /^#[0-9a-fA-F]{6}$/ },
        finish: { type: String, enum: ['original', 'fabric', 'wood', 'leather', 'metal'], default: 'original' },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedDesign', savedDesignSchema);
