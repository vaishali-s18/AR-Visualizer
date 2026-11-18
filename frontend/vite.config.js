import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Custom plugin to ensure GLB files are served with the correct MIME type and CORS headers
const glbMimeAndCorsPlugin = () => ({
  name: 'glb-mime-and-cors',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (req.url && req.url.endsWith('.gltf')) {
        res.setHeader('Content-Type', 'model/gltf+json');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (req.url && req.url.endsWith('.gltf')) {
        res.setHeader('Content-Type', 'model/gltf+json');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    glbMimeAndCorsPlugin(),
  ],
  resolve: {
    // Force all packages (three, @react-three/fiber, @react-three/drei)
    // to resolve to the exact same Three.js instance — eliminates the
    // "Multiple instances of Three.js being imported" warning.
    dedupe: ['three'],
    alias: {
      three: path.resolve('./node_modules/three'),
    },
  },
  server: {
    host: true, // Listen on all network addresses (0.0.0.0) for mobile LAN & ngrok access
    allowedHosts: true, // Allow ngrok and other public tunnel domains
    hmr: false, // Disable the failing development WebSocket; reload the mobile page manually.
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
