import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to page requested before login or fallback to home
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Welcome back!", { className: "toast-custom" });
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please verify your credentials.");
      toast.error("Login failed.", { className: "toast-custom" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || "Google authentication failed.");
      toast.error("Google sign in failed.", { className: "toast-custom" });
    }
  };

  return (
    <div className="section-padding" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "450px", backgroundColor: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "#DCFCE7", color: "#15803D", borderRadius: "50%", marginBottom: "16px" }}>
            <LogIn size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Sign in to share and purchase recipes</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, marginBottom: "20px", borderLeft: "4px solid #B91C1C" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", color: "var(--text-muted)", fontSize: "14px" }}>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--border)" }}></div>
          <span style={{ padding: "0 12px" }}>or</span>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "var(--border)" }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-secondary"
          style={{ width: "100%", padding: "12px", justifyContent: "center", display: "flex", gap: "10px", alignItems: "center" }}
        >
          <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.788-6.228-6.228 0-3.44 2.788-6.228 6.228-6.228 1.488 0 2.855.526 3.93 1.402l3.055-3.055C18.9 2.215 15.79 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.228 10.867-11.24 0-.743-.072-1.442-.2-2.114H12.24z"
            />
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#57544E" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#15803D", fontWeight: 600 }}>
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
