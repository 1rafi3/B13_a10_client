import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Image, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password, photoUrl);
      toast.success("Account registered successfully! Welcome to RecipeHub.", { className: "toast-custom" });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create an account. Please try again.");
      toast.error("Registration failed.", { className: "toast-custom" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-padding" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px", backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", border: "1px solid #E5DEC9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "#DCFCE7", color: "#15803D", borderRadius: "50%", marginBottom: "16px" }}>
            <UserPlus size={32} />
          </div>
          <h2>Join RecipeHub</h2>
          <p style={{ color: "#57544E", marginTop: "8px" }}>Create a free account and start sharing culinary recipes</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, marginBottom: "20px", borderLeft: "4px solid #B91C1C" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Chef Bobby Flay"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="chef@recipehub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL (Optional)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                <Image size={18} />
              </span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "42px" }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "42px" }}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", justifyContent: "center", marginTop: "12px" }}
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#57544E" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#15803D", fontWeight: 600 }}>
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
