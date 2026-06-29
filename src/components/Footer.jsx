import React from "react";
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo" style={{ color: "#FAF8F5", marginBottom: "16px" }}>
            <ChefHat size={28} />
            <span>RecipeHub</span>
          </div>
          <p style={{ maxWidth: "320px", fontSize: "14px", lineHeight: "1.6", color: "#A39E93" }}>
            Discover and share recipes from kitchens all around the world. Elevate your culinary experience with our Premium community access and expert recipe catalog.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/recipes" className="footer-link">Browse Recipes</Link>
            <Link to="/login" className="footer-link">Join Us</Link>
          </div>
        </div>

        <div>
          <h4>Contact & Community</h4>
          <p style={{ color: "#A39E93", marginBottom: "8px" }}>support@recipehub.com</p>
          <p style={{ color: "#A39E93" }}>1-800-COOK-HELP</p>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            {/* Social handles placeholder placeholders */}
            <span style={{ fontSize: "13px", color: "#8E897F" }}>Facebook • Instagram • Pinterest</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} RecipeHub. Created by culinary experts. All rights reserved.</p>
      </div>
    </footer>
  );
}
