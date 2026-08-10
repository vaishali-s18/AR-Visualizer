const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    // Dimensions help the AR model viewer determine real-world scale
    dimensions: {
      width: { type: Number },
      height: { type: Number },
      depth: { type: Number },
    },
    description: { type: String },
    // Path to the actual 3D model file (.glb/.gltf)
    modelUrl: { type: String, required: true }, 
    thumbnailUrl: { type: String },
    // Affiliate tracking link used to redirect users for purchase
    affiliateUrl: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
