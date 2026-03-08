# 📱 Teel - Twitter But Better

Welcome to **Teel**, a minimalist, brutalist-inspired social platform. Teel takes the micro-blogging concept and applies a stunning bespoke, editorial aesthetic alongside modern interactions, such as an Instagram Reels-like snap-scrolling feed and a custom interactive floating dock.

### 🌐 Live Application
**Experience Teel live right now:**
[**https://teel-twitter-but-better.onrender.com**](https://teel-twitter-but-better.onrender.com)

---

## ✨ Features
*   **Brutalist Editorial UI:** High-contrast, typography-heavy design language utilizing beautiful off-whites (`#F0EFEB`) and stark blacks.
*   **Reels-like Snapping Feed:** A completely custom CSS snap-scroll feed that snaps posts to the viewport perfectly—locking one post on screen at a time, exactly like Instagram Reels or TikTok.
*   **Floating Dock Navigation:** A zero-dependency, fully-custom Mac OS/iOS style floating dock at the bottom of the screen with active-state tracking, hover expansions, and integrated SVGs.
*   **Dynamic Context Global State:** Hand-built React Context providing seamless state management across components without heavy libraries.
*   **Full Stack Integration:** Connected to a robust Express backend running a MongoDB database seamlessly managed by Mongoose.

## 🛠️ Technology Stack

**Frontend**
*   [React 19](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS v4](https://tailwindcss.com/)
*   [React Router DOM](https://reactrouter.com/)
*   [React Hook Form](https://react-hook-form.com/)

**Backend**
*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
*   [CORS](https://www.npmjs.com/package/cors)
*   [Dotenv](https://www.npmjs.com/package/dotenv)

## 🚀 Running Locally

If you would like to run and modify Teel locally, follow these steps:

### Prerequisites
*   Node.js installed
*   A MongoDB connection URI cluster
*   Git

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/teel
    ```
2.  **Setup the Backend:**
    ```bash
    cd Teel/Backend
    npm install
    ```
    Create a `.env` file in the `Backend` folder and add your specific MongoDB URI:
    ```env
    MONGO_URI=your_mongodb_cluster_connection_string
    PORT=3000
    ```
    Start the backend server:
    ```bash
    npm run start
    # or if using nodemon:
    npx nodemon .\server.js
    ```

3.  **Setup the Frontend:**
    Open a new terminal and navigate to the frontend directory:
    ```bash
    cd Teel/Frontend
    npm install
    ```
    *Note: Currently, the frontend is pointed to the live production backend. If you wish to test fully locally, you will need to change the Axios post/get URLs mapped in `Feed.jsx` and `Form.jsx` back to `http://localhost:3000/post/...`.*

    Start the frontend Vite dev server:
    ```bash
    npm run dev
    ```

4.  **View the App:**
    Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).

---

*Designed and engineered with passion.* 
