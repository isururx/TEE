import React from "react";
import { Construction, ArrowLeft, LogOut, ShieldAlert, UserCheck } from "lucide-react";
import Footer from "../common components/footer.jsx";

/**
 * UnderDevelopment Component
 * Rendered when a requested feature or role module is under active development.
 *
 * Props:
 *  - featureName: string (e.g. "Account Approvals", "Role Assignment", "System Settings")
 *  - role: string
 *  - user: object
 *  - onNavigate: (pageKey: string) => void
 */
export default function UnderDevelopment({
  featureName = "Feature",
  role = "User",
  user = null,
  onNavigate = () => { },
}) {
  const currentUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const userRole = role || currentUser.role || localStorage.getItem("user_role") || "User";
  const userName = currentUser.name || "User";
  const userEmail = currentUser.email || "";

  return (
    <div
      className="flex-col"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #E8F5E9 0%, #F1F8F2 40%, var(--color-bg) 100%)",
        justifyContent: "space-between",
      }}
    >
      <main
        className="flex-center"
        style={{
          flex: 1,
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: 540,
            width: "100%",
            textAlign: "center",
            padding: "var(--space-8) var(--space-8)",
            boxShadow: "var(--shadow-modal)",
            borderRadius: "var(--radius-xl)",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Top Icon */}
          <div
            className="flex-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-full)",
              background: "#FFF3E0",
              border: "2px solid #FFE0B2",
              margin: "0 auto var(--space-4)",
            }}
          >
            <Construction size={32} color="#F57C00" />
          </div>

          <h1
            className="page-title"
            style={{
              marginBottom: "var(--space-2)",
              fontSize: "var(--fs-2xl)",
              color: "var(--color-text-primary)",
            }}
          >
            Feature under development
          </h1>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-full)",
              background: "var(--color-hover-green)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--fs-xs)",
              color: "var(--color-primary)",
              fontWeight: "var(--fw-semibold)",
              marginBottom: "var(--space-4)",
            }}
          >
            <ShieldAlert size={14} />
            <span>{featureName} Module</span>
          </div>

          <p
            style={{
              fontSize: "var(--fs-sm)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              marginBottom: "var(--space-6)",
            }}
          >
            The feature <strong>"{featureName}"</strong> is currently under active development.
            Our team is building this module for the <strong>{userRole}</strong> portal.
          </p>

          {/* User Details Badge */}
          <div
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-3) var(--space-4)",
              marginBottom: "var(--space-6)",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <div
              className="flex-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-full)",
                background: "var(--color-hover-green)",
                color: "var(--color-primary)",
                flexShrink: 0,
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-sm)", color: "var(--color-text-primary)" }}>
                {userName} ({userRole})
              </div>
              {userEmail && (
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>
                  {userEmail}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex-center"
            style={{
              gap: "var(--space-3)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate("dashboard")}
              style={{
                padding: "var(--space-3) var(--space-5)",
                fontSize: "var(--fs-sm)",
              }}
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
