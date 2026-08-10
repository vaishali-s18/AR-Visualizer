/**
 * Seed Script — populates MongoDB with sample products and an admin user.
 *
 * WHY: During development we need realistic data to build the UI against.
 * Run this ONCE from the backend folder:
 *   node src/scripts/seed.js
 *
 * It is safe to run multiple times — it clears existing products first.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load .env from the backend root (two levels up from this file)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User    = require('../models/User');
const Product = require('../models/Product');

// ─── Sample Products ──────────────────────────────────────────────────────────
// All use the same Chair.glb for now — in production each product gets its own .glb
// Helper to produce a simple SVG data-URI placeholder per product
const makePlaceholder = (category, name, bg = '#EDE8E0', fg = '#2B241E') => {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <rect width='100%' height='100%' fill='${bg}' />
    <g font-family='Inter, Arial, sans-serif'>
      <text x='50%' y='46%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-size='40' font-weight='700'>${escapeHtml(name)}</text>
      <text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-size='22' opacity='0.8'>${escapeHtml(category)}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Small helper to escape characters inside SVG text
const escapeHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const products = [
  {
    name: 'Modern Lounge Chair',
    category: 'Chairs',
    price: 12999,
    dimensions: { width: 80, height: 85, depth: 75 },
    description: 'A sleek Scandinavian-style lounge chair crafted with solid oak legs and premium fabric upholstery. Perfect for reading corners and living rooms.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    thumbnailUrl: makePlaceholder('Chairs','Modern Lounge Chair'),
    affiliateUrl: 'https://www.amazon.in/s?k=modern+lounge+chair',
  },
  {
    name: 'Ergonomic Office Chair',
    category: 'Chairs',
    price: 18499,
    dimensions: { width: 65, height: 110, depth: 65 },
    description: 'Full lumbar support, adjustable armrests, and breathable mesh back. Designed for long working hours.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    thumbnailUrl: makePlaceholder('Chairs','Ergonomic Office Chair'),
    affiliateUrl: 'https://www.amazon.in/s?k=ergonomic+office+chair',
  },
  {
    name: 'Velvet 3-Seater Sofa',
    category: 'Sofas',
    price: 34999,
    dimensions: { width: 210, height: 88, depth: 90 },
    description: 'Luxurious deep-tufted velvet sofa in midnight blue. Solid wood frame with high-density foam cushions.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    thumbnailUrl: makePlaceholder('Sofas','Velvet 3-Seater Sofa'),
    affiliateUrl: 'https://www.pepperfry.com/sofas.html',
  },
  {
    name: 'Minimalist L-Shaped Sofa',
    category: 'Sofas',
    price: 45999,
    dimensions: { width: 270, height: 82, depth: 160 },
    description: 'Clean-lined sectional sofa perfect for open-plan living. Modular design for easy reconfiguration.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    thumbnailUrl: makePlaceholder('Sofas','Minimalist L-Shaped Sofa'),
    affiliateUrl: 'https://www.pepperfry.com/sofas.html',
  },
  {
    name: 'Solid Wood Coffee Table',
    category: 'Tables',
    price: 8999,
    dimensions: { width: 120, height: 45, depth: 60 },
    description: 'Hand-finished acacia wood coffee table with hairpin legs. Each piece has a unique natural grain pattern.',
    modelUrl: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/CoffeeTable/glTF-Binary/CoffeeTable.glb',
    thumbnailUrl: makePlaceholder('Tables','Solid Wood Coffee Table'),
    affiliateUrl: 'https://www.amazon.in/s?k=solid+wood+coffee+table',
  },
  {
    name: 'Glass Top Dining Table',
    category: 'Tables',
    price: 22499,
    dimensions: { width: 160, height: 76, depth: 90 },
    description: 'Tempered glass top with a stainless steel base. Seats 6 comfortably. Easy to clean.',
    modelUrl: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Box/glTF-Binary/Box.glb',
    thumbnailUrl: makePlaceholder('Tables','Glass Top Dining Table'),
    affiliateUrl: 'https://www.flipkart.com/search?q=glass+dining+table',
  },
  {
    name: 'Arc Floor Lamp',
    category: 'Lighting',
    price: 5499,
    dimensions: { width: 35, height: 175, depth: 35 },
    description: 'Adjustable arc lamp with a marble base and linen shade. Creates warm ambient lighting in any corner.',
    modelUrl: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Lantern/glTF-Binary/Lantern.glb',
    thumbnailUrl: makePlaceholder('Lighting','Arc Floor Lamp'),
    affiliateUrl: 'https://www.amazon.in/s?k=arc+floor+lamp',
  },
  {
    name: 'Modular Bookshelf',
    category: 'Storage',
    price: 9799,
    dimensions: { width: 180, height: 200, depth: 30 },
    description: 'Wall-mounted modular shelving system. Mix and match configurations to fit your space.',
    modelUrl: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb',
    thumbnailUrl: makePlaceholder('Storage','Modular Bookshelf'),
    affiliateUrl: 'https://www.pepperfry.com/bookshelves.html',
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products to avoid duplicates on re-run
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all sample products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    // Create admin user only if one doesn't already exist
    const existingAdmin = await User.findOne({ email: 'admin@arvisualizer.com' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@arvisualizer.com',
        passwordHash,
        role: 'admin',
      });
      console.log('Admin user created: admin@arvisualizer.com / admin123');
    } else {
      console.log('Admin user already exists — skipping');
    }

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
