import { apiFetch } from "../api/apiClient.js";
import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Leaf, Mail, ShieldCheck } from "lucide-react";
import Footer from "../common components/footer.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function ForgotPassword({ onNavigate = () => {} }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (path, body) => {
    const response = await apiFetch(`${API_BASE_URL}/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || data.message || "Something went wrong. Please try again.");
    return data;
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await request("forgot-password", { email: email.trim() });
      setStep("otp");
      setMessage("A password reset code has been sent to your email address.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await request("verify-reset-otp", { email: email.trim(), otp: otp.trim() });
      if (!data.reset_token) throw new Error("The server did not return a reset token. Please try again.");
      setResetToken(data.reset_token);
      setStep("password");
      setMessage("Email verified. You can now create a new password.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await request("reset-password", { reset_token: resetToken, new_password: newPassword });
      setResetToken("");
      setOtp("");
      setMessage("Your password has been reset successfully. Please log in with your new password.");
      setStep("complete");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "var(--space-3) var(--space-4)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    background: "#FFFFFF",
    color: "var(--color-text-primary)",
    outlineColor: "var(--color-primary)",
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <main className="flex-center" style={{ flex: 1, padding: "var(--space-8) var(--space-4)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="/login-bg.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(248, 250, 247, 0.72)" }} />
        </div>

        <section className="glass-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, padding: "var(--space-8)", background: "rgba(255,255,255,0.97)", boxShadow: "var(--shadow-modal)" }}>
          <div className="flex-center" style={{ width: 54, height: 54, borderRadius: "var(--radius-full)", background: "var(--color-hover-green)", margin: "0 auto var(--space-4)" }}>
            {step === "email" ? <Mail size={26} color="var(--color-primary)" /> : step === "otp" ? <ShieldCheck size={26} color="var(--color-primary)" /> : step === "password" ? <KeyRound size={26} color="var(--color-primary)" /> : <CheckCircle2 size={26} color="var(--color-primary)" />}
          </div>
          <h1 className="page-title" style={{ textAlign: "center", marginBottom: "var(--space-2)" }}>
            {step === "email" ? "Forgot Password?" : step === "otp" ? "Verify Your Email" : step === "password" ? "Create New Password" : "Password Reset Complete"}
          </h1>
          <p className="subtitle" style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
            {step === "email" ? "Enter your registered email address to receive a reset code." : step === "otp" ? `Enter the 6-digit code sent to ${email}.` : step === "password" ? "Choose a new password for your TEE account." : "Your account password has been updated."}
          </p>

          {error && <div className="alert alert-danger" role="alert" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}
          {message && <div className="alert alert-success" role="status" style={{ marginBottom: "var(--space-4)" }}>{message}</div>}

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="flex-col" style={{ gap: "var(--space-4)" }}>
              <label className="form-label" htmlFor="reset-email">Email address</label>
              <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" style={inputStyle} />
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>{loading ? "Sending code..." : "Send reset code"}</button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex-col" style={{ gap: "var(--space-4)" }}>
              <label className="form-label" htmlFor="reset-otp">6-digit verification code</label>
              <input id="reset-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="Enter 6-digit code" style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.4em", fontSize: "var(--fs-xl)" }} />
              <button className="btn-primary" type="submit" disabled={loading || otp.length !== 6} style={{ width: "100%", justifyContent: "center" }}>{loading ? "Verifying..." : "Verify code"}</button>
              <button className="btn-outline" type="button" onClick={() => { setStep("email"); setOtp(""); setMessage(""); setError(""); }} style={{ width: "100%", justifyContent: "center" }}>Change email address</button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="flex-col" style={{ gap: "var(--space-4)" }}>
              <label className="form-label" htmlFor="new-password">New password</label>
              <input id="new-password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" style={inputStyle} />
              <label className="form-label" htmlFor="confirm-password">Confirm new password</label>
              <input id="confirm-password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" style={inputStyle} />
              <button className="btn-primary" type="submit" disabled={loading || newPassword.length < 10 || newPassword !== confirmPassword} style={{ width: "100%", justifyContent: "center" }}>{loading ? "Updating password..." : "Reset password"}</button>
            </form>
          )}

          {step === "complete" && (
            <button className="btn-primary" type="button" onClick={() => onNavigate("login")} style={{ width: "100%", justifyContent: "center" }}>Back to Login <ArrowLeft size={16} /></button>
          )}

          {step !== "complete" && (
            <button type="button" onClick={() => onNavigate("login")} className="btn-ghost" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)", width: "100%", marginTop: "var(--space-4)", color: "var(--color-text-secondary)" }}>
              <ArrowLeft size={15} /> Back to Login
            </button>
          )}
          <div className="flex-center" style={{ gap: 6, marginTop: "var(--space-6)", color: "var(--color-text-muted)", fontSize: "var(--fs-xs)" }}>
            <Leaf size={13} /> TEE Estate Management
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
