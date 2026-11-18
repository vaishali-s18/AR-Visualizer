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
    material: { type: String },
    color: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    badge: { type: String },
    // Path to the actual 3D model file (.glb/.gltf)
    modelUrl: { type: String },
    // Whether a correctly-matching 3D model exists for this product.
    // When false, the AR button is hidden on the frontend.
    arAvailable: { type: Boolean, default: true },
    thumbnailUrl: { type: String },
    imageUrl: { type: String },
    // Affiliate tracking link used to redirect users for purchase
    affiliateUrl: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
