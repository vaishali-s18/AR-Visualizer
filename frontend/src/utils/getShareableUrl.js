export const getShareableUrl = () => {
  const currentUrl = new URL(window.location.href);
  const publicUrl = import.meta.env.VITE_PUBLIC_URL?.trim();

  if (!publicUrl) return currentUrl.href;

  try {
    const publicBase = new URL(publicUrl);
    const path = `${publicBase.pathname.replace(/\/$/, '')}${currentUrl.pathname}`;
    publicBase.pathname = path;
    publicBase.search = currentUrl.search;
    publicBase.hash = currentUrl.hash;
    return publicBase.href;
  } catch (error) {
    console.error('Invalid VITE_PUBLIC_URL:', error);
    return currentUrl.href;
  }
};
