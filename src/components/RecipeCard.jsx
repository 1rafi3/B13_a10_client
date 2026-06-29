import React from "react";
import { Link } from "react-router-dom";
import { Clock, Heart } from "lucide-react";

export default function RecipeCard({ recipe, children }) {
  return (
    <div className="recipe-card">
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
        
        <h3 className="card-title" title={recipe.recipeName}>{recipe.recipeName}</h3>
        <p className="card-author">By {recipe.authorName}</p>
        
        {/* Children allow adding custom actions (like admin controls, bookmark removal, etc.) */}
        {children ? children : (
          <div className="card-footer">
            <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
