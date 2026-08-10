# AR Interior Design Visualizer

This project is an AR Interior Design Visualizer that lets users browse a furniture catalogue and place true-to-scale 3D furniture models into their real room using their phone's camera (AR) to preview items before buying.

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
   npm install
   ```
3. Ensure you have copied `.env.example` to `.env` and fill in any variables if necessary (this is already provided).
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend**: React + Vite
- **AR Rendering**: `<model-viewer>` (Google's web component, built on Three.js + WebXR)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **3D Assets**: glTF/GLB furniture models
- **Hosting**: Vercel (frontend), Render (backend), MongoDB Atlas (database)
