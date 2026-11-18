import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


if (import.meta.env.DEV) {
  const _warn = console.warn.bind(console);
  console.warn = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Multiple instances of Three.js') ||
      msg.includes('KHR_materials_pbrSpecularGlossiness') ||
      msg.includes('PCFSoftShadowMap has been deprecated') ||
      msg.includes('WebGLProgram: Program Info Log')
    ) return;
    _warn(...args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
