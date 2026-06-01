# 📱 Teel — A Brutalist-Inspired Creative Social Hub & Micro-Blogging Platform

[![React 19](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.2.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-6fa660?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-v5.2.1-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-f60?style=for-the-badge&logo=pwa)](https://vite-pwa-org.netlify.app/)

Welcome to **Teel**, a minimalist, brutalist-inspired micro-blogging platform engineered for creators and tastemakers. Moving away from generic, cluttered feeds, Teel delivers a premium editorial aesthetic using high-contrast typography (featuring *Clash Grotesk*), sleek off-white surfaces (`#F0EFEB`), smooth glassmorphic active elements, and modern interactive paradigms.

### 🌐 Live Application
Experience the live application right now:  
👉 [**https://teel-twitter-but-better.onrender.com**](https://teel-twitter-but-better.onrender.com)

---

## 💎 Core Architectural Highlights & Features

### 1. 📲 Progressive Web App (PWA) Integration
Teel is engineered as a first-class **Progressive Web App (PWA)**, offering a seamless, native app-like experience on mobile, desktop, and tablet environments.

*   **Zero-Install Friction:** Users can install Teel directly from their web browser (Chrome, Safari, Edge) to their home screen with a single tap.
*   **Fully Immersive Standalone UI:** Running in standalone mode under portrait lock, Teel hides browser toolbars, adapting its canvas to match native system apps.
*   **Advanced Service Worker Caching:** Powered by `vite-plugin-pwa` and Workbox, the application pre-caches critical assets (`HTML`, `CSS`, `JS`, and web fonts) to ensure near-instantaneous boot times on return visits.
*   **Intelligent Runtime Caching:**
    *   **Google Fonts Caching:** Utilizing a `CacheFirst` strategy with a one-year expiration window to avoid typographic layout shifts.
    *   **ImageKit Asset Caching:** Utilizing a `StaleWhileRevalidate` strategy for styling and media assets up to 30 days, optimizing network bandwidth while ensuring immediate media rendering.

---

### 2. ⏳ Auto-Destructing "Temporary Groups"
In traditional social networks, group chats are often created for ephemeral, short-term purposes (planning an event, organizing a weekend trip, sharing transient transactions), leaving a permanent trail of inactive groups that clutter databases and compromise user privacy.

**Teel solves this with dynamic, self-destructing Temporary Groups.**

```
[Create Group] ──► [Define Lifespan (Days)] ──► [Mongoose TTL Index Active] ──► [Auto-Destruct & Cascade Delete]
```

#### 🛡️ The Solution & Benefits:
*   **Absolute Privacy & Data Minimization:** Once a group’s lifespan expires, it automatically deletes itself along with all historical messages, leaving zero footprints.
*   **Clutter-Free Inboxes:** Keeps the conversation drawer relevant and active, removing the need for manual inbox sorting or leaving stale chats.
*   **High Database Performance:** Offloads deletion logic entirely onto the database engine.

#### ⚙️ The Implementation:
*   **TTL Indexing:** The backend utilizes MongoDB's native Time-To-Live (TTL) index inside both the `Group` and `Chat` schemas:
    ```javascript
    // Automatically cleans up the record precisely when the expiresAt timestamp is crossed
    groupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    chatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    ```
*   **Cascade Synchronization:** When creating a temporary group, the backend calculates the target expiry date (`Date.now() + duration * 24 * 60 * 60 * 1000`). To guarantee messaging stability, the Realtime Socket Server retrieves the parent group's expiry metadata on client attachment and appends it to all subsequent message payloads, ensuring both the group container and message history are automatically purged in lockstep.

---

### 3. 🏷️ Curated Stylist "Picklists" (Embedded Link-In-Bio)
For creators, aesthetics are everything. The **Picklist** feature acts as an integrated, visual, and category-filtered curation system directly on the user's profile. Instead of relying on external third-party landing pages like Linktree, creators can list their exact apparel, styling accessories, cosmetic gear, or aesthetic references right inside their social timeline.

*   **Category Curation:** Filterable tags including **Outfit**, **Makeup**, **Hair**, **Shoes**, **Accessories**, and **Other**.
*   **Automated Link Previews & Open-Graph (OG) Scraping:** Creating a picklist item only requires pasting a destination URL. The backend controller initiates a secure scrape using `open-graph-scraper` to pull the website's favicon.
*   **Intelligent Favicon Fallbacks:** If standard OG metadata is missing, the controller leverages the **Google S2 Favicon API** to dynamically extract a clean, high-resolution (`128x128px`) branding icon:
    ```javascript
    const parsedUrl = new URL(item);
    iconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
    ```
*   **Premium Interactive Cards:** Interactive cards redirect visitors cleanly to curated shop pages, featuring dynamic micro-scaling hover effects and smooth glassmorphic UI outlines.

---

### 4. 🎬 Vertical CSS Snap-Scroll Feed (Reels-Style)
Teel replaces standard scrolling feeds with an immersive, full-viewport **Snap-Scroll Feed**, locking one micro-blog post onto the screen at a time, exactly like Instagram Reels or TikTok.

*   **Pure CSS Snapping:** Employs high-performance GPU-accelerated layouts utilizing `snap-y snap-mandatory` along with `scroll-snap-align: start`.
*   **TanStack Infinite Queries:** Powered by `@tanstack/react-query` to fetch post pages asynchronously, maintaining high rendering frame rates.
*   **Smart Scroll Intersection Locking:** Leverages `react-intersection-observer` to watch scroll coordinates. To avoid double-fetching under quick scroll gestures, the feed implements a custom `useRef` visibility latch:
    ```javascript
    const hasTriggeredForCurrentView = useRef(false);
    ```
    This prevents concurrent redundant API calls, updating pages beautifully only as the user approaches the true end of the feed list.
*   **Inline Multi-Media Sliders:** Posts containing multiple images or loop-playable muted videos are loaded inside horizontally snapping inline media grids (`snap-x snap-mandatory`).

---

### 5. 🕶️ Floating OS-Style Dock Navigation
At the footer of the interface floats a beautiful, zero-dependency navigation dock that mimics macOS/iOS design guidelines.
*   **Responsive Proximity Magnification:** Smooth hover transitions scale action buttons and icons in response to pointer gestures.
*   **Integrated Path SVGs:** Lightweight, inline vectorized assets change styling and stroke layouts smoothly based on active-state tracking.
*   **Glassmorphic Aesthetic:** Blurs underlying content using CSS backdrop filters (`backdrop-blur-md border border-white/20`), keeping navigation legible regardless of behind-the-dock imagery.

---

## 🛠️ Unified Technology Stack

### 🚀 Frontend Architecture
*   **Core Engine:** [React 19.2.0](https://react.dev/) + [Vite 7.3.1](https://vitejs.dev/) (lightning-fast Hot Module Replacement).
*   **Design Framework:** [Tailwind CSS v4.2.1](https://tailwindcss.com/) (using lightningcss compiler for premium modern layouts).
*   **State & Cache Synchronization:** [TanStack React Query v5](https://tanstack.com/) for caching, auto-fetching, and cache invalidation.
*   **Form Management:** [React Hook Form v7](https://react-hook-form.com/) for zero-re-render validations.
*   **Routing Architecture:** [React Router DOM v7](https://reactrouter.com/) for page hierarchy and routing pathways.
*   **Realtime Interactivity:** [Socket.io-Client v4](https://socket.io/) matching backend connection standards.

### ⚙️ Backend Architecture
*   **Application Server:** [Node.js](https://nodejs.org/) & [Express v5.2.1](https://expressjs.com/) (taking advantage of asynchronous routing and native error-handling middleware).
*   **Database Engine:** [MongoDB Atlas](https://www.mongodb.com/) managed securely via [Mongoose v9.2.4](https://mongoosejs.com/).
*   **Media Pipeline:** [ImageKit Node SDK](https://imagekit.io/) for modern real-time cloud image transformation and storage.
*   **Real-time Layer:** [Socket.io Server v4.8.3](https://socket.io/) (handling dynamic rooms, user joins, and real-time event broadcasting).
*   **Authentication & Security:** 
    *   Dynamic [JSON Web Tokens (JWT)](https://jwt.io/) sessions.
    *   Secure password hashing via `bcryptjs`.
    *   Stateful cookie management using `cookie-parser`.
    *   Custom passport strategies for seamless **Google OAuth 2.0 Single-Sign-On (SSO)**.

---

## 🚀 Running Locally

Ready to experience or hack on Teel in your local developer sandbox? Follow this guide:

### Prerequisites
*   Node.js (v18.0.0 or higher recommended)
*   A running MongoDB cluster (or local community MongoDB instance)
*   An ImageKit cloud account (for uploading media assets)
*   Google Developer Console client keys (optional, only for Google login validation)

### Phase 1: Clone the Repository
```bash
git clone https://github.com/AnkushSaha01/Teel.git
cd Teel
```

### Phase 2: Setup the Backend Service
1.  Navigate into the `Backend` directory and install the server dependencies:
    ```bash
    cd Backend
    npm install
    ```
2.  Create a `.env` file within the `Backend` folder:
    ```env
    MONGO_URI=your_mongodb_atlas_connection_string
    PORT=3001
    JWT_SECRET=your_custom_jwt_secret_token
    FRONTEND_URL=http://localhost:3000
    
    # ImageKit Keys for File Uploads
    IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
    IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
    IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
    
    # Optional: Google SSO Credentials
    GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```
3.  Launch the backend development server (hot-reloads with nodemon):
    ```bash
    npm run dev
    ```

### Phase 3: Setup the Frontend Application
1.  Open a new terminal shell and navigate to the `Frontend` directory:
    ```bash
    cd ../Frontend
    npm install
    ```
2.  Launch the frontend Vite development server:
    ```bash
    npm run dev
    ```
3.  Open your browser to `http://localhost:3000` (or whichever local address is designated by your Vite CLI).

---

## 🎨 Design Typography & Branding Elements
*   **Aesthetic Tone:** Editorial Brutalism. Stark contrasts, massive titles, geometric layout structures.
*   **Primary Typeface:** *Clash Grotesk* (for headers) combined with high-legibility *Outfit* and *Inter* for chat structures and micro-descriptions.
*   **Core Color Palette:**
    *   Off-White Workspace Background: `#F0EFEB` (warm editorial print page vibe)
    *   Brutalist Dark Ink: `#000000` (stark borders, crisp buttons, bold headers)
    *   Frosted Overlay Glass: `rgba(255, 255, 255, 0.8)` (fluid glassmorphism active backdrops)

*Designed and engineered with passion, elegance, and extreme attention to detail.*
