import React, { useState } from "react";
import { Leaf, User, Lock, ArrowRight, UserPlus } from "lucide-react";

/**
 * Login Page
 * Matches the reference UI: top bar, tea-plantation background,
 * centered login card, and footer.
 * Styled entirely with index.css (global design system).
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: add login logic
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* ---- Main ---- */}
      <div
        className="flex-center"
        style={{ flex: 1, position: "relative", overflow: "hidden", padding: "var(--space-8)" }}
      >
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/login-bg.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* White-ish overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248, 250, 247, 0.6)",
            }}
          />
        </div>

        {/* Login Card */}
        <div
          className="glass-card"
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.96)",
            padding: "40px 48px 36px",
            width: "100%",
            maxWidth: 440,
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="flex-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#edf7ed",
              border: "2px solid #c8e6c9",
              margin: "0 auto var(--space-3)",
            }}
          >
            <Leaf size={28} color="#2E7D32" />
          </div>

          <h1
            className="page-title"
            style={{ marginBottom: "var(--space-2)", letterSpacing: "-0.01em" }}
          >
            TEA
          </h1>
          <p
            className="subtitle"
            style={{ lineHeight: "var(--lh-normal)", marginBottom: "var(--space-8)" }}
          >
            TEE AI-Based Tea Disease detection and
            <br />
            Estate management system
          </p>

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div
                className="input-search"
                style={{
                  background: "#f3f4f6",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-3) var(--space-4)",
                }}
              >
                <User size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "var(--fs-sm)", color: "var(--color-text-primary)" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div
                className="input-search"
                style={{
                  background: "#f3f4f6",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-3) var(--space-4)",
                }}
              >
                <Lock size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "var(--fs-sm)", color: "var(--color-text-primary)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}
            >
              Login <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-3)" }}
              onClick={() => onNavigate("createAccount")}
            >
              Create account <UserPlus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <footer
        className="flex-between"
        style={{
          padding: "var(--space-5) var(--space-6)",
          background: "var(--color-card)",
          borderTop: "1px solid var(--color-border)",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div className="flex-center gap-xs" style={{ alignItems: "flex-start" }}>
          <Leaf size={18} color="#2E7D32" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
              TEA
            </div>
            <div className="text-muted" style={{ fontSize: "var(--fs-xs)", lineHeight: "var(--lh-normal)", maxWidth: 360 }}>
              © UOC FGT Mini Project Group Number 5. AI-Based Tea Disease
              Detection and Estate Management System.
            </div>
          </div>
        </div>
        <nav className="flex-center gap-md">
          <a href="#" style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Home</a>
          <a href="#" style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Documentation</a>
          <a href="#" style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Contact Us</a>
          <a href="#" style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Terms</a>
        </nav>
      </footer>
    </div>
  );
}
