import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      width: "100%",
      color: "var(--primary)"
    }}>
      <Loader2 size={48} className="spinner" style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
      <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "16px" }}>{message}</p>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
