import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const ranVerification = useRef(false);

  useEffect(() => {
    // Only verify once on mount to prevent double calls (React strict mode duplicate triggers)
    if (ranVerification.current) return;
    ranVerification.current = true;

    const sessionId = searchParams.get("session_id");
    const isMock = searchParams.get("is_mock") === "true";
    const mockType = searchParams.get("mock_type");
    const recipeId = searchParams.get("recipe_id");
    const amount = searchParams.get("amount");

    if (!sessionId) {
      setErrorMsg("Missing Stripe Session ID in URL parameters.");
      setLoading(false);
      return;
    }

    const confirmPaymentOnBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        const payload = { sessionId };
        if (isMock) {
          payload.mockType = mockType;
          payload.recipeId = recipeId;
          payload.mockAmount = amount;
        }

        const res = await fetch(`${apiUrl}/api/payments/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          credentials: "include"
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          setPaymentInfo(data.payment);
          setSuccess(true);
          // Refresh user context so that premium status badge upgrades immediately
          await refreshUser();
          toast.success("Payment verified!", { className: "toast-custom" });
        } else {
          setErrorMsg(data.message || "Failed to confirm payment transaction with backend.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Network error occurred during payment confirmation.");
      } finally {
        setLoading(false);
      }
    };

    confirmPaymentOnBackend();
  }, []);

  if (loading) {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid #E5DEC9", borderTop: "4px solid #15803D", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px auto" }}></div>
        <h2>Verifying Payment</h2>
        <p style={{ color: "var(--text-secondary)" }}>Confirming transaction details with Stripe processing servers...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
      <div style={{ width: "100%", maxWidth: "500px", backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", border: "1px solid #E5DEC9", boxShadow: "var(--shadow-md)", textAlign: "center" }}>
        {success ? (
          <>
            <div style={{ color: "var(--primary)", display: "inline-flex", marginBottom: "16px" }}>
              <CheckCircle2 size={56} />
            </div>
            <h2 style={{ fontSize: "28px", color: "var(--text-primary)" }}>Payment Succeeded!</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
              Thank you for your purchase. Your account has been upgraded successfully.
            </p>

            {paymentInfo && (
              <div style={{ margin: "24px 0", padding: "20px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", textAlign: "left", fontSize: "14px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Transaction ID</span>
                  <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{paymentInfo.transactionId}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Amount Paid</span>
                  <span style={{ fontWeight: "700", color: "var(--primary)" }}>${paymentInfo.amount.toFixed(2)} USD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Payment Date</span>
                  <span>{new Date(paymentInfo.paidAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/" className="btn btn-primary btn-sm">
                Back to Home
              </Link>
              {paymentInfo?.recipeId ? (
                <Link to={`/recipes/${paymentInfo.recipeId}`} className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "6px" }}>
                  Open Cookbook <ArrowRight size={14} />
                </Link>
              ) : (
                <Link to="/my-recipes" className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "6px" }}>
                  My Cookbooks <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "#DC2626", display: "inline-flex", marginBottom: "16px" }}>
              <AlertCircle size={56} />
            </div>
            <h2 style={{ fontSize: "28px" }}>Verification Failed</h2>
            <p style={{ color: "#DC2626", marginTop: "8px", fontWeight: "500" }}>{errorMsg}</p>
            <p style={{ color: "var(--text-secondary)", marginTop: "8px", fontSize: "14px" }}>
              If you believe this is an error, please check your network connection or try check out again.
            </p>
            <div style={{ marginTop: "24px" }}>
              <Link to="/" className="btn btn-secondary btn-sm">
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
