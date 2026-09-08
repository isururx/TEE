import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Smartphone,
  KeyRound,
  X,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Footer from "../common components/footer.jsx";
import OtpResent from "./OtpResent.jsx";

const METHODS = [
  { id: "email", label: "Email Verification", detail: "Send code to user***@gmail.com", icon: Mail },
  { id: "sms", label: "SMS Verification", detail: "Send code to +94 70 *** 4164", icon: Smartphone },
];

/**
 * TwoStepVerification
 * 2-Step Verification / OTP Screen fully styled with index.css classes & design tokens.
 *
 * Props:
 *  - email: string (default: "user***@gmail.com")
 *  - onNavigate: (pageKey: string) => void
 *  - onVerifySuccess: () => void
 */
export default function TwoStepVerification({
  email = "user***@gmail.com",
  onNavigate = () => { },
  onVerifySuccess = () => { },
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(300);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState("email"); // "email" | "sms" | "app"
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [isResentView, setIsResentView] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // Auto-focus first input on initial mount
  useEffect(() => {
    if (!isResentView) {
      inputRefs[0]?.current?.focus();
    }
  }, [isResentView]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Helper to format seconds into mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle single digit input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    setError("");
    const newOtp = [...otp];

    if (value.length > 1) {
      newOtp[index] = value.slice(-1);
    } else {
      newOtp[index] = value;
    }

    setOtp(newOtp);

    // Auto advance to next input if filled
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle Backspace & Arrow navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs[index - 1]?.current?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle Pasting full OTP code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs[5]?.current?.focus();
      setError("");
    }
  };

  // Handle Submit / Login verification
  const handleLogin = async (e) => {
    e?.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    if (resendTimer === 0) {
      setError("Verification code has expired. Please click RESEND to get a new code.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      let storedUserId = localStorage.getItem("user_id");
      if (!storedUserId) {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            storedUserId = parsedUser.id || parsedUser.user_id;
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }
      }

      const userId = storedUserId ? (isNaN(storedUserId) ? storedUserId : Number(storedUserId)) : null;

      const response = await fetch("http://127.0.0.1:8000/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          otp: code,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save user info & role to localStorage
        const userObj = data.user || data;
        localStorage.setItem("user", JSON.stringify(userObj));

        const role = data.role || data.user?.role;
        if (role) {
          localStorage.setItem("user_role", role);
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user_id) {
          localStorage.setItem("user_id", data.user_id);
        }

        // Determine corresponding dashboard based on role
        const roleLower = (role || "").toLowerCase();
        let targetDashboard = "dashboard";
        if (roleLower.includes("admin")) {
          targetDashboard = "adminDashboard";
        } else if (roleLower.includes("supervisor")) {
          targetDashboard = "supervisorDashboard";
        } else if (roleLower.includes("manager")) {
          targetDashboard = "managerDashboard";
        }

        setSuccess("Verification successful! Redirecting to Dashboard...");
        setTimeout(() => {
          onVerifySuccess();
          onNavigate(targetDashboard);
        }, 800);
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.detail || "Invalid verification code";
        setError(errorMsg);
        alert(`Wrong OTP: ${errorMsg}`);
      }
    } catch (err) {
      console.warn("Backend 2-step verification request warning:", err.message);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend Code -> switches to OtpResent view
  const handleResend = async () => {
    if (resendTimer > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");

    try {
      await fetch("http://localhost:8000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.warn("Backend resend OTP request warning:", err.message);
    }

    setResendTimer(300);
    setIsResentView(true);
  };

  // If Resent Confirmation View is active, render OtpResent screen
  if (isResentView) {
    return (
      <OtpResent
        onReturn={() => {
          setIsResentView(false);
          setResendTimer(300);
        }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div
      className="flex-col"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #E8F5E9 0%, #F1F8F2 40%, var(--color-bg) 100%)",
        justifyContent: "space-between",
      }}
    >
      {/* ---- Main Verification Section ---- */}
      <main
        className="flex-center"
        style={{
          flex: 1,
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        {/* Verification Card with index.css .glass-card styling */}
        <div
          className="glass-card"
          style={{
            maxWidth: 540,
            width: "100%",
            textAlign: "center",
            padding: "var(--space-8) var(--space-8)",
            boxShadow: "var(--shadow-modal)",
            borderRadius: "var(--radius-xl)",
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Top Security Badge */}
          <div
            className="flex-center"
            style={{
              width: 54,
              height: 54,
              borderRadius: "var(--radius-full)",
              background: "var(--color-hover-green)",
              border: "2px solid #C8E6C9",
              margin: "0 auto var(--space-4)",
            }}
          >
            <ShieldCheck size={28} color="var(--color-primary)" />
          </div>

          {/* Subtitle / Email Notice */}
          <p
            className="subtitle"
            style={{
              marginBottom: "var(--space-2)",
              fontSize: "var(--fs-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            We've sent you the code to your {verificationMethod === "email" ? "email adress" : "phone"}
          </p>
          <p
            style={{
              fontSize: "var(--fs-base)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--space-4)",
            }}
          >
            {verificationMethod === "email" ? email : "+94 70 *** 4164"}
          </p>

          {/* Main Heading */}
          <h1
            className="page-title"
            style={{
              marginBottom: "var(--space-6)",
              fontSize: "var(--fs-2xl)",
            }}
          >
            Enter 2 steps verification
          </h1>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)", textAlign: "left" }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: "var(--space-6)", textAlign: "left" }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* 6 Compact Circular OTP Input Slots */}
          <form onSubmit={handleLogin} className="flex-col" style={{ gap: "var(--space-6)" }}>
            {/* Live Countdown Timer Badge */}
            <div
              className="flex-center"
              style={{
                gap: "var(--space-2)",
                fontSize: "var(--fs-sm)",
                color: resendTimer > 0 ? "var(--color-text-secondary)" : "var(--color-danger)",
                fontWeight: "var(--fw-medium)",
                marginBottom: "var(--space-1)",
              }}
            >
              <Clock size={16} color={resendTimer > 0 ? "var(--color-primary)" : "var(--color-danger)"} />
              <span>
                {resendTimer > 0
                  ? `Code valid for: ${formatTimer(resendTimer)}`
                  : "Code has expired. Please click Resend."}
              </span>
            </div>

            <div
              className="flex-center"
              style={{
                gap: "var(--space-3)",
                justifyContent: "center",
              }}
            >
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-full)",
                    background: digit ? "#FFFFFF" : "var(--color-hover-green)",
                    border: digit ? "2px solid var(--color-primary)" : "2px solid var(--color-border)",
                    textAlign: "center",
                    fontSize: "var(--fs-xl)",
                    fontWeight: "var(--fw-bold)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                    transition: "all var(--transition-fast)",
                    boxShadow: digit ? "var(--shadow-card)" : "none",
                    cursor: "text",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.background = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(46, 125, 50, 0.2)";
                    e.target.style.transform = "scale(1.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = "scale(1)";
                    if (!digit) {
                      e.target.style.borderColor = "var(--color-border)";
                      e.target.style.background = "var(--color-hover-green)";
                      e.target.style.boxShadow = "none";
                    } else {
                      e.target.style.boxShadow = "var(--shadow-card)";
                    }
                  }}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons: LOGIN & RESEND */}
            <div
              className="flex-center"
              style={{
                gap: "var(--space-4)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* LOGIN Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="btn-primary hover-lift"
                style={{
                  minWidth: 150,
                  padding: "var(--space-3) var(--space-6)",
                  fontSize: "var(--fs-sm)",
                  letterSpacing: "0.03em",
                  fontWeight: "var(--fw-semibold)",
                }}
              >
                {isVerifying ? (
                  "VERIFYING..."
                ) : (
                  <>
                    LOGIN <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* RESEND Button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="btn-secondary hover-lift"
                style={{
                  minWidth: 150,
                  padding: "var(--space-3) var(--space-6)",
                  fontSize: "var(--fs-sm)",
                  letterSpacing: "0.03em",
                  fontWeight: "var(--fw-semibold)",
                  cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  opacity: resendTimer > 0 ? 0.65 : 1,
                }}
              >
                <RefreshCw size={15} />
                RESEND
              </button>
            </div>
          </form>

          {/* Change Verification Method Link */}
          <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
            <button
              type="button"
              onClick={() => setShowMethodModal(true)}
              className="btn-ghost"
              style={{
                color: "var(--color-primary)",
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
                padding: "var(--space-2) var(--space-3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <KeyRound size={15} />
              Change verifying Method
            </button>
          </div>
        </div>
      </main>

      {/* ---- Footer ---- */}
      <Footer />

      {/* ---- Change Verification Method Modal (Using index.css modal classes) ---- */}
      {showMethodModal && (
        <div className="modal-backdrop" onClick={() => setShowMethodModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2 className="section-title" style={{ margin: 0 }}>
                Choose Verification Method
              </h2>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowMethodModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-col gap-sm" style={{ padding: "var(--space-2) 0 var(--space-4)" }}>
              {METHODS.map(({ id, label, detail, icon: Icon }) => {
                const isSelected = verificationMethod === id;
                return (
                  <label
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      background: isSelected ? "var(--color-hover-green)" : "var(--color-card)",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={id}
                      className="radio-primary"
                      checked={isSelected}
                      onChange={() => {
                        setVerificationMethod(id);
                        setShowMethodModal(false);
                        setSuccess(`Verification method switched to ${label}.`);
                        setTimeout(() => setSuccess(""), 3000);
                      }}
                    />
                    <Icon size={18} color={isSelected ? "var(--color-primary)" : "var(--color-text-secondary)"} />
                    <div>
                      <div
                        style={{
                          fontWeight: isSelected ? "var(--fw-semibold)" : "var(--fw-medium)",
                          fontSize: "var(--fs-sm)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>
                        {detail}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowMethodModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
