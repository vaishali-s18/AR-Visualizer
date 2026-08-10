// ─── Mock Product Data ────────────────────────────────────────────────────────
// Used when the backend is not running, so the UI is fully functional
// with realistic data for demonstration and development purposes.

export const CATEGORIES = ['All', 'Chairs', 'Sofas', 'Tables', 'Beds', 'Cabinets', 'Lamps', 'Decor'];

// Category icon map (emoji shortcuts used in CategoryFilter)
export const CATEGORY_ICONS = {
  All:      '🏠',
  Chairs:   '🪑',
  Sofas:    '🛋️',
  Tables:   '🪵',
  Beds:     '🛏️',
  Cabinets: '🗄️',
  Lamps:    '💡',
  Decor:    '🌿',
};

export const mockProducts = [
  // ── Sofas ──────────────────────────────────────────────────────────────────
  {
    id: 'p001',
    name: 'Harbour Linen Sofa',
    category: 'Sofas',
    price: 52999,
    description:
      'A sculptural three-seater with deep-set cushions and a solid walnut frame. The stone-linen upholstery is removable and machine-washable, making it as practical as it is elegant.',
    dimensions: { width: 220, height: 85, depth: 95 },
    material: 'Linen, Solid Walnut',
    color: 'Stone',
    image: null,
    modelUrl: '/models/chairs-sutherland-chair-a2a39683.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 148,
    badge: 'Bestseller',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p002',
    name: 'Milo Velvet Sectional',
    category: 'Sofas',
    price: 87500,
    description:
      'A modular L-shaped sectional upholstered in midnight-green velvet. Each piece clicks together with hidden steel brackets — reconfigure it as your space evolves.',
    dimensions: { width: 280, height: 80, depth: 160 },
    material: 'Velvet, Powder-coated Steel',
    color: 'Midnight Green',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.5,
    reviews: 62,
    badge: 'New',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p003',
    name: 'Haven Leather Sofa',
    category: 'Sofas',
    price: 74000,
    description:
      'Full-grain Italian leather, hand-stitched with saddle-stitch detail. Ages beautifully and becomes more characterful over time.',
    dimensions: { width: 200, height: 78, depth: 90 },
    material: 'Full-grain Leather, Beech Wood',
    color: 'Cognac',
    image: null,
    modelUrl: '/models/chairs-sutherland-chair-a2a39683.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.8,
    reviews: 210,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Chairs ─────────────────────────────────────────────────────────────────
  {
    id: 'p004',
    name: 'Prestige Accent Chair',
    category: 'Chairs',
    price: 18500,
    description:
      'A sleek upholstered accent chair with tapered brass legs. Compact enough for a reading corner but statement-making enough to anchor a living room.',
    dimensions: { width: 72, height: 82, depth: 74 },
    material: 'Boucle, Brass',
    color: 'Ivory Boucle',
    image: null,
    modelUrl: '/models/chairs-198333-prestige-chair-03d10a0c.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.6,
    reviews: 93,
    badge: 'Trending',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p005',
    name: 'Zakopane Lounge Chair',
    category: 'Chairs',
    price: 22000,
    description:
      'Inspired by Polish mountain craft, this lounge chair features a hand-carved oak frame and saddle-leather seat that molds to your shape over time.',
    dimensions: { width: 68, height: 88, depth: 78 },
    material: 'Solid Oak, Leather',
    color: 'Natural Oak / Tan',
    image: null,
    modelUrl: '/models/chairs-zakopane-style-chair-3f3e5490.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.9,
    reviews: 45,
    badge: 'Artisan',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p006',
    name: 'England Side Chair',
    category: 'Chairs',
    price: 9800,
    description:
      'A refined reproduction of a 1750s English side chair. Carved mahogany legs, cabriole detail, and a padded seat covered in cotton damask.',
    dimensions: { width: 54, height: 96, depth: 52 },
    material: 'Mahogany, Cotton Damask',
    color: 'Mahogany / Cream',
    image: null,
    modelUrl: '/models/chairs-chair-england-1750-60-40688b84.glb',
    modelFormat: 'glb',
    inStock: false,
    rating: 4.4,
    reviews: 31,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Tables ─────────────────────────────────────────────────────────────────
  {
    id: 'p007',
    name: 'Solid Oak Dining Table',
    category: 'Tables',
    price: 41000,
    description:
      'Crafted from a single slab of European white oak, finished with natural oil to bring out the grain. Seats six comfortably, eight with the extension leaf.',
    dimensions: { width: 180, height: 75, depth: 90 },
    material: 'Solid White Oak',
    color: 'Natural Oak',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.8,
    reviews: 127,
    badge: 'Premium',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p008',
    name: 'Brass & Marble Coffee Table',
    category: 'Tables',
    price: 27500,
    description:
      'Nero Marquina marble top on a powder-coated brass frame. The hexagonal silhouette makes it equally at home in mid-century or contemporary interiors.',
    dimensions: { width: 110, height: 40, depth: 60 },
    material: 'Marble, Brass',
    color: 'Black Marble / Brass',
    image: null,
    modelUrl: '/models/chairs-sutherland-chair-a2a39683.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 89,
    badge: "Editor's Pick",
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p009',
    name: 'Spindle Side Table',
    category: 'Tables',
    price: 6200,
    description:
      'A versatile bedside or side table with hand-turned spindle legs in solid ash. Available with a natural or charcoal finish.',
    dimensions: { width: 45, height: 60, depth: 45 },
    material: 'Solid Ash',
    color: 'Natural',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.5,
    reviews: 76,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Lighting ───────────────────────────────────────────────────────────────
  // ── Lamps ──────────────────────────────────────────────────────────────────
  {
    id: 'p010',
    name: 'Peacock Table Lamp',
    category: 'Lamps',
    price: 8400,
    description:
      'An art-deco inspired table lamp with a hand-thrown ceramic base in peacock teal and a linen drum shade. Casts a warm, diffused glow.',
    dimensions: { width: 28, height: 55, depth: 28 },
    material: 'Ceramic, Linen',
    color: 'Peacock Teal',
    image: null,
    modelUrl: '/models/lighting-2018281-peacock-table-lamp-a24bcb6b.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.8,
    reviews: 204,
    badge: 'Bestseller',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p011',
    name: 'Rattan Pendant Lamp',
    category: 'Lamps',
    price: 4900,
    description:
      'Handwoven rattan shade in a wide-brim silhouette. Creates beautiful dappled light patterns on walls and ceilings. Cord length adjustable.',
    dimensions: { width: 50, height: 30, depth: 50 },
    material: 'Rattan, Brass Fixture',
    color: 'Natural Rattan',
    image: null,
    modelUrl: '/models/lighting-2018281-peacock-table-lamp-a24bcb6b.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.6,
    reviews: 118,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p012',
    name: 'Arc Floor Lamp',
    category: 'Lamps',
    price: 14200,
    description:
      'A bold arching floor lamp in satin brass with a white linen shade. The arc extends 160 cm, perfect for reading over a sofa or chair.',
    dimensions: { width: 40, height: 180, depth: 40 },
    material: 'Satin Brass, Linen',
    color: 'Satin Brass',
    image: null,
    modelUrl: '/models/lighting-2018281-peacock-table-lamp-a24bcb6b.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 57,
    badge: 'New',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Cabinets ───────────────────────────────────────────────────────────────
  {
    id: 'p013',
    name: 'Shaker Bookcase',
    category: 'Cabinets',
    price: 19800,
    description:
      'A five-shelf bookcase in solid birch with Shaker-style detailing. The adjustable shelves accommodate everything from paperbacks to oversized art books.',
    dimensions: { width: 100, height: 200, depth: 35 },
    material: 'Solid Birch',
    color: 'White / Natural',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.5,
    reviews: 143,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p014',
    name: 'Cane Sideboard Cabinet',
    category: 'Cabinets',
    price: 32000,
    description:
      'A three-door sideboard with hand-woven cane panel doors, solid teak frame, and soft-close hinges. Ample interior storage behind each door.',
    dimensions: { width: 160, height: 80, depth: 45 },
    material: 'Solid Teak, Cane',
    color: 'Teak / Natural Cane',
    image: null,
    modelUrl: '/models/chairs-sutherland-chair-a2a39683.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.9,
    reviews: 66,
    badge: 'Artisan',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p017',
    name: 'Walnut Display Cabinet',
    category: 'Cabinets',
    price: 44500,
    description:
      'A floor-to-ceiling display cabinet in oiled walnut with adjustable glass shelves and integrated LED strip lighting. Perfect for showcasing collectibles and fine ceramics.',
    dimensions: { width: 90, height: 220, depth: 40 },
    material: 'Solid Walnut, Tempered Glass',
    color: 'Dark Walnut',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 54,
    badge: 'Premium',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Beds ───────────────────────────────────────────────────────────────────
  {
    id: 'p018',
    name: 'Linen Platform Bed',
    category: 'Beds',
    price: 68000,
    description:
      'A low-profile platform bed with a solid oak base and a linen-upholstered headboard. The floating frame gives a serene, minimal aesthetic inspired by Japanese interiors.',
    dimensions: { width: 180, height: 90, depth: 220 },
    material: 'Solid Oak, Linen',
    color: 'Oat Linen / Natural Oak',
    image: null,
    modelUrl: '/models/chairs-sutherland-chair-a2a39683.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.8,
    reviews: 97,
    badge: 'Bestseller',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p019',
    name: 'Rattan Canopy Bed',
    category: 'Beds',
    price: 95000,
    description:
      'A four-poster canopy bed with hand-woven rattan panels and a solid mahogany frame. Drape with sheer linen for a bohemian sanctuary feel.',
    dimensions: { width: 160, height: 220, depth: 210 },
    material: 'Solid Mahogany, Rattan',
    color: 'Dark Mahogany / Natural Rattan',
    image: null,
    modelUrl: '/models/chairs-zakopane-style-chair-3f3e5490.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.9,
    reviews: 38,
    badge: 'Artisan',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p020',
    name: 'Velvet Upholstered Bed',
    category: 'Beds',
    price: 54000,
    description:
      'A king-size bed with a deep-buttoned velvet headboard and solid beech legs. The high back panel doubles as a backrest for reading in bed.',
    dimensions: { width: 190, height: 130, depth: 215 },
    material: 'Velvet, Solid Beech',
    color: 'Sage Green',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 72,
    badge: 'New',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },

  // ── Decor ──────────────────────────────────────────────────────────────────
  {
    id: 'p015',
    name: 'Terracotta Vase Set',
    category: 'Decor',
    price: 2800,
    description:
      'Set of three hand-thrown terracotta vases in graduated sizes. Each piece has a unique texture and slight variation — no two sets are identical.',
    dimensions: { width: 18, height: 35, depth: 18 },
    material: 'Terracotta',
    color: 'Terracotta',
    image: null,
    modelUrl: '/models/lighting-2018281-peacock-table-lamp-a24bcb6b.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.7,
    reviews: 312,
    badge: 'Trending',
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
  {
    id: 'p016',
    name: 'Geometric Wall Mirror',
    category: 'Decor',
    price: 7600,
    description:
      'An arched full-length mirror with a thin powder-coated steel frame in antique brass. Leans against the wall or can be wall-mounted with included hardware.',
    dimensions: { width: 60, height: 150, depth: 3 },
    material: 'Steel, Glass',
    color: 'Antique Brass',
    image: null,
    modelUrl: '/models/chairs-side-chair-9c7f1f71.glb',
    modelFormat: 'glb',
    inStock: true,
    rating: 4.6,
    reviews: 188,
    badge: null,
    thumbnailUrl: null,
    affiliateUrl: 'https://www.amazon.in',
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

/** Filter + search products from mock data */
export const filterProducts = ({ category = 'All', search = '' } = {}) => {
  let result = [...mockProducts];
  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category);
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  return result;
};

/** Get a single product by id */
export const getProductById = (id) => mockProducts.find((p) => p.id === id) || null;

/** Get featured products (first N) */
export const getFeatured = (n = 6) => mockProducts.slice(0, n);
