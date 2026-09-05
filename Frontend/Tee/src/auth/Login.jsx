import React, { useState } from "react";
import { Leaf, User, Lock, ArrowRight, UserPlus, AlertCircle } from "lucide-react";
import Footer from "../common components/footer.jsx";

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
<<<<<<< Updated upstream
=======
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Force / set light mode when Login page mounts
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    localStorage.setItem(THEME_KEY, "light");
    setTheme("light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  };
>>>>>>> Stashed changes

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
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.user_id) {
          localStorage.setItem("user_id", data.user_id);
        }
        if (data.role) {
          localStorage.setItem("user_role", data.role);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.role) {
            localStorage.setItem("user_role", data.user.role);
          }
        }
        onNavigate("twoStepVerification", {
          user_id: data.user_id,
          role: data.role || data.user?.role,
          user: data.user,
        });
      } else {
        const message = data.detail || "Invalid username or password";
        setModalMessage(message);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setModalMessage("Unable to connect to the server. Please check your backend connection.");
      setShowErrorModal(true);
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
            Staff Login
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
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <Lock size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}
            >
              {isLoading ? "Logging in..." : <>Login <ArrowRight size={16} /></>}
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onNavigate("createAccountStaff")}
            >
              Create account <UserPlus size={16} />
            </button>
<<<<<<< Updated upstream
            <button
              type="button"
              className="btn-link"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", color: "var(--color-text-secondary)" }}
              onClick={() => onNavigate("welcomePage")}
            >
              Back to Home
            </button>
=======
>>>>>>> Stashed changes

          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <Footer />

      {/* ---- Incorrect Username / Password Modal ---- */}
      {showErrorModal && (
        <div className="modal-backdrop" onClick={() => setShowErrorModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420, textAlign: "center", padding: "var(--space-6)" }}
          >
            <div
              className="flex-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-full)",
                background: "#FFEBEE",
                border: "2px solid #FFCDD2",
                margin: "0 auto var(--space-4)",
              }}
            >
              <AlertCircle size={28} color="var(--color-danger)" />
            </div>

            <h2 className="section-title" style={{ marginBottom: "var(--space-2)", fontSize: "var(--fs-xl)" }}>
              Authentication Failed
            </h2>

            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
              {modalMessage}
            </p>

            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setShowErrorModal(false)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
