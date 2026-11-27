import React, { useState } from "react";
import { Leaf, User, Lock, ArrowRight, UserPlus, AlertCircle } from "lucide-react";
import Footer from "../common components/footer.jsx";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function getErrorMessage(detail, fallback) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item?.msg).filter(Boolean).join(", ") || fallback;
  return fallback;
}

export default function Login({ onNavigate = () => {} }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const identifier = username.trim();

    if (!identifier || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data.detail, data.message || "Unable to log in. Please check your details."));
      }

      const userId = data.user_id ?? data.user?.id ?? data.user?.user_id ?? data.id;
      if (userId === undefined || userId === null || String(userId).trim() === "") {
        throw new Error("The server did not return a user ID. Please try again.");
      }

      if (data.requires_2fa !== true) {
        throw new Error("The server did not confirm the required email verification step.");
      }

      // A new login must not reuse a previous authenticated session.
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.setItem("user_id", String(userId));
      localStorage.setItem("verification_email", data.masked_email || "your registered email");

      if (data.user && typeof data.user === "object") {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role) localStorage.setItem("user_role", data.user.role);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
      }

      onNavigate("twoStepVerification");
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <div className="flex-center" style={{ flex: 1, position: "relative", overflow: "hidden", padding: "var(--space-8)" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="/login-bg.png" alt="Tea Plantation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(248, 250, 247, 0.6)" }} />
        </div>

        <div className="glass-card" style={{ position: "relative", zIndex: 1, background: "rgba(255, 255, 255, 0.96)", padding: "var(--space-8) var(--space-10) var(--space-8)", width: "100%", maxWidth: 440, textAlign: "center", boxShadow: "var(--shadow-modal)" }}>
          <div className="flex-center" style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "var(--color-hover-green)", border: "2px solid #c8e6c9", margin: "0 auto var(--space-3)" }}>
            <Leaf size={28} color="var(--color-primary)" />
          </div>

          <h1 className="page-title" style={{ marginBottom: "var(--space-1)" }}>Login</h1>
          <p className="subtitle" style={{ marginBottom: "var(--space-6)" }}>
            TEE AI-Based Tea Disease detection and<br />Estate management system
          </p>

          <form onSubmit={handleLogin} className="flex-col" style={{ textAlign: "left", gap: "var(--space-4)" }}>
            {error && (
              <div className="alert alert-danger" role="alert" style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--fs-xs)" }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="login-identifier">Username or email</label>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <User size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <button type="button" onClick={() => onNavigate("forgotPassword")} disabled={isLoading} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <Lock size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Signing in..." : <>Login <ArrowRight size={16} /></>}
            </button>

            <button type="button" className="btn-outline" disabled={isLoading} style={{ width: "100%", justifyContent: "center" }} onClick={() => onNavigate("createAccount")}>
              Create account <UserPlus size={16} />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
