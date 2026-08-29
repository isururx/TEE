import React, { useState } from "react";
import { User, Lock, ArrowRight, AlertCircle, Leaf } from "lucide-react";
import Footer from "../common components/footer.jsx";

const WORKER_LOGIN_URL = "http://localhost:8000/api/auth/worker-login";

/**
 * Worker Login Page
 * Direct login with Worker ID & Password (NO 2-step verification needed)
 */
export default function WorkerLogin({ onNavigate = () => {} }) {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWorkerLogin = async (e) => {
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
    setIsSubmitting(true);

    try {
      const response = await fetch(WORKER_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_id: Number(workerId.trim()) || workerId.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid Worker ID or password.");
      }

      const data = await response.json();
      // Store worker session
      if (data.worker) {
        sessionStorage.setItem("tee-worker", JSON.stringify(data.worker));
      }

      // Direct navigation without 2FA
      onNavigate("detection");
    } catch (loginError) {
      // Fallback for UI demo if backend is not running yet
      if (loginError.message.includes("Failed to fetch") || loginError.message.includes("NetworkError")) {
        console.warn("Backend not reachable, proceeding with demo worker login.");
        onNavigate("detection");
      } else {
        setError(loginError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
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
            <Leaf size={28} color="var(--color-primary)" />
          </div>

          <h1 className="page-title" style={{ marginBottom: "var(--space-1)" }}>
            Worker Login
          </h1>
          <p className="subtitle" style={{ marginBottom: "var(--space-6)" }}>
            Access your tasks, block assignments, and disease scanner
          </p>

          <form onSubmit={handleWorkerLogin} className="flex-col" style={{ textAlign: "left", gap: "var(--space-4)" }}>
            {error && (
              <div className="alert alert-danger" style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--fs-xs)" }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Worker ID</label>
              <div className="input-search" style={{ padding: "var(--space-3) var(--space-4)" }}>
                <User size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Enter your Worker ID (e.g. 1)"
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
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)" }}
            >
              {isSubmitting ? "Logging in..." : "Login Directly"} <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-link"
              style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-2)", color:"var(--color-primary)" }}
              onClick={() => onNavigate("login")}
            >
              Back to staff login
            </button>
          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
