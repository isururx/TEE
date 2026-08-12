import React, { useState } from "react";
import { Leaf, User, Lock, ArrowRight, UserPlus } from "lucide-react";
import "./login.css";

/**
 * Login Page
 * Matches the reference UI: top bar, tea-plantation background,
 * centered login card, and footer.
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: add login logic
  };

  return (
    <div className="login-page">

      {/* ---- Main ---- */}
      <div className="login-main">
        {/* Background image */}
        <div className="login-bg">
          <img src="/login-bg.png" alt="" />
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-logo-circle">
            <Leaf size={28} color="#2E7D32" />
          </div>

          <h1 className="login-title">TEA</h1>
          <p className="login-subtitle">
            TEE AI-Based Tea Disease detection and
            <br />
            Estate management system
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label className="login-label">Username</label>
              <div className="login-input-wrapper">
                <User size={16} className="login-input-icon" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login <ArrowRight size={16} />
            </button>

            <button type="button" className="login-btn-secondary">
              Create account <UserPlus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <footer className="login-footer">
        <div className="login-footer-left">
          <Leaf size={18} color="#2E7D32" />
          <div>
            <div className="login-footer-brand">TEA</div>
            <div className="login-footer-copy">
              © UOC FGT Mini Project Group Number 5. AI-Based Tea Disease
              Detection and Estate Management System.
            </div>
          </div>
        </div>
        <nav className="login-footer-links">
          <a href="#">Home</a>
          <a href="#">Documentation</a>
          <a href="#">Contact Us</a>
          <a href="#">Terms</a>
        </nav>
      </footer>
    </div>
  );
}
