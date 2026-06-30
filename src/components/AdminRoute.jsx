import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid var(--border)", borderTop: "4px solid var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Checking authorizations...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
