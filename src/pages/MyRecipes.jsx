import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit3, Trash2, BookOpen, Clock, Heart, Award, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function MyRecipes() {
  const { user } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null); // If null, we are creating

  // Form inputs state
  const [recipeName, setRecipeName] = useState("");
  const [recipeImageFile, setRecipeImageFile] = useState(null);
  const [existingRecipeImage, setExistingRecipeImage] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [cuisineType, setCuisineType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [preparationTime, setPreparationTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState("0");

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchMyRecipes = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/my-recipes`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your recipes", { className: "toast-custom" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const openAddModal = () => {
    setEditingRecipe(null);
    setRecipeName("");
    setRecipeImageFile(null);
    setExistingRecipeImage("");
    setCategory("Breakfast");
    setCuisineType("");
    setDifficultyLevel("Easy");
    setPreparationTime("");
    setIngredients("");
    setInstructions("");
    setPrice("0");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setRecipeName(recipe.recipeName);
    setExistingRecipeImage(recipe.recipeImage);
    setRecipeImageFile(null);
    setCategory(recipe.category);
    setCuisineType(recipe.cuisineType);
    setDifficultyLevel(recipe.difficultyLevel);
    setPreparationTime(recipe.preparationTime.toString());
    setIngredients(recipe.ingredients.join("\n"));
    setInstructions(recipe.instructions.join("\n"));
    setPrice(recipe.price.toString());
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!recipeName || (!recipeImageFile && !existingRecipeImage) || !category || !cuisineType || !difficultyLevel || !preparationTime || !ingredients || !instructions) {
      setFormError("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      let finalRecipeImageUrl = existingRecipeImage;

      if (recipeImageFile) {
        setUploadingImage(true);
        try {
          const { uploadImageToImgbb } = await import("../lib/imgbb");
          finalRecipeImageUrl = await uploadImageToImgbb(recipeImageFile);
        } catch (imgErr) {
          setFormError("Failed to upload image. Please try again.");
          setUploadingImage(false);
          setSubmitting(false);
          return;
        }
        setUploadingImage(false);
      }

      const recipeData = {
        recipeName,
        recipeImage: finalRecipeImageUrl,
        category,
        cuisineType,
        difficultyLevel,
        preparationTime: parseInt(preparationTime),
        ingredients: ingredients.split("\n").map(i => i.trim()).filter(Boolean),
        instructions: instructions.split("\n").map(i => i.trim()).filter(Boolean),
        price: parseFloat(price) || 0
      };

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      let res;
      
      if (editingRecipe) {
        // Edit Recipe
        res = await fetch(`${apiUrl}/api/recipes/${editingRecipe._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(recipeData),
          credentials: "include"
        });
      } else {
        // Create Recipe
        res = await fetch(`${apiUrl}/api/recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(recipeData),
          credentials: "include"
        });
      }

      const data = await res.json();

      if (res.ok) {
        toast.success(editingRecipe ? "Recipe updated!" : "Recipe created successfully!", { className: "toast-custom" });
        setModalOpen(false);
        fetchMyRecipes();
      } else {
        setFormError(data.message || "Failed to process recipe request.");
      }
    } catch (err) {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/${recipeId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        toast.success("Recipe deleted.", { className: "toast-custom" });
        fetchMyRecipes();
      } else {
        toast.error("Failed to delete recipe.", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Delete failed: " + err.message, { className: "toast-custom" });
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>My Cookbooks</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage recipes you have shared on the RecipeHub culinary library.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Plus size={18} /> Add New Recipe
        </button>
      </div>

      {/* standard user limit status */}
      {!user?.isPremium && user?.role !== "admin" && (
        <div style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)", padding: "16px 20px", borderRadius: "12px", display: "flex", gap: "12px", alignItems: "center", marginBottom: "32px", border: "1px solid #FFEDD5" }}>
          <AlertCircle size={20} />
          <div style={{ fontSize: "14px" }}>
            <strong>Publishing Limit Active:</strong> Standard members can publish up to <strong>2 recipes</strong>. Currently you have published <strong>{recipes.length} / 2</strong>.{" "}
            <Link to="/" style={{ textDecoration: "underline", fontWeight: "bold" }}>Upgrade to Premium</Link> for unlimited cookbooks.
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading your recipe archive...</p>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <BookOpen size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "18px", fontWeight: "bold" }}>You haven't shared any recipes yet.</p>
          <button onClick={openAddModal} className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
            Add Your First Recipe
          </button>
        </div>
      ) : (
        <div className="recipe-grid" style={{ marginTop: 0 }}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <div className="card-img-wrapper">
                <img src={recipe.recipeImage} alt={recipe.recipeName} className="card-img" />
                <span className="card-tag">{recipe.category}</span>
                {recipe.price > 0 && (
                  <span className="card-price-badge">${recipe.price.toFixed(2)}</span>
                )}
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span>{recipe.cuisineType}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} /> {recipe.preparationTime} min
                  </span>
                </div>
                <h3 className="card-title">{recipe.recipeName}</h3>
                
                {/* Moderation status display */}
                <div style={{ marginTop: "8px", fontSize: "13px" }}>
                  {recipe.status === "active" ? (
                    <span style={{ color: "var(--primary)", fontWeight: "600" }}>● Active in Catalog</span>
                  ) : (
                    <span style={{ color: "#DC2626", fontWeight: "600" }}>● Blocked / Flagged</span>
                  )}
                </div>

                <div className="card-footer" style={{ gap: "10px", marginTop: "16px" }}>
                  <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary btn-sm" style={{ flexGrow: 1, padding: "6px" }}>
                    View
                  </Link>
                  <button onClick={() => openEditModal(recipe)} className="btn btn-secondary btn-sm" style={{ padding: "6px", display: "flex", color: "var(--primary)" }}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(recipe._id)} className="btn btn-secondary btn-sm" style={{ padding: "6px", display: "flex", color: "#DC2626" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Form Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "20px" }}>{editingRecipe ? "Edit Recipe" : "Add Recipe"}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, marginBottom: "20px", borderLeft: "4px solid #B91C1C" }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Recipe Title *</label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="e.g. Grandma's Famous Apple Pie"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Recipe Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setRecipeImageFile(e.target.files[0])}
                    className="form-input"
                    required={!existingRecipeImage}
                  />
                  {existingRecipeImage && !recipeImageFile && (
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      Current Image: <img src={existingRecipeImage} alt="Recipe" style={{ width: "40px", height: "40px", borderRadius: "4px", verticalAlign: "middle", marginLeft: "8px", objectFit: "cover" }} />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty *</label>
                    <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} className="form-input">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cuisine Type *</label>
                    <input
                      type="text"
                      value={cuisineType}
                      onChange={(e) => setCuisineType(e.target.value)}
                      placeholder="e.g. French, Mexican"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prep Time (mins) *</label>
                    <input
                      type="number"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      placeholder="e.g. 45"
                      min="1"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ingredients * (One per line)</label>
                  <textarea
                    rows="4"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="2 cups flour&#10;1 cup sugar&#10;1 tsp baking powder"
                    className="form-input"
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Directions * (One step per line)</label>
                  <textarea
                    rows="4"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Preheat oven to 350°F&#10;Mix dry ingredients together&#10;Bake for 45 minutes"
                    className="form-input"
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($) (Set to 0 for Free recipe)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                  {uploadingImage ? "Uploading Image..." : submitting ? "Saving..." : "Save Recipe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
