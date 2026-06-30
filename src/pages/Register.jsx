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
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { register, loginWithGoogle } = useAuth();
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
      let uploadedPhotoUrl = photoUrl;
      
      if (imageFile) {
        setUploadingImage(true);
        try {
          const { uploadImageToImgbb } = await import("../lib/imgbb");
          uploadedPhotoUrl = await uploadImageToImgbb(imageFile);
        } catch (imgErr) {
          setError("Failed to upload image. Please try again.");
          setUploadingImage(false);
          setSubmitting(false);
          return;
        }
        setUploadingImage(false);
      }

      await register(name, email, password, uploadedPhotoUrl);
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

  const handleGoogleRegister = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || "Google authentication failed.");
      toast.error("Google sign up failed.", { className: "toast-custom" });
    }
  };

  return (
    <div className="section-padding" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "500px", backgroundColor: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "#DCFCE7", color: "#15803D", borderRadius: "50%", marginBottom: "16px" }}>
            <UserPlus size={32} />
          </div>
          <h2>Join RecipeHub</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Create a free account and start sharing culinary recipes</p>
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
            <label className="form-label">Profile Image (Optional)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8E897F" }}>
                <Image size={18} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="form-input"
                style={{ paddingLeft: "42px", paddingBottom: "8px", paddingTop: "8px" }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
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
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
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
            disabled={submitting || uploadingImage}
          >
            {uploadingImage ? "Uploading Image..." : submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", color: "var(--text-muted)", fontSize: "14px" }}>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--border)" }}></div>
          <span style={{ padding: "0 12px" }}>or</span>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--border)" }}></div>
        </div>

        <button
          onClick={handleGoogleRegister}
          className="btn btn-secondary"
          style={{ width: "100%", padding: "12px", justifyContent: "center", display: "flex", gap: "10px", alignItems: "center" }}
        >
          <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.788-6.228-6.228 0-3.44 2.788-6.228 6.228-6.228 1.488 0 2.855.526 3.93 1.402l3.055-3.055C18.9 2.215 15.79 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.228 10.867-11.24 0-.743-.072-1.442-.2-2.114H12.24z"
            />
          </svg>
          Sign up with Google
        </button>

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
