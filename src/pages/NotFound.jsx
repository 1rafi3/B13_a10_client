import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh",
      textAlign: "center",
      padding: "20px"
    }}>
      <AlertTriangle size={80} style={{ color: "var(--accent)", marginBottom: "24px" }} />
      <h1 style={{ fontSize: "48px", marginBottom: "16px", color: "var(--text-primary)" }}>404</h1>
      <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "var(--text-secondary)" }}>Page Not Found</h2>
      <p style={{ color: "var(--text-muted)", maxWidth: "400px", marginBottom: "32px" }}>
        Oops! We couldn't find the recipe you're looking for. It might have been removed, or the link may be broken.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
}
