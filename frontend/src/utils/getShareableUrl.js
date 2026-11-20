/**
 * Returns a publicly shareable / scannable URL for mobile devices and QR codes.
 *
 * - When running in production (e.g. *.vercel.app, *.netlify.app, or custom domain),
 *   it ALWAYS uses the deployed window.location.origin so scanned QR codes open the live deployed site.
 * - When running locally (localhost / 127.0.0.1), it uses VITE_PUBLIC_URL (e.g. ngrok tunnel or LAN IP)
 *   so smartphones on the same Wi-Fi or via tunnel can reach the computer.
 * - Accepts an optional `targetPath` (e.g. `/ar/p001`) to direct mobile scanners straight to AR view.
 */
export const getShareableUrl = (targetPath) => {
  if (typeof window === 'undefined') return '';

  const currentUrl = new URL(window.location.href);
  const isLocalHost = currentUrl.hostname === 'localhost' || currentUrl.hostname === '127.0.0.1';
  const publicUrl = import.meta.env.VITE_PUBLIC_URL?.trim();

  let baseOrigin = currentUrl.origin;

  // Only fall back to VITE_PUBLIC_URL when testing locally on localhost
  if (isLocalHost && publicUrl) {
    try {
      baseOrigin = new URL(publicUrl).origin;
    } catch (err) {
      console.warn('[getShareableUrl] Invalid VITE_PUBLIC_URL:', err);
      baseOrigin = currentUrl.origin;
    }
  }

  // Use custom targetPath if provided, otherwise preserve current route
  const path = targetPath
    ? (targetPath.startsWith('/') ? targetPath : `/${targetPath}`)
    : currentUrl.pathname;

  try {
    const finalUrl = new URL(path, baseOrigin);
    if (!targetPath) {
      finalUrl.search = currentUrl.search;
      finalUrl.hash = currentUrl.hash;
    }
    return finalUrl.href;
  } catch (err) {
    console.error('[getShareableUrl] Error resolving URL:', err);
    return currentUrl.href;
  }
};
