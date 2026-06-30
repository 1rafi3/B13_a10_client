import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid var(--border)", borderTop: "4px solid var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Verifying credentials...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
