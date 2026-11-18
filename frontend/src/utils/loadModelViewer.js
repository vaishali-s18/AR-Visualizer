let modelViewerPromise = null;

/**
 * Dynamically loads @google/model-viewer on demand.
 * This ensures the heavy library (~1MB) is lazy-loaded and not downloaded
 * during the initial page bundle parse.
 */
export const loadModelViewer = () => {
  if (typeof window === 'undefined') return Promise.resolve();

  // If already registered as a custom element, resolve immediately
  if (window.customElements && window.customElements.get('model-viewer')) {
    return Promise.resolve();
  }

  if (!modelViewerPromise) {
    modelViewerPromise = import('@google/model-viewer')
      .then(() => {
        return window.customElements.whenDefined('model-viewer');
      })
      .catch((err) => {
        console.warn('[@google/model-viewer] Dynamic import failed, falling back to CDN script:', err);
        return new Promise((resolve, reject) => {
          if (window.customElements && window.customElements.get('model-viewer')) {
            return resolve();
          }
          const existingScript = document.querySelector('script[src*="model-viewer"]');
          if (existingScript) {
            existingScript.addEventListener('load', resolve);
            existingScript.addEventListener('error', reject);
            return;
          }
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js';
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
          document.head.appendChild(script);
        });
      });
  }

  return modelViewerPromise;
};
