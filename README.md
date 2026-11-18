# AR Interior Design Visualizer

This project is an AR Interior Design Visualizer that lets users browse a furniture catalogue and place true-to-scale 3D furniture models into their real room using their phone's camera (AR) to preview items before buying.

## Room planner

The 3D room editor supports multi-item layouts, room dimensions entered in metres, per-item colour and finish previews, and a budget cap with a downloadable CSV shopping list. Save a design to create a public, read-only share link; the owner can revoke that link from the editor. Room dimensions are user-entered (not camera-scanned), and furniture sizing uses product dimension metadata when available.

## Project Structure

- **`/frontend`**: React + Vite frontend application.
- **`/backend`**: Node.js + Express backend application.

## How to run locally

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have copied `.env.example` to `.env` and fill in any variables if necessary (this is already provided).
4. Start the server (once your server script is defined, currently none exists but you will typically run `node index.js` or define a script in `package.json`).

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Ensure you have copied `.env.example` to `.env` and fill in any variables if necessary (this is already provided).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📱 Testing on a Mobile Phone (AR Camera)

AR camera access and Android Google Scene Viewer **require HTTPS and a public URL** — `localhost` or private local IP (`192.168.x.x`) will not work on mobile for Scene Viewer downloads.

### Quick Phone Testing with ngrok:
1. Start your local frontend dev server (default port `5173`):
   ```bash
   cd frontend
   npm run dev
   ```
2. In a separate terminal, expose the Vite port via ngrok HTTPS tunnel:
   ```bash
   npx ngrok http 5173
   ```
3. Copy the generated public HTTPS URL (e.g. `https://xxxx-xx-xx.ngrok-free.app`).
4. Open this URL on your mobile phone:
   - **Android**: Use standard **Google Chrome** (ensure *Google Play Services for AR / ARCore* is installed).
   - **iPhone**: Use standard **Apple Safari** (iOS 12+).
   - ⚠️ *Do not open through in-app browsers like Instagram, WhatsApp, or LinkedIn, as they block WebXR and camera intent.*
5. Browse any product or go to Catalogue / Product Page, tap **"View in your room"**, point camera at a flat floor surface, and move your device slowly to place furniture at true 1:1 scale!

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. **Push repository to GitHub**.
2. Connect your repository to **Vercel** or **Netlify**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
3. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend URL on Render (e.g. `https://ar-visualizer-backend.onrender.com`)
   - `VITE_USE_MOCK`: `false` (or `true` if deploying demo frontend without active database)
   - `VITE_PUBLIC_URL`: Your Vercel domain (e.g. `https://your-ar-visualizer.vercel.app`)

### Backend Deployment (Render)
1. In the **Render Dashboard**, create a new **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
2. **Environment Variables**:
   - `PORT`: `3000` (or leave default, Render sets `PORT` automatically)
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret string
   - `CLIENT_URL`: Comma-separated list of allowed frontend origins (e.g. `https://your-ar-visualizer.vercel.app,http://localhost:5173`)

---

## Tech Stack
- **Frontend**: React 19 + Vite + TailwindCSS
- **Desktop 3D Room Planner**: Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Mobile AR Rendering**: `@google/model-viewer` (WebXR + Android Google Scene Viewer + iOS Quick Look USDZ generation)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **3D Assets**: glTF/GLB furniture models with true-to-scale floor placement
- **Hosting**: Vercel (frontend), Render (backend)

