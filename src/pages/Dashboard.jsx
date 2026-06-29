import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Bookmark, ShoppingBag, Save, Clock, Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields state
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Lists state
  const [purchased, setPurchased] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const fetchPurchases = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/payments/my-purchased`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setPurchased(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPurchased(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/favorites`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPurchases();
      fetchFavorites();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required", { className: "toast-custom" });
      return;
    }

    try {
      setUpdatingProfile(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, image }),
        credentials: "include"
      });

      if (res.ok) {
        await refreshUser(); // Sync Context with updated cookie values
        toast.success("Profile updated successfully!", { className: "toast-custom" });
      } else {
        toast.error("Failed to update profile", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Error: " + err.message, { className: "toast-custom" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleRemoveFavorite = async (e, favId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/favorites/${favId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        toast.success("Removed from favorites", { className: "toast-custom" });
        fetchFavorites();
      } else {
        toast.error("Failed to remove favorite", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Error: " + err.message, { className: "toast-custom" });
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "40px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>My Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage your account, bookmarks, and purchased premium content.</p>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar Tabs */}
        <aside className="dashboard-sidebar">
          <div
            onClick={() => setActiveTab("profile")}
            className={`sidebar-tab ${activeTab === "profile" ? "active" : ""}`}
          >
            <User size={18} />
            <span>Profile Settings</span>
          </div>

          <div
            onClick={() => setActiveTab("favorites")}
            className={`sidebar-tab ${activeTab === "favorites" ? "active" : ""}`}
          >
            <Bookmark size={18} />
            <span>My Favorites ({favorites.length})</span>
          </div>

          <div
            onClick={() => setActiveTab("purchases")}
            className={`sidebar-tab ${activeTab === "purchases" ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            <span>Purchased Recipes ({purchased.length})</span>
          </div>
        </aside>

        {/* Tab Content Display */}
        <main style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #E5DEC9" }}>
          
          {/* PROFILE SETTINGS TAB */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Profile Information</h2>
              <form onSubmit={handleUpdateProfile} style={{ maxWidth: "500px" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label">Email Address (Cannot change)</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="form-input"
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)", cursor: "not-allowed" }}
                    disabled
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={updatingProfile} style={{ display: "flex", gap: "8px" }}>
                  <Save size={18} /> {updatingProfile ? "Saving Details..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}

          {/* MY FAVORITES TAB */}
          {activeTab === "favorites" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Bookmarks Catalog</h2>
              {loadingFavorites ? (
                <p>Loading favorited recipes...</p>
              ) : favorites.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>You haven't favorited any recipes yet.</p>
              ) : (
                <div className="recipe-grid" style={{ marginTop: 0 }}>
                  {favorites.map((fav) => {
                    const r = fav.recipeId;
                    if (!r) return null;
                    return (
                      <div key={fav._id} className="recipe-card">
                        <div className="card-img-wrapper">
                          <img src={r.recipeImage} alt={r.recipeName} className="card-img" />
                          <span className="card-tag">{r.category}</span>
                          {r.price > 0 && (
                            <span className="card-price-badge">${r.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="card-body">
                          <div className="card-meta">
                            <span>{r.cuisineType}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={14} /> {r.preparationTime} min
                            </span>
                          </div>
                          <h3 className="card-title">{r.recipeName}</h3>
                          <div className="card-footer" style={{ marginTop: "16px", gap: "10px" }}>
                            <Link to={`/recipes/${r._id}`} className="btn btn-secondary btn-sm" style={{ flexGrow: 1, padding: "6px" }}>
                              View
                            </Link>
                            <button
                              onClick={(e) => handleRemoveFavorite(e, fav._id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: "6px", display: "flex", color: "#ffffff" }}
                              title="Remove Bookmark"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PURCHASED RECIPES TAB */}
          {activeTab === "purchases" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Unlocked Premium Recipes</h2>
              {loadingPurchased ? (
                <p>Loading purchased collection...</p>
              ) : purchased.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>You haven't purchased any premium recipes yet.</p>
              ) : (
                <div className="recipe-grid" style={{ marginTop: 0 }}>
                  {purchased.map((p) => {
                    const r = p.recipeId;
                    if (!r) return null;
                    return (
                      <Link to={`/recipes/${r._id}`} key={p._id} className="recipe-card">
                        <div className="card-img-wrapper">
                          <img src={r.recipeImage} alt={r.recipeName} className="card-img" />
                          <span className="card-tag">{r.category}</span>
                          <span className="card-price-badge" style={{ backgroundColor: "var(--primary)" }}>Unlocked</span>
                        </div>
                        <div className="card-body">
                          <div className="card-meta">
                            <span>{r.cuisineType}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={14} /> {r.preparationTime} min
                            </span>
                          </div>
                          <h3 className="card-title">{r.recipeName}</h3>
                          <div className="card-footer" style={{ marginTop: "16px" }}>
                            <span className="btn btn-secondary btn-sm" style={{ width: "100%" }}>Open Recipe Book</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
