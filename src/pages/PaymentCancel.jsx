import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="container section-padding" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
      <div style={{ width: "100%", maxWidth: "500px", backgroundColor: "var(--bg-secondary)", padding: "40px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", textAlign: "center" }}>
        <div style={{ color: "#DC2626", display: "inline-flex", marginBottom: "16px" }}>
          <XCircle size={56} />
        </div>
        <h2 style={{ fontSize: "28px" }}>Checkout Cancelled</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px", marginBottom: "24px" }}>
          The Stripe checkout process was cancelled. No charges were made to your account.
        </p>
        <div>
          <Link to="/" className="btn btn-primary btn-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
