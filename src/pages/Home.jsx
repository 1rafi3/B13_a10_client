import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Flame, Star, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, Heart, Clock } from "lucide-react";
import toast from "react-hot-toast";

import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [popularRecipes, setPopularRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Accordion active state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Fetch popular
    fetch(`${apiUrl}/api/recipes/popular`)
      .then((res) => res.json())
      .then((data) => {
        setPopularRecipes(Array.isArray(data) ? data : []);
        setLoadingPopular(false);
      })
      .catch((err) => {
        console.error("Error fetching popular recipes:", err);
        setLoadingPopular(false);
      });

    // Fetch featured
    fetch(`${apiUrl}/api/recipes/featured`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedRecipes(Array.isArray(data) ? data : []);
        setLoadingFeatured(false);
      })
      .catch((err) => {
        console.error("Error fetching featured recipes:", err);
        setLoadingFeatured(false);
      });
  }, []);

  const handleUpgradeToPremium = async () => {
    if (!user) {
      toast.error("Please login to upgrade to Premium", { className: "toast-custom" });
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
        body: JSON.stringify({ type: "membership" }),
        credentials: "include"
      });

      const data = await res.json();
      if (data.id) {
        if (data.isMock) {
          toast.success("Redirecting to Mock Checkout...", { className: "toast-custom" });
          setTimeout(() => {
            window.location.href = `/payment-success?session_id=${data.id}&is_mock=true&mock_type=membership`;
          }, 800);
        } else {
          toast.success("Redirecting to Stripe Checkout...", { className: "toast-custom" });
          // If real Stripe is initialized, redirect directly
          window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        }
      } else {
        toast.error(data.message || "Failed to initiate payment session", { className: "toast-custom" });
      }
    } catch (err) {
      toast.error("Upgrade error: " + err.message, { className: "toast-custom" });
    }
  };

  const faqData = [
    {
      q: "What is RecipeHub?",
      a: "RecipeHub is a central sharing platform for food enthusiasts. Users can browse a catalog of free and premium culinary recipes, bookmark their favorites, and publish their own creations."
    },
    {
      q: "How do the recipe limits work?",
      a: "Standard members can publish up to 2 recipes for free. To publish unlimited recipes, you can upgrade to a Premium lifetime membership for just $10."
    },
    {
      q: "What are premium/paid recipes?",
      a: "Authors can choose to lock premium recipes behind a specific price point. Standard users can buy individual premium recipes to permanently unlock access to ingredients and directions."
    },
    {
      q: "Is OAuth (Google Sign In) supported?",
      a: "Yes! You can easily sign up and sign in using your Google account in addition to email/password registration."
    }
  ];

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {/* Hero / Premium Upgrade Banner */}
      <div className="hero-banner" style={{ marginTop: "40px" }}>
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Savor the Art of Homemade Cooking
          </motion.h1>
          <p className="hero-subtitle">
            Explore authentic recipes from culinary experts. Upgrade to share your own and unlock premium cookbooks.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/recipes" className="btn btn-accent">
              Browse All Recipes <ArrowRight size={18} />
            </Link>

            {user?.isPremium ? (
              <div className="btn btn-secondary btn-disabled" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "#ffffff", borderColor: "transparent" }}>
                Premium Account Active
              </div>
            ) : (
              <button onClick={handleUpgradeToPremium} className="btn btn-secondary">
                Go Premium ($10)
              </button>
            )}
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600"
            alt="Cooking Chef"
          />
        </div>
      </div>

      {/* Popular Recipes Section */}
      <section style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Flame style={{ color: "var(--accent)" }} />
          <h2 style={{ fontSize: "28px" }}>Trending Recipes</h2>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Our community's highly liked and reviewed recipes of the week.</p>

        {loadingPopular ? (
          <p style={{ color: "var(--text-muted)" }}>Loading delicious recipes...</p>
        ) : popularRecipes.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No recipes available yet.</p>
        ) : (
          <div className="recipe-grid">
            {popularRecipes.map((recipe) => (
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
        )}
      </section>

      {/* Featured Section */}
      <section style={{ marginBottom: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Star style={{ color: "#EAB308" }} />
          <h2 style={{ fontSize: "28px" }}>Featured by Chef Editors</h2>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Handpicked dishes featured for outstanding culinary execution.</p>

        {loadingFeatured ? (
          <p style={{ color: "var(--text-muted)" }}>Loading featured selection...</p>
        ) : featuredRecipes.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No featured recipes active.</p>
        ) : (
          <div className="recipe-grid">
            {featuredRecipes.map((recipe) => (
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
        )}
      </section>

      {/* Testimonials */}
      <section style={{ padding: "60px 40px", backgroundColor: "var(--bg-tertiary)", borderRadius: "12px", marginBottom: "8px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Trusted by 10,000+ Home Chefs</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 32px auto" }}>
          "RecipeHub has transformed how I organize and share my family recipes. The premium member upgrade was the best $10 I've spent!"
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", fontWeight: "bold", color: "var(--primary)" }}>
          <span>— Sarah Jenkins, Illinois</span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" style={{ marginTop: "80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "40px" }}>Frequently Asked Questions</h2>
        <div>
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-header" onClick={() => toggleFaq(index)}>
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {openFaq === index && (
                <motion.div
                  className="faq-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
