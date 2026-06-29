import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Clock, Heart, Filter } from "lucide-react";

import RecipeCard from "../components/RecipeCard";

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Category filter and Pagination states
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoriesList = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  const fetchRecipes = () => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    // Construct search query
    let url = `${apiUrl}/api/recipes?page=${page}&limit=6`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (selectedCategories.length > 0) {
      url += `&category=${encodeURIComponent(selectedCategories.join(","))}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes || []);
        setTotalPages(data.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setLoading(false);
      });
  };

  // Re-fetch when page or category filters change
  useEffect(() => {
    fetchRecipes();
  }, [page, selectedCategories]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  const handleCategoryToggle = (category) => {
    setPage(1);
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Explore Recipes</h1>
        <p style={{ color: "var(--text-secondary)" }}>Find your next culinary project from our collection of handpicked recipes.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "40px", alignItems: "start" }}>
        {/* Left Side: Filter Sidebar */}
        <aside style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #E5DEC9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontWeight: "bold" }}>
            <Filter size={18} />
            <span>Filters</span>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ marginBottom: "28px" }}>
            <label className="form-label">Search Recipe</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="e.g. Lasagna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingRight: "36px" }}
              />
              <button
                type="submit"
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8E897F", cursor: "pointer" }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div>
            <label className="form-label" style={{ marginBottom: "12px" }}>Categories</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categoriesList.map((category) => (
                <label key={category} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Grid results */}
        <main>
          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading catalog...</p>
          ) : recipes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "18px", fontWeight: "bold" }}>No recipes matched your search criteria.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategories([]);
                  setPage(1);
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "16px" }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="recipe-grid" style={{ marginTop: 0 }}>
                {recipes.map((recipe) => (
                  <RecipeCard recipe={recipe} key={recipe._id}>
                    <div className="card-footer">
                      <span className="btn btn-secondary btn-sm">View Details</span>
                      <span className="card-likes">
                        <Heart size={16} fill="var(--accent)" /> {recipe.likesCount}
                      </span>
                    </div>
                  </RecipeCard>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`btn btn-secondary btn-sm ${page === 1 ? 'btn-disabled' : ''}`}
                    style={{ padding: "8px" }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`btn btn-secondary btn-sm ${page === totalPages ? 'btn-disabled' : ''}`}
                    style={{ padding: "8px" }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
