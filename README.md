# RecipeHub — Frontend Client

This directory contains the React + Vite frontend client application for **RecipeHub**, a premium recipe sharing and culinary catalog platform.

## 🚀 Technologies Used

1. **Vite + React (JS)**: Superfast development environment and bundler.
2. **Vanilla CSS (Organic Culinary Design System)**: Implemented in `src/index.css` using modern CSS custom properties (variables), glassmorphism, responsive grids, and clean cards. No Tailwind or third-party CSS frameworks are used.
3. **Better Auth Client**: Interacts with the backend Better Auth server using the `@better-auth/react` client library.
4. **React Router DOM**: Client-side routing with protected route walls.
5. **Lucide React**: Premium icon set for consistent visual language.
6. **Framer Motion**: Smooth entry animations for headers and FAQ accordion sections.
7. **React Hot Toast**: Beautiful micro-notifications for user feedback.

## 📂 Directory Structure

```
client/
├── public/              # Static public assets
├── src/
│   ├── components/      # Shared UI layout and route guards
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── context/         # Global React contexts
│   │   └── AuthContext.jsx
│   ├── lib/             # Custom clients and libraries
│   │   └── auth-client.js
│   ├── pages/           # Pages mapping to router paths
│   │   ├── Home.jsx
│   │   ├── BrowseRecipes.jsx
│   │   ├── RecipeDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── MyRecipes.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── PaymentSuccess.jsx
│   │   └── PaymentCancel.jsx
│   ├── App.jsx          # App router and context provider wrapper
│   ├── index.css        # Premium CSS Design System
│   └── main.jsx         # DOM mount entrypoint
├── .env.local           # Local environment variables
├── vite.config.js       # Vite configuration
└── package.json         # Client dependencies and scripts
```

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Authentication & Session Sync

Authentication is managed via `AuthContext.jsx`. It coordinates:
- Standard email/password logins and registrations.
- Google Social Sign In.
- Token synchronization. Better Auth handles HTTP-Only cookies. The client automatically reads the authenticated session and hydrates the user context.
- Protected route walls (`ProtectedRoute` and `AdminRoute`) redirecting unauthenticated traffic to `/login`.
