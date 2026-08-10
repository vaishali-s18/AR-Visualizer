import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // Global design system styles loaded first
import App from './App.jsx'

// This is the entry point — React mounts the entire app into the <div id="root">
// in index.html. StrictMode helps catch potential issues during development.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
