import React from "react";
import { CheckCircle } from "lucide-react";
import Footer from "../common components/footer.jsx";

/**
 * OtpResent
 * "Verification Code Has Been Resent" confirmation screen matching the wireframe.
 *
 * Props:
 *  - onReturn: () => void  (called when user clicks 'Return' to go back to OTP entry)
 *  - onNavigate: (pageKey: string) => void
 */
export default function OtpResent({
  onReturn = () => { },
  onNavigate = () => { },
}) {
  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else if (onNavigate) {
      onNavigate("twoStepVerification");
    }
  };

  return (
    <div
      className="flex-col"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #E8F5E9 0%, #F1F8F2 40%, var(--color-bg) 100%)",
        justifyContent: "space-between",
      }}
    >
      {/* ---- Main Content Area ---- */}
      <main
        className="flex-center"
        style={{
          flex: 1,
          padding: "var(--space-8) var(--space-6)",
        }}
      >
        {/* Large Rounded Capsule / Pill Card from wireframe */}
        <div
          style={{
            background: "#F0F0F0",
            borderRadius: 140,
            maxWidth: 680,
            width: "100%",
            padding: "var(--space-12) var(--space-10)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-6)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              fontSize: "var(--fs-2xl)",
              fontWeight: "var(--fw-medium)",
              color: "var(--color-text-primary)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            verification Code Has been Resent
          </h1>

          {/* Large Circle Checkmark Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
              padding: "var(--space-2) 0",
            }}
          >
            <CheckCircle size={54} strokeWidth={1.75} />
          </div>

          {/* Return Button */}
          <button
            type="button"
            onClick={handleReturn}
            className="hover-lift"
            style={{
              background: "#D9D9D9",
              color: "#000000",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "var(--space-3) var(--space-8)",
              minWidth: 140,
              fontSize: "var(--fs-base)",
              fontWeight: "var(--fw-medium)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.color = "var(--color-text-inverse)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#D9D9D9";
              e.currentTarget.style.color = "#000000";
            }}
          >
            Return
          </button>
        </div>
      </main>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
