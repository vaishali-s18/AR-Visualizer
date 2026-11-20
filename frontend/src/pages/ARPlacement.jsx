import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Smartphone, QrCode, Info, X, Move, RotateCw, Maximize2,
  Trash2, Copy, RefreshCw, Plus, LayoutGrid, Ruler, Share2, Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getProductById, getProducts } from '../api/products';
import {
  createDesign,
  getDesignById,
  updateDesign,
  enableDesignSharing,
  disableDesignSharing,
} from '../api/designs';
import { logEvent } from '../api/analytics';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import RoomScene from '../components/RoomScene';
import ARViewer from '../components/ARViewer';
import { loadModelViewer } from '../utils/loadModelViewer';
import { getShareableUrl } from '../utils/getShareableUrl';

// Local category list (consistent with seed data)
const CATEGORIES = ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor'];

const ARPlacement = () => {
  const { id, designId } = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { buyNow } = useCart();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // ── Placed Items State ─────────────────────────────────────────────────────
  const [placedItems, setPlacedItems] = useState([]);
  const [selectedItemUuid, setSelectedItemUuid] = useState(null);

  // ── Product / Design Loading ───────────────────────────────────────────────
  const [product, setProduct] = useState(null); // Initial product (if routing from details)
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('Living Room Design');
  const [roomDimensions, setRoomDimensions] = useState({ width: 8, depth: 8, height: 3.5 });
  const [budgetCap, setBudgetCap] = useState(0);
  const [viewMode, setViewMode] = useState(isMobile ? 'ar' : '3d'); // '3d' | 'ar' (defaults to 'ar' on mobile)

  useEffect(() => {
    loadModelViewer().catch(err => console.warn('[ARPlacement] loadModelViewer error:', err));
  }, []);

  // ── Transform & Control State ──────────────────────────────────────────────
  const [controlMode, setControlMode] = useState('translate'); // translate | rotate | scale
  const [replaceMode, setReplaceMode] = useState(false);       // When true, clicking a product swaps the selected one

  // ── UI States ──────────────────────────────────────────────────────────────
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [showQR,   setShowQR]   = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [showARInfo, setShowARInfo] = useState(true);
  const [saveError, setSaveError] = useState('');

  // ── Sidebar Category & Catalog ──────────────────────────────────────────────
  const [selectedCategory,  setSelectedCategory]  = useState('Sofas');
  const [sidebarProducts,   setSidebarProducts]   = useState([]);

  const currentURL = getShareableUrl();

  // ── Initialize Scene (Load Product or Load Saved Design) ─────────────────────
  useEffect(() => {
    let cancelled = false;
    const initScene = async () => {
      setLoading(true);
      setSaveError('');
      try {
        if (designId) {
          console.log(`[ARPlacement Init] Loading from Saved Design ID: "${designId}"`);
          // Loading an existing room design
          const design = await getDesignById(designId);
          if (cancelled) return;
          console.log(`[ARPlacement Init] Loaded Design Name: "${design.roomName || 'My Room'}", Placed items count: ${design.items?.length || 0}`);
          setRoomName(design.roomName || 'My Room');
          setRoomDimensions({
            width: design.roomDimensions?.width || 8,
            depth: design.roomDimensions?.depth || 8,
            height: design.roomDimensions?.height || 3.5,
          });
          setBudgetCap(design.budgetCap || 0);
          setIsShared(Boolean(design.publicShareToken));
          if (design.publicShareToken) {
            setShareUrl(`${window.location.origin}/shared/${design.publicShareToken}`);
          }

          const loadedItems = (design.items || []).map(item => {
            const prod = item.productId || {};
            return {
              uuid: Math.random().toString(36).slice(2, 9),
              productId: prod._id || item.productId,
              name: prod.name || 'Unknown Furniture',
              modelUrl: prod.modelUrl || '',
              thumbnailUrl: prod.thumbnailUrl || '',
              price: prod.price || 0,
              dimensions: prod.dimensions || {},
              position: item.position || { x: 0, y: 0, z: 0 },
              rotation: item.rotation || 0,
              scale: item.scale || 1,
              color: item.color || '',
              finish: item.finish || 'original',
              isScaled: true // Already scaled inside RoomScene previously
            };
          });

          setPlacedItems(loadedItems);
          if (loadedItems.length > 0) {
            setSelectedItemUuid(loadedItems[0].uuid);
          }
          logEvent('design_opened', designId);
        } else if (id) {
          console.log(`[ARPlacement Init] Loading from Product ID: "${id}"`);
          // Loading from a single product (starts a new design)
          const prod = await getProductById(id);
          if (cancelled) return;
          console.log(`[ARPlacement Init] Loaded Product Name: "${prod.name}", Model URL: "${prod.modelUrl}"`);
          setProduct(prod);
          setSelectedCategory(prod.category || 'Sofas');

          const initialItem = {
            uuid: Math.random().toString(36).slice(2, 9),
            productId: prod._id || prod.id,
            name: prod.name,
            modelUrl: prod.modelUrl,
            thumbnailUrl: prod.thumbnailUrl,
            price: prod.price,
            dimensions: prod.dimensions || {},
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            scale: 1,
            color: '',
            finish: 'original',
            isScaled: false
          };

          setPlacedItems([initialItem]);
          setSelectedItemUuid(initialItem.uuid);
          setRoomName(`My ${prod.category} Design`);
          logEvent('ar_opened', prod._id || id);
        }
      } catch (err) {
        console.error('Failed to initialize scene:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initScene();
    return () => { cancelled = true; };
  }, [id, designId]);

  // ── Load Sidebar Products ──────────────────────────────────────────────────
  useEffect(() => {
    getProducts({ category: selectedCategory })
      .then(prods => setSidebarProducts(prods))
      .catch(() => setSidebarProducts([]));
  }, [selectedCategory]);


  // ── Multi-Object Operations ───────────────────────────────────────────────
  
  // Add a product to the room layout
  const handleAddProduct = (prod) => {
    const newItem = {
      uuid: Math.random().toString(36).slice(2, 9),
      productId: prod._id || prod.id,
      name: prod.name,
      modelUrl: prod.modelUrl,
      thumbnailUrl: prod.thumbnailUrl,
      price: prod.price,
      dimensions: prod.dimensions || {},
      // Place with a slight random offset in horizontal plane to avoid overlapping pivots
      position: { 
        x: parseFloat(((Math.random() - 0.5) * 2.5).toFixed(2)), 
        y: 0, 
        z: parseFloat(((Math.random() - 0.5) * 2.5).toFixed(2)) 
      },
      rotation: 0,
      scale: 1,
      color: '',
      finish: 'original',
      isScaled: false
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItemUuid(newItem.uuid);
    logEvent('product_added_to_room', prod._id || prod.id);
  };

  // Swap currently selected product with a different one
  const handleReplaceProduct = (newProd) => {
    if (!selectedItemUuid) return;
    
    setPlacedItems(prev => prev.map(item => {
      if (item.uuid === selectedItemUuid) {
        return {
          ...item,
          productId: newProd._id || newProd.id,
          name: newProd.name,
          modelUrl: newProd.modelUrl,
          thumbnailUrl: newProd.thumbnailUrl,
          price: newProd.price,
          dimensions: newProd.dimensions || {},
          color: '',
          finish: 'original',
          isScaled: false // Recompute scale for the new model geometry
        };
      }
      return item;
    }));
    
    setReplaceMode(false);
    logEvent('product_replaced_in_room', newProd._id || newProd.id);
  };

  // Sidebar product click handler
  const handleCatalogItemClick = (prod) => {
    if (replaceMode) {
      handleReplaceProduct(prod);
    } else {
      handleAddProduct(prod);
    }
  };

  // Delete the selected object
  const handleDeleteSelected = () => {
    if (!selectedItemUuid) return;
    setPlacedItems(prev => prev.filter(item => item.uuid !== selectedItemUuid));
    setSelectedItemUuid(null);
  };

  // Duplicate the selected object
  const handleDuplicateSelected = () => {
    if (!selectedItemUuid) return;
    const target = placedItems.find(item => item.uuid === selectedItemUuid);
    if (!target) return;

    const clone = {
      ...target,
      uuid: Math.random().toString(36).slice(2, 9),
      // Shift slightly along X and Z axis
      position: {
        x: parseFloat((target.position.x + 0.6).toFixed(2)),
        y: target.position.y,
        z: parseFloat((target.position.z + 0.6).toFixed(2)),
      },
      isScaled: true // Preserve scaling factor
    };

    setPlacedItems(prev => [...prev, clone]);
    setSelectedItemUuid(clone.uuid);
  };

  // Switch mobile layout to AR view for a selected placed item
  const handleViewPlacedItemInAR = async (item) => {
    try {
      setLoading(true);
      console.log(`[ARPlacement Mobile AR] Fetching product info for placing: ${item.name} (${item.productId})`);
      const prod = await getProductById(item.productId);
      console.log(`[ARPlacement Mobile AR] Product loaded. Swapping view to AR with modelUrl: ${prod.modelUrl}`);
      setProduct(prod);
      setViewMode('ar');
    } catch (err) {
      console.error("[ARPlacement Mobile AR Error] Failed to load product for AR view:", err);
      alert("Failed to load 3D model for AR view.");
    } finally {
      setLoading(false);
    }
  };

  // Sync transform modifications from 3D Canvas back into React items state
  const handleTransformChange = useCallback((uuid, newTransform) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.uuid === uuid) {
        return {
          ...item,
          position: newTransform.position,
          rotation: newTransform.rotation,
          scale:    newTransform.scale,
          isScaled: true
        };
      }
      return item;
    }));
  }, []);

  // ── Save/Update Design Layout ──────────────────────────────────────────────
  const handleSave = async () => {
    if (placedItems.length === 0) {
      setSaveError('Cannot save an empty room layout. Place some items first!');
      return;
    }
    if (
      roomDimensions.width < 2 || roomDimensions.width > 30 ||
      roomDimensions.depth < 2 || roomDimensions.depth > 30 ||
      roomDimensions.height < 2 || roomDimensions.height > 8
    ) {
      setSaveError('Room dimensions must be between 2–30 m wide/deep and 2–8 m high.');
      return;
    }

    if (!user) {
      // Redirect to login if user is unauthenticated
      setSaveError('Please sign in to save your design layouts.');
      localStorage.setItem('ar_pending_items', JSON.stringify(placedItems));
      localStorage.setItem('ar_pending_name', roomName);
      setTimeout(() => navigate('/login'), 1800);
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = {
      roomName,
      roomDimensions,
      budgetCap,
      items: placedItems.map(item => ({
        productId: item.productId,
        position:  item.position,
        rotation:  item.rotation,
        scale:     item.scale,
        color: item.color || undefined,
        finish: item.finish || 'original',
      })),
    };

    try {
      if (designId) {
        // Update existing design
        await updateDesign(designId, payload);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        logEvent('design_updated', designId);
      } else {
        // Create new design
        const newDesign = await createDesign(payload);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          // Redirect to the newly created design ID path
          navigate(`/ar/design/${newDesign._id}`, { replace: true });
        }, 1200);
        logEvent('design_created', newDesign._id);
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError('Failed to save design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Selected object info block
  const selectedItem = placedItems.find(item => item.uuid === selectedItemUuid);

  // Compute total design budget
  const totalBudget = placedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const shoppingList = placedItems.reduce((list, item) => {
    const key = `${item.productId}:${item.color || ''}:${item.finish || 'original'}`;
    const existing = list.find(entry => entry.key === key);
    if (existing) {
      existing.quantity += 1;
    } else {
      list.push({ key, item, quantity: 1 });
    }
    return list;
  }, []);

  const handleToggleSharing = async () => {
    if (!designId) {
      setSaveError('Save this design before creating a share link.');
      return;
    }
    setSharing(true);
    setSaveError('');
    try {
      if (isShared) {
        await disableDesignSharing(designId);
        setIsShared(false);
        setShareUrl('');
      } else {
        const { token } = await enableDesignSharing(designId);
        const url = `${window.location.origin}/shared/${token}`;
        setIsShared(true);
        setShareUrl(url);
        setShowShare(true);
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Unable to update design sharing. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareUrl(true);
      window.setTimeout(() => setCopiedShareUrl(false), 2000);
    } catch {
      setSaveError('Could not copy the link. Select and copy it from the field instead.');
    }
  };

  const handleDownloadShoppingList = () => {
    const quoteCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Product', 'Quantity', 'Finish', 'Color', 'Unit price (INR)', 'Line total (INR)'],
      ...shoppingList.map(({ item, quantity }) => [
        item.name,
        quantity,
        item.finish || 'original',
        item.color || 'Original',
        Number(item.price) || 0,
        (Number(item.price) || 0) * quantity,
      ]),
      ['Total', '', '', '', '', totalBudget],
      ['Budget cap (INR)', '', '', '', '', budgetCap || 'No limit'],
    ];
    const csv = rows.map(row => row.map(quoteCsv).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roomName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'room'}-shopping-list.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ paddingTop: 80, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Loading 3D workspace…</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
      </div>
    );
  }

  /* ── AR Single-Object Viewer Mode ─────────────────────────── */
  if (viewMode === 'ar' && product) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)', position: 'relative' }}>

        {/* Top View Mode Switcher for Mobile */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          zIndex: 40,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            padding: '0.3rem',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '0.35rem',
          }}>
            <button
              onClick={() => setViewMode('3d')}
              className={viewMode === '3d' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              style={{ borderRadius: 999, fontSize: '0.78rem', padding: '0.35rem 0.95rem' }}
            >
              🛋️ 3D Studio
            </button>
            <button
              onClick={() => setViewMode('ar')}
              className={viewMode === 'ar' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              style={{ borderRadius: 999, fontSize: '0.78rem', padding: '0.35rem 0.95rem' }}
            >
              📱 Camera AR
            </button>
          </div>
        </div>

        {/* AR Info Banner */}
        {showARInfo && (
          <div style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'rgba(26,26,26,0.95)', color: '#fff', padding: '1rem 1.25rem', zIndex: 30, display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Info size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                <strong>True-to-Scale Floor AR:</strong>
              </p>
              <ol style={{ fontSize: '0.8rem', lineHeight: 1.6, paddingLeft: '1.25rem', margin: 0 }}>
                <li>Tap <strong>"Project in Your Room"</strong> below</li>
                <li>Point your camera at the floor in a well-lit space</li>
                <li>Move your phone slowly in circles to detect floor surface</li>
                <li>Furniture will place automatically at 1:1 physical scale</li>
              </ol>
            </div>
            <button onClick={() => setShowARInfo(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 0 }}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* Reusable ARViewer component with true-to-scale floor placement */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ARViewer
            glbUrl={product.modelUrl}
            name={product.name}
            height="100%"
            productId={product._id || product.id || id}
          />
        </div>

        {/* Bottom panel */}
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', zIndex: 15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>{product.name}</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
                ₹{product.price?.toLocaleString('en-IN')} {product.dimensions?.width && `· ${product.dimensions.width}W × ${product.dimensions.height}H cm`}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving || saved} className="btn btn-outline" style={{ flex: 1 }}>
              <Save size={14} /> {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Design'}
            </button>
            <button
              onClick={() => buyNow(product)}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Buy Now
            </button>
          </div>
          <button onClick={() => navigate('/catalogue')} style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', border: 'none', background: 'none', color: 'var(--text-2)', fontSize: '0.875rem', cursor: 'pointer' }}>
            ← Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  /* ── DESKTOP & TABLET: Multi-Object Room Editor ───────────────────────────── */
  const CONTROL_MODES = [
    { mode: 'translate', icon: <Move size={14} />,    label: 'Move' },
    { mode: 'rotate',    icon: <RotateCw size={14} />, label: 'Rotate' },
    { mode: 'scale',     icon: <Maximize2 size={14} />, label: 'Scale' },
  ];

  const controlHint = {
    translate: 'Drag arrows to slide object · Click floor to deselect',
    rotate:    'Drag ring to rotate object · Click floor to deselect',
    scale:     'Drag center handle to resize · Click floor to deselect',
  }[controlMode];

  return (
    <div style={{ paddingTop: 80, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Top Control Bar ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        
        {/* Room Title Editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/designs')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}
          >
            <ArrowLeft size={18} />
          </button>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.25rem',
              fontWeight: 600,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text)',
              borderBottom: '1px dashed var(--border)',
              padding: '0 4px',
              width: 240
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Transform controls selection */}
          {selectedItemUuid && CONTROL_MODES.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setControlMode(mode)}
              className={controlMode === mode ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              style={{ borderRadius: 8 }}
            >
              {icon} <span className="hidden-tablet">{label}</span>
            </button>
          ))}

          {selectedItemUuid && <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 0.25rem' }} />}

          {/* Quick Stats Overlay Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-3)' }}>Budget:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>₹{totalBudget.toLocaleString('en-IN')}</strong>
          </div>

          <button onClick={() => setShowRoomSettings(true)} className="btn btn-outline btn-sm" title="Room measurements and shopping list" style={{ borderRadius: 8 }}>
            <Ruler size={15} /> <span className="hidden-tablet">Room & Budget</span>
          </button>

          <button
            onClick={() => (isShared ? setShowShare(true) : handleToggleSharing())}
            disabled={sharing}
            className="btn btn-outline btn-sm"
            title={isShared ? 'Manage share link' : 'Create public read-only share link'}
            style={{ borderRadius: 8 }}
          >
            <Share2 size={15} /> <span className="hidden-tablet">{sharing ? 'Sharing…' : isShared ? 'Shared' : 'Share'}</span>
          </button>

          <button onClick={() => setShowQR(true)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 8 }}>
            <QrCode size={15} /> <span className="hidden-tablet">Mobile AR</span>
          </button>

          <button onClick={handleSave} disabled={saving || saved} className="btn btn-primary btn-sm" style={{ borderRadius: 8 }}>
            <Save size={14} /> {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Design'}
          </button>
        </div>
      </div>

      {/* ── Main Workspace split screen ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left Sidebar Catalogue ────────────────────────────────────────── */}
        <div style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'hidden', flexShrink: 0 }}>
          
          {/* Category Scroller */}
          <div style={{ padding: '1.25rem 1rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.6rem' }}>
              Add to Room
            </p>
            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }} className="category-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 99,
                    border: 'none',
                    background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-2)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginRight: 4
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Products Grid */}
          <div style={{ flex: 1, padding: '1.25rem 1rem', overflowY: 'auto' }}>
            {replaceMode && (
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', display: 'flex', gap: 6, flexDirection: 'column' }}>
                <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Replace Mode Active</p>
                <p style={{ fontSize: '0.7rem', color: '#b45309', lineHeight: 1.3 }}>Select a product below to swap the highlighted item.</p>
                <button className="btn btn-outline btn-sm" onClick={() => setReplaceMode(false)} style={{ padding: '0.2rem', fontSize: '0.7rem', background: '#fff' }}>Cancel</button>
              </div>
            )}

            {sidebarProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-3)', fontSize: '0.8rem' }}>No products found.</div>
            ) : (
              sidebarProducts.map(p => {
                const pid = p._id || p.id;
                return (
                  <div key={pid} style={{ marginBottom: '1.25rem', position: 'relative' }}>
                    <div
                      style={{ 
                        aspectRatio: '4/3', 
                        borderRadius: 10, 
                        overflow: 'hidden', 
                        background: 'var(--bg)', 
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onClick={() => handleCatalogItemClick(p)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      {p.modelUrl ? (
                        <model-viewer
                          src={p.modelUrl}
                          alt={p.name}
                          auto-rotate
                          rotation-per-second="20deg"
                          camera-orbit="45deg 75deg 105%"
                          field-of-view="30deg"
                          shadow-intensity="0.6"
                          loading="lazy"
                          reveal="auto"
                          style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'var(--bg)' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-3)' }}>{p.name}</div>
                      )}
                      {/* Plus hover indicator */}
                      <div className="add-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                        {replaceMode ? <RefreshCw size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.4rem', gap: 4 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-2)' }}>₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Center 3D Room Canvas ─────────────────────────────────────────── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          
          {saveError && (
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.85rem', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Error:</span> {saveError}
              <button onClick={() => setSaveError('')} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>
          )}

          <RoomScene
            placedItems={placedItems}
            selectedItemUuid={selectedItemUuid}
            onSelectItem={setSelectedItemUuid}
            onUpdateItemTransform={(uuid, transform) => handleTransformChange(uuid, transform)}
            controlMode={controlMode}
            roomDimensions={roomDimensions}
          />

          {/* Product details & selection controls overlay */}
          {selectedItem ? (
            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', boxShadow: 'var(--shadow-lg)', maxWidth: 300, backdropFilter: 'blur(8px)' }}>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--bg)', border: '1px solid var(--border)', flexShrink: 0 }}>
                  {selectedItem.modelUrl ? (
                    <model-viewer
                      src={selectedItem.modelUrl}
                      alt={selectedItem.name}
                      auto-rotate
                      rotation-per-second="15deg"
                      camera-orbit="45deg 75deg 105%"
                      field-of-view="30deg"
                      loading="lazy"
                      reveal="auto"
                      style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'var(--bg)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text-3)' }}>3D</div>
                  )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.name}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', margin: 0 }}>₹{selectedItem.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Manipulation Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleDuplicateSelected} 
                  className="btn btn-outline btn-sm" 
                  title="Duplicate Object"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 8, display: 'flex', justifyContent: 'center' }}
                >
                  <Copy size={14} /> <span style={{ fontSize: '0.75rem', marginLeft: 4 }}>Clone</span>
                </button>
                <button 
                  onClick={() => setReplaceMode(!replaceMode)} 
                  className={replaceMode ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} 
                  title="Swap with another item"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 8, display: 'flex', justifyContent: 'center' }}
                >
                  <RefreshCw size={14} style={{ animation: replaceMode ? 'spin 3s linear infinite' : 'none' }} /> <span style={{ fontSize: '0.75rem', marginLeft: 4 }}>Replace</span>
                </button>
                <button 
                  onClick={handleDeleteSelected} 
                  className="btn btn-outline btn-sm" 
                  title="Delete Object"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: '1.5px solid #fca5a5', color: '#ef4444', display: 'flex', justifyContent: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Trash2 size={14} /> <span style={{ fontSize: '0.75rem', marginLeft: 4 }}>Delete</span>
                </button>
              </div>

              {/* Custom appearance */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
                  Finish
                  <select
                    className="input"
                    value={selectedItem.finish || 'original'}
                    onChange={e => setPlacedItems(prev => prev.map(item => (
                      item.uuid === selectedItemUuid ? { ...item, finish: e.target.value } : item
                    )))}
                    style={{ width: '100%', padding: '0.4rem', marginTop: 3, fontSize: '0.75rem' }}
                  >
                    <option value="original">Original</option>
                    <option value="fabric">Fabric</option>
                    <option value="wood">Wood</option>
                    <option value="leather">Leather</option>
                    <option value="metal">Metal</option>
                  </select>
                </label>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
                  Color
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <input
                      type="color"
                      value={selectedItem.color || '#ffffff'}
                      onChange={e => setPlacedItems(prev => prev.map(item => (
                        item.uuid === selectedItemUuid ? { ...item, color: e.target.value } : item
                      )))}
                      aria-label="Furniture color"
                      style={{ width: 38, height: 32, padding: 2, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setPlacedItems(prev => prev.map(item => (
                        item.uuid === selectedItemUuid ? { ...item, color: '' } : item
                      )))}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, padding: '0.35rem', fontSize: '0.68rem' }}
                    >
                      Original
                    </button>
                  </div>
                </label>
              </div>

              {/* View in AR trigger */}
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleViewPlacedItemInAR(selectedItem)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Smartphone size={14} /> View in AR
                </button>
              </div>

              {/* Spatial placement statistics */}
              <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.7rem', color: 'var(--text-3)' }}>
                <div>Position: X: {selectedItem.position.x}, Z: {selectedItem.position.z}</div>
                <div>Rotation: {Math.round(selectedItem.rotation * (180/Math.PI))}°</div>
              </div>
            </div>
          ) : (
            /* Empty selection state tip */
            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(26,26,26,0.85)', color: '#fff', borderRadius: 12, padding: '0.8rem 1.25rem', fontSize: '0.8rem', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(4px)' }}>
              <LayoutGrid size={15} style={{ color: 'var(--tan)' }} />
              <span>Click on any furniture piece to select and modify it.</span>
            </div>
          )}

          {/* Desktop Controls Hint */}
          <div style={{ position: 'absolute', bottom: 24, right: 24, background: 'rgba(26,26,26,0.88)', color: '#fff', borderRadius: 10, padding: '0.625rem 1.25rem', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', backdropFilter: 'blur(8px)', pointerEvents: 'none' }}>
            {selectedItemUuid ? controlHint : 'Right-click + drag to rotate camera · Scroll to zoom'}
          </div>
        </div>
      </div>

      {/* ── Mobile QR Code Modal ────────────────────────────────────────────── */}
      {showRoomSettings && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => setShowRoomSettings(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-settings-title"
            style={{ width: 'min(620px, 100%)', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface)', borderRadius: 18, padding: '1.5rem', boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 id="room-settings-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Room measurements & budget</h2>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: 3 }}>Enter your measured room size in metres.</p>
              </div>
              <button onClick={() => setShowRoomSettings(false)} aria-label="Close room settings" style={{ border: 0, background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              {[
                ['width', 'Width', 2, 30],
                ['depth', 'Depth', 2, 30],
                ['height', 'Ceiling height', 2, 8],
              ].map(([key, label, min, max]) => (
                <label key={key} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  {label} (m)
                  <input
                    className="input"
                    type="number"
                    min={min}
                    max={max}
                    step="0.1"
                    value={roomDimensions[key]}
                    onChange={e => setRoomDimensions(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </label>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 6 }}>Allowed: 2–30 m wide/deep and 2–8 m high.</p>

            <label style={{ display: 'block', marginTop: '1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>
              Spending limit (₹, optional)
              <input
                className="input"
                type="number"
                min="0"
                step="1000"
                value={budgetCap || ''}
                placeholder="No limit"
                onChange={e => setBudgetCap(Math.max(0, Number(e.target.value) || 0))}
                style={{ width: '100%', marginTop: 4 }}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.25rem 0 0.6rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Shopping list</h3>
              <strong style={{ color: budgetCap > 0 && totalBudget > budgetCap ? '#dc2626' : 'var(--accent)' }}>
                ₹{totalBudget.toLocaleString('en-IN')}
              </strong>
            </div>
            {budgetCap > 0 && (
              <p style={{ fontSize: '0.8rem', color: totalBudget > budgetCap ? '#dc2626' : 'var(--text-2)', marginBottom: '0.75rem' }}>
                {totalBudget > budgetCap
                  ? `Over budget by ₹${(totalBudget - budgetCap).toLocaleString('en-IN')}`
                  : `₹${(budgetCap - totalBudget).toLocaleString('en-IN')} remaining`}
              </p>
            )}
            {shoppingList.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', padding: '0.75rem 0' }}>Add furniture to build your shopping list.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '0.75rem' }}>
                {shoppingList.map(({ key, item, quantity }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '0.78rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span>{item.name} × {quantity}<span style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.68rem' }}>{item.finish || 'original'} · {item.color || 'original color'}</span></span>
                    <strong style={{ whiteSpace: 'nowrap' }}>₹{((Number(item.price) || 0) * quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleDownloadShoppingList} disabled={!shoppingList.length} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={14} /> Download CSV shopping list
            </button>
          </div>
        </div>
      )}

      {showShare && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => setShowShare(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-design-title"
            style={{ width: 'min(480px, 100%)', background: 'var(--surface)', borderRadius: 18, padding: '1.5rem', boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 id="share-design-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Share this room design</h2>
              <button onClick={() => setShowShare(false)} aria-label="Close share dialog" style={{ border: 0, background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Anyone with the link can view this saved layout. They cannot edit it. You can revoke access at any time.
            </p>
            {saveError && <p role="alert" style={{ color: '#b91c1c', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{saveError}</p>}
            {isShared ? (
              <>
                <input
                  className="input"
                  readOnly
                  value={shareUrl}
                  onFocus={e => e.target.select()}
                  aria-label="Public design link"
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleCopyShareUrl} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {copiedShareUrl ? 'Copied!' : 'Copy link'}
                  </button>
                  <button onClick={handleToggleSharing} disabled={sharing} className="btn btn-outline" style={{ color: '#b91c1c' }}>
                    {sharing ? 'Revoking…' : 'Revoke link'}
                  </button>
                </div>
              </>
            ) : (
              <button onClick={handleToggleSharing} disabled={sharing || !designId} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {sharing ? 'Creating link…' : 'Create share link'}
              </button>
            )}
            {!designId && <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem' }}>Save the design first to share it.</p>}
          </div>
        </div>
      )}

      {showQR && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}
          onClick={() => setShowQR(false)}
        >
          <div
            style={{ background: 'var(--surface)', borderRadius: 24, padding: '2.5rem', maxWidth: 480, textAlign: 'center', boxShadow: 'var(--shadow-lg)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowQR(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-3)' }}>
              <X size={20} />
            </button>

            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Smartphone size={36} style={{ color: 'var(--accent)' }} />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Scan to view in Mobile AR
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Scan this QR code with your phone to open this room layout and view the items in augmented reality.
            </p>

            <div style={{ padding: '2rem', background: '#fff', borderRadius: 16, display: 'inline-block', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <QRCodeSVG value={currentURL} size={256} level="H" includeMargin={false} />
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>Steps:</p>
              <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>Scan the QR code with your smartphone camera.</li>
                <li>Tap the link notification to open this room designer.</li>
                <li>Ensure you are logged in to access and edit designs.</li>
                <li>Select a model and click "View in AR" to launch WebXR!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* CSS overrides for styling hover additions */}
      <style>{`
        .add-overlay { opacity: 0; }
        div:hover > .add-overlay { opacity: 1 !important; }
        .category-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .hidden-tablet { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ARPlacement;
