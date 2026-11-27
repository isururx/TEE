import { apiFetch } from "../api/apiClient.js";
import React, { useState } from "react";
import { Leaf, User, Lock, ArrowRight, UserPlus, AlertCircle } from "lucide-react";
import Footer from "../common components/footer.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Login Page
 * Matches the reference UI: tea-plantation background, centered glassmorphic login card, and footer.
 * Fully styled with index.css classes and design tokens.
 *
 * Props:
 *  - onNavigate: (pageKey: string) => void
 */
export default function Login({ onNavigate = () => { } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data.user_id || data.user?.id || data.user?.user_id || data.id;
        if (!userId) {
          setError("The server did not return a user ID. Please try again.");
          return;
        }
        localStorage.setItem("user_id", String(userId));
        localStorage.setItem("verification_email", data.masked_email || "your registered email");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.role) localStorage.setItem("user_role", data.user.role);
        }
        onNavigate("twoStepVerification");
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.detail || "Invalid username or password");
      }
    } catch (err) {
      console.warn("Backend login request warning:", err.message);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Main Section with Background Image ---- */}
      <div
        className="flex-center"
        style={{ flex: 1, position: "relative", overflow: "hidden", padding: "var(--space-8)" }}
      >
        {/* Background Plantation Image & Overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/login-bg.png"
            alt="Tea Plantation"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
            padding: "var(--space-8) var(--space-10) var(--space-8)",
            width: "100%",
            maxWidth: 440,
            textAlign: "center",
            boxShadow: "var(--shadow-modal)",
          }}
        >
          {/* Logo Badge */}
          <div
            className="flex-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-full)",
              background: "var(--color-hover-green)",
              border: "2px solid #c8e6c9",
              margin: "0 auto var(--space-3)",
            }}
          >
            <Leaf size={28} color="var(--color-primary)" />
          </div>

          <h1 className="page-title" style={{ marginBottom: "var(--space-1)" }}>
            Login
          </h1>
          <p className="subtitle" style={{ marginBottom: "var(--space-6)" }}>
            TEE AI-Based Tea Disease detection and
            <br />
            Estate management system
          </p>

          <form onSubmit={handleLogin} className="flex-col" style={{ textAlign: "left", gap: "var(--space-4)" }}>
            {error && (
              <div className="alert alert-danger" style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--fs-xs)" }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <User size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgotPassword")}
                  style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <Lock size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}
            >
              {isLoading ? "Signing in..." : "Login"} <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onNavigate("createAccount")}
            >
              Create account <UserPlus size={16} />
            </button>

          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
