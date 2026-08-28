import React, { useState } from "react";
import { HardHat, User, Lock, ArrowRight, AlertCircle, UserPlus } from "lucide-react";
import Footer from "../common components/footer.jsx";

/**
 * Worker Login Page
 * Props:
 *  - onNavigate: (pageKey: string) => void
 */
export default function WorkerLogin({ onNavigate = () => {} }) {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleWorkerLogin = (e) => {
    e.preventDefault();

    if (!workerId.trim()) {
      setError("Please enter your Worker ID");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setError("");
    console.log("Worker logging in:", { workerId, password });

    // image upload and disease detection navigation
    onNavigate("detection");
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Main Section with Background ---- */}
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

        {/* Worker Login Card */}
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
            <HardHat size={30} color="var(--color-primary)" strokeWidth={1.75} />
          </div>

          <h1 className="page-title" style={{ marginBottom: "var(--space-1)" }}>
            Worker Login
          </h1>
          <p className="subtitle" style={{ marginBottom: "var(--space-6)" }}>
            TEE AI-Based Tea Disease detection and
            <br />
            Estate management system
          </p>

          <form onSubmit={handleWorkerLogin} className="flex-col" style={{ textAlign: "left", gap: "var(--space-4)" }}>
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
                  placeholder="Enter your Username"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
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
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}
            >
              Login <ArrowRight size={16} />
            </button>

             <button
              type="button"
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => onNavigate("createAccount")}
            >
              Create account <UserPlus size={16} />
            </button>
            
            <button
              type="button"
              className="btn-link"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", color: "var(--color-text-secondary)" }}
              onClick={() => onNavigate("welcomePage")}
            >
            Back to Home
            </button>
          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
