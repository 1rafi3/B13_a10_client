import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Loading from "./components/Loading";

// Pages
import Home from "./pages/Home";
import BrowseRecipes from "./pages/BrowseRecipes";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import NotFound from "./pages/NotFound";

function MainApp() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loading message="Authenticating session..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<BrowseRecipes />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private User Routes */}
              <Route
                path="/my-recipes"
                element={
                  <ProtectedRoute>
                    <MyRecipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-cancel"
                element={
                  <ProtectedRoute>
                    <PaymentCancel />
                  </ProtectedRoute>
                }
              />

              {/* Private Admin Route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Fallback Redirect */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
