import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Clock, Heart, BookOpen, Lock, ShieldAlert, Award, ChevronLeft, ThumbsUp, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Likes and modal states
  const [likes, setLikes] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchRecipeDetails = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      // We pass credentials: "include" to send our JWT cookie
      const res = await fetch(`${apiUrl}/api/recipes/${id}`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
        setLikes(data.likesCount || 0);
      } else {
        toast.error("Failed to load recipe details", { className: "toast-custom" });
        navigate("/recipes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading recipe", { className: "toast-custom" });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorited = async () => {
    if (!user) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/favorites`, {
        credentials: "include"
      });
      if (res.ok) {
        const favorites = await res.json();
        const found = favorites.some((fav) => fav.recipeId?._id === id);
        setIsFavorited(found);
      }
    } catch (err) {
      console.error("Failed to check favorites:", err);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  useEffect(() => {
    checkIfFavorited();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this recipe!", { className: "toast-custom" });
      navigate("/login");
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/${id}/like`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likesCount);
        toast.success("Recipe liked!", { className: "toast-custom" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error("Please login to favorite recipes!", { className: "toast-custom" });
      navigate("/login");
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/${id}/favorite`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
        toast.success(data.message, { className: "toast-custom" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyRecipe = async () => {
    if (!user) {
      toast.error("Please sign in to purchase recipes", { className: "toast-custom" });
      navigate("/login");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type: "recipe", recipeId: id }),
        credentials: "include"
      });

      const data = await res.json();
      if (data.id) {
        if (data.isMock) {
          toast.success("Redirecting to Mock Checkout...", { className: "toast-custom" });
          setTimeout(() => {
            window.location.href = `/payment-success?session_id=${data.id}&is_mock=true&mock_type=recipe&recipe_id=${id}&amount=${recipe.price}`;
          }, 800);
        } else {
          toast.success("Redirecting to Stripe Checkout...", { className: "toast-custom" });
          window.location.href = data.url || `https://checkout.stripe.com/pay/${data.id}`;
        }
      } else {
        toast.error(data.message || "Failed to create checkout session", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Checkout failed: " + err.message, { className: "toast-custom" });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error("Please select a reason for reporting", { className: "toast-custom" });
      return;
    }

    try {
      setSubmittingReport(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: reportReason }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Recipe reported.", { className: "toast-custom" });
        setReportModalOpen(false);
        setReportReason("");
      } else {
        toast.error(data.message || "Failed to submit report", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Failed to report: " + err.message, { className: "toast-custom" });
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: "80px 24px" }}><p>Loading recipe details...</p></div>;
  }

  if (!recipe) {
    return <div className="container" style={{ padding: "80px 24px" }}><p>Recipe not found.</p></div>;
  }

  return (
    <div className="container section-padding" style={{ paddingTop: "32px" }}>
      <Link to="/recipes" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", marginBottom: "24px", fontWeight: "600" }}>
        <ChevronLeft size={16} /> Back to Catalog
      </Link>

      <div className="recipe-detail">
        {/* Left Column: Image and Recipe Data */}
        <div>
          <div className="recipe-header-section">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="card-tag" style={{ position: "static" }}>{recipe.category}</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>{recipe.cuisineType} Cuisine</span>
              {recipe.price > 0 && (
                <span className="user-badge" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
                  <Award size={12} /> Premium Recipe
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "38px" }}>{recipe.recipeName}</h1>
            <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              Created by <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{recipe.authorName}</span>
            </p>
          </div>

          <img src={recipe.recipeImage} alt={recipe.recipeName} className="recipe-detail-img" />

          {/* Social Controls */}
          <div style={{ display: "flex", gap: "12px", margin: "24px 0" }}>
            <button onClick={handleLike} className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "8px" }}>
              <ThumbsUp size={16} /> Like ({likes})
            </button>
            
            <button onClick={handleFavoriteToggle} className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "8px", color: isFavorited ? "var(--primary)" : "inherit", borderColor: isFavorited ? "var(--primary)" : "var(--border)" }}>
              <Bookmark size={16} fill={isFavorited ? "var(--primary)" : "none"} /> 
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </button>

            <button onClick={() => setReportModalOpen(true)} className="btn btn-danger btn-sm" style={{ display: "flex", gap: "8px", marginLeft: "auto", backgroundColor: "transparent", color: "#DC2626", borderColor: "#FEE2E2" }}>
              <ShieldAlert size={16} /> Report
            </button>
          </div>

          {/* Unlocked Details */}
          {!recipe.isLocked ? (
            <div style={{ marginTop: "32px" }}>
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "22px", marginBottom: "16px", borderBottom: "2px solid var(--border)", paddingBottom: "8px" }}>Ingredients</h3>
                <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                      <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "var(--primary)", borderRadius: "50%" }}></span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "22px", marginBottom: "16px", borderBottom: "2px solid var(--border)", paddingBottom: "8px" }}>Step-by-Step Directions</h3>
                <ol style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "20px" }}>
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} style={{ color: "var(--text-secondary)" }}>
                      <p style={{ color: "var(--text-primary)", fontWeight: "500" }}>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            /* Locked State Overlay styling */
            <div className="locked-container">
              {/* Blurred skeleton content placeholder */}
              <div className="locked-blur">
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Ingredients</h3>
                <p>• 2 cups organic secrets</p>
                <p>• 1 teaspoon premium locking compound</p>
                <p>• 4 tablespoons mystery mixture</p>
                <h3 style={{ fontSize: "20px", margin: "16px 0 12px 0" }}>Preparation Directions</h3>
                <p>1. First blur this segment to safeguard intellectual cooking property...</p>
              </div>

              <div className="locked-overlay">
                <div className="locked-card">
                  <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "var(--accent-light)", color: "var(--accent)", borderRadius: "50%", marginBottom: "16px" }}>
                    <Lock size={24} />
                  </div>
                  <h4 style={{ fontSize: "18px", marginBottom: "8px" }}>Recipe Locked</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    This is a Premium Cookbook Recipe. Purchase it individually to permanently unlock the recipe details.
                  </p>
                  
                  {user ? (
                    <button onClick={handleBuyRecipe} className="btn btn-accent" style={{ width: "100%", justifyContent: "center" }}>
                      Buy Recipe for ${recipe.price.toFixed(2)}
                    </button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Link to="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                        Sign In to Unlock
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recipe Summary Card */}
        <aside>
          <div style={{ backgroundColor: "var(--bg-secondary)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)", position: "sticky", top: "100px", boxShadow: "var(--shadow-sm)" }}>
            <h4 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
              <BookOpen size={20} /> Culinary Info
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Prep Time</span>
                <span style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={16} /> {recipe.preparationTime} mins
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Difficulty</span>
                <span style={{ fontWeight: "600" }}>{recipe.difficultyLevel}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Cuisine Type</span>
                <span style={{ fontWeight: "600" }}>{recipe.cuisineType}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Price</span>
                <span style={{ fontWeight: "700", color: recipe.price > 0 ? "var(--accent)" : "var(--primary)" }}>
                  {recipe.price > 0 ? `$${recipe.price.toFixed(2)}` : "Free"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
                <ShieldAlert size={20} style={{ color: "#DC2626" }} /> Report Recipe
              </h3>
              <button onClick={() => setReportModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>
            
            <form onSubmit={handleReportSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Help us keep RecipeHub safe. Please choose a reason why this recipe violates our community standards:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["Spam", "Offensive Content", "Copyright Issue"].map((reason) => (
                    <label key={reason} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "15px" }}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        style={{ width: "18px", height: "18px", accentColor: "#DC2626" }}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setReportModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={submittingReport}>
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
