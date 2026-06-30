import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ChefHat, LogOut, User, LayoutDashboard, UtensilsCrossed, Award, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully", { className: "toast-custom" });
      navigate("/");
    } catch (err) {
      toast.error("Logout failed: " + err.message, { className: "toast-custom" });
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <ChefHat size={28} />
          <span>RecipeHub</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse Recipes
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-recipes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Recipes
              </NavLink>
              {user.role === "admin" ? (
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Admin Dashboard
                </NavLink>
              ) : (
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  My Dashboard
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="nav-actions">
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm" title="Toggle Theme" style={{ padding: "8px", borderRadius: "50%" }}>
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{user.name}</span>
                {user.isPremium ? (
                  <span className="user-badge" style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                    <Award size={12} /> Premium
                  </span>
                ) : user.role === "admin" ? (
                  <span className="user-badge" style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}>
                    Admin
                  </span>
                ) : (
                  <span className="user-badge" style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                    Standard
                  </span>
                )}
              </div>

              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #15803D" }}
                />
              ) : (
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#15803D", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: "8px" }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
