import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

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

export default function App() {
  return (
    <AuthProvider>
      <Router>
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}
