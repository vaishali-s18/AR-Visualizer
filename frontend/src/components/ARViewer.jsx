import { useState, useEffect, useRef } from 'react';
import { Smartphone, QrCode, AlertTriangle, X, HelpCircle, Check, Eye } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { loadModelViewer } from '../utils/loadModelViewer';
import { getShareableUrl } from '../utils/getShareableUrl';

/**
 * Resolves any relative GLB path to an absolute URL.
 */
const getAbsoluteModelUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return new URL(url, baseUrl).href;
};

const ARViewer = ({
  glbUrl,
  name = 'Furniture',
  height = '100%',
  className = '',
  style = {},
  autoRotate = true,
  onArStatusChange,
  productId,
  arPath,
}) => {
  const viewerRef = useRef(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showMobileHelp, setShowMobileHelp] = useState(false);
  const [mobileHelpReason, setMobileHelpReason] = useState('secure-context');
  const [_arStatus, setArStatus] = useState('not-presenting');

  // Detect platform and environment
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isSecure = typeof window !== 'undefined' && window.isSecureContext;

  const resolvedGlbUrl = getAbsoluteModelUrl(glbUrl);
  const targetArUrl = arPath || (productId ? `/ar/${productId}` : undefined);
  const currentUrl = typeof window !== 'undefined' ? getShareableUrl(targetArUrl) : '';

  // 1. Lazy load @google/model-viewer
  useEffect(() => {
    let mounted = true;
    loadModelViewer()
      .then(() => {
        if (mounted) setModelViewerLoaded(true);
      })
      .catch((err) => {
        console.error('[ARViewer] Failed to load @google/model-viewer:', err);
      });
    return () => { mounted = false; };
  }, []);

  // 2. Feature detection on model-viewer element
  useEffect(() => {
    if (!modelViewerLoaded || !viewerRef.current) return;
    const mv = viewerRef.current;

    const checkAR = () => {
      const canActivate = Boolean(mv.canActivateAR);
      setArSupported(canActivate);
    };

    const handleLoad = () => {
      setModelLoaded(true);
      checkAR();
    };

    const handleError = (e) => {
      console.error(`[ARViewer] Failed to load model from "${resolvedGlbUrl}":`, e);
      setModelError(true);
      setModelLoaded(true);
    };

    const handleArStatus = (e) => {
      const status = e.detail?.status || 'unknown';
      setArStatus(status);
      if (onArStatusChange) onArStatusChange(status);
    };

    mv.addEventListener('load', handleLoad);
    mv.addEventListener('error', handleError);
    mv.addEventListener('ar-status', handleArStatus);

    if (mv.loaded) {
      handleLoad();
    } else {
      checkAR();
    }

    return () => {
      mv.removeEventListener('load', handleLoad);
      mv.removeEventListener('error', handleError);
      mv.removeEventListener('ar-status', handleArStatus);
    };
  }, [modelViewerLoaded, resolvedGlbUrl, onArStatusChange]);

  const handleLaunchAR = async () => {
    if (!viewerRef.current) return;

    if (isMobile && !isSecure) {
      setMobileHelpReason('secure-context');
      setShowMobileHelp(true);
      return;
    }

    if (!viewerRef.current.canActivateAR) {
      setMobileHelpReason('unsupported');
      setShowMobileHelp(true);
      return;
    }

    try {
      await viewerRef.current.activateAR();
    } catch (err) {
      console.warn('[ARViewer] AR activation error:', err);
      setMobileHelpReason('activation');
      if (isMobile) setShowMobileHelp(true);
    }
  };

  return (
    <div
      className={`ar-viewer-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        minHeight: 320,
        background: 'var(--bg, #f5f3f0)',
        borderRadius: 'var(--radius-lg, 16px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Loading Skeleton */}
      {(!modelViewerLoaded || (!modelLoaded && !modelError)) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.875rem',
          background: 'var(--surface-2, #ebe7df)',
        }}>
          <svg
            width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="var(--tan, #c4a57b)" strokeWidth="2" strokeLinecap="round"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle cx="12" cy="12" r="10" opacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2, #6b635b)', fontWeight: 500 }}>
            Loading 3D asset…
          </p>
        </div>
      )}

      {/* Model Error Fallback */}
      {modelError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--surface-2, #ebe7df)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🪑</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text, #1a1a1a)', marginBottom: '0.25rem' }}>
            Model Unavailable
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-3, #8c827a)', maxWidth: 260 }}>
            Unable to load "{name}". Check your network or file URL.
          </p>
        </div>
      )}

      {/* The @google/model-viewer Web Component */}
      {modelViewerLoaded && resolvedGlbUrl && (
        <model-viewer
          ref={viewerRef}
          src={resolvedGlbUrl}
          alt={`3D model of ${name}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          camera-controls
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="1.0"
          touch-action="pan-y"
          auto-rotate={autoRotate}
          auto-rotate-delay="1000"
          rotation-per-second="25deg"
          camera-orbit="45deg 75deg 105%"
          field-of-view="30deg"
          loading="lazy"
          reveal="auto"
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            display: 'block',
            background: 'transparent',
            '--poster-color': 'transparent',
          }}
        >
          {/* Custom AR Button slot */}
          <button
            slot="ar-button"
            className="ar-launch-button"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              backgroundColor: '#111827',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            <Smartphone size={18} />
            <span>View in your room</span>
          </button>
        </model-viewer>
      )}

      {/* MOBILE CONTROLS & AR LAUNCH BAR */}
      {isMobile && modelLoaded && !modelError && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <button
            onClick={handleLaunchAR}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#111827',
              color: '#ffffff',
              border: '1.5px solid rgba(196,165,123,0.5)',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <Smartphone size={18} style={{ color: '#C4A57B' }} />
            <span>Project in Your Room (AR)</span>
          </button>

          <div style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            borderRadius: 999,
            padding: '0.35rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}>
            <span style={{ fontSize: '0.72rem', color: '#ffffff' }}>
              Touch & drag to rotate 360° · Pinch to scale
            </span>
          </div>
        </div>
      )}

      {/* DESKTOP QR CODE BAR */}
      {!isMobile && modelLoaded && !modelError && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 12,
          background: 'rgba(26, 26, 26, 0.88)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Smartphone size={18} style={{ color: 'var(--tan, #C4A57B)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.78rem', lineHeight: 1.4, margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              Open on your phone to project true-to-scale AR in your room
            </p>
          </div>
          <button
            onClick={() => setShowQR(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '0.35rem 0.65rem',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <QrCode size={13} />
            <span>Scan QR</span>
          </button>
        </div>
      )}

      {/* QR Code Modal for desktop users */}
      {showQR && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
          onClick={() => setShowQR(false)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#1a1a1a',
              borderRadius: 20,
              padding: '2rem',
              maxWidth: 360,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setShowQR(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Experience in Real AR
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              Scan with your phone's camera to see <strong>{name}</strong> at 1:1 true physical scale on your floor.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', background: '#f9fafb', borderRadius: 12, marginBottom: '1.25rem' }}>
              <QRCodeSVG value={currentUrl} size={180} level="M" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Requires Chrome (Android) or Safari (iOS). No app download needed.
            </p>
          </div>
        </div>
      )}

      {/* MOBILE CAMERA AR SETUP MODAL (IF HTTP BLOCKS CAMERA) */}
      {showMobileHelp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
          onClick={() => setShowMobileHelp(false)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#1a1a1a',
              borderRadius: 24,
              padding: '2rem',
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={20} style={{ color: 'var(--tan, #C4A57B)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Mobile AR Camera Setup
                </h3>
              </div>
              <button
                onClick={() => setShowMobileHelp(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {mobileHelpReason === 'secure-context'
                ? <>Camera AR requires a secure HTTPS page. Open this site using an HTTPS address reachable from your phone; localhost on your computer will not work on the phone.</>
                : mobileHelpReason === 'unsupported'
                  ? <>This browser or device cannot start model-viewer AR. Try current Chrome on Android or Safari on iPhone, and allow camera/motion permissions.</>
                  : <>AR could not start. Check camera permissions, use a supported mobile browser, and make sure the product model has loaded.</>}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B', marginBottom: '0.25rem' }}>
                  Check your device setup
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Connect your phone and computer to the same Wi-Fi, open the HTTPS link (not 127.0.0.1), accept the development certificate warning, then allow camera access.
                </p>
              </div>

              <div style={{ background: 'rgba(196,165,123,0.1)', padding: '0.85rem', borderRadius: 12, border: '1px solid rgba(196,165,123,0.3)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#9A7A52', marginBottom: '0.25rem' }}>
                  Option B: Interactive 3D Room Touch View (Active Now)
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  You can already rotate the true 3D model 360°, inspect textures, and pinch to zoom directly on your screen right now!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMobileHelp(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Back to 3D Touch Studio
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      ` }} />
    </div>
  );
};

export default ARViewer;
