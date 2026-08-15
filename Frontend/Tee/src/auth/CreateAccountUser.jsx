import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";

/**
 * CreateAccountUser
 * "Create account" page for new user registration.
 * Matches the reference wireframe: top navbar, centered form card, and footer.
 * Styled entirely with index.css (global design system).
 *
 * Props:
 *  - onNavigate: (pageKey: string) => void
 */
export default function CreateAccountUser({ onNavigate = () => { } }) {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    nic: "",
    address: "",
    dob: "",
    phone1: "",
    phone2: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({});


  /* ---- helpers ---- */
  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.nic.trim()) newErrors.nic = "NIC is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.dob) newErrors.dob = "Date of birthday is required";
    if (!form.phone1.trim()) newErrors.phone1 = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.repeatPassword)
      newErrors.repeatPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      // TODO: send data to backend
      console.log("Create account payload:", form);
    }
  };

  const handleClear = () => {
    setForm({
      username: "",
      firstName: "",
      lastName: "",
      nic: "",
      address: "",
      dob: "",
      phone1: "",
      phone2: "",
      password: "",
      repeatPassword: "",
    });
    setErrors({});
  };

  /* ---- shared input style ---- */
  const inputStyle = {
    width: "100%",
    padding: "var(--space-3) var(--space-4)",
    background: "#f3f4f6",
    border: "1px solid transparent",
    borderRadius: "var(--radius-md)",
    color: "var(--color-text-primary)",
    fontSize: "var(--fs-sm)",
    outline: "none",
    transition: "border-color 200ms, box-shadow 200ms",
  };

  const inputFocusHandler = (e) => {
    e.target.style.borderColor = "var(--color-secondary)";
    e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,0.12)";
  };
  const inputBlurHandler = (e) => {
    e.target.style.borderColor = "transparent";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* ---- Header ---- */}
      <Header title="Create Account" onLogout={() => onNavigate("login")} />

      {/* ---- Main Form Content ---- */}
      <main style={{ flex: 1, padding: "var(--space-8) var(--space-6)", maxWidth: 860, width: "100%", margin: "0 auto" }}>
        <h1
          className="page-title"
          style={{
            textAlign: "center",
            marginBottom: "var(--space-8)",
            fontSize: "var(--fs-2xl)",
            color: "var(--color-primary)",
            fontWeight: "var(--fw-bold)",
          }}
        >
          Create account
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

          {/* Username — full width */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={update("username")}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              style={inputStyle}
              placeholder="Enter your username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          {/* First name + Last Name — side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={update("firstName")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={update("lastName")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          {/* NIC — full width */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">NIC</label>
            <input
              type="text"
              value={form.nic}
              onChange={update("nic")}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              style={inputStyle}
              placeholder="Enter NIC number"
            />
            {errors.nic && <span className="form-error">{errors.nic}</span>}
          </div>

          {/* Address — full width */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={update("address")}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              style={inputStyle}
              placeholder="Enter your address"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          {/* Date of birthday — full width (left half) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date of birthday</label>
            <input
              type="date"
              value={form.dob}
              onChange={update("dob")}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
              style={{ ...inputStyle, maxWidth: 380 }}
            />
            {errors.dob && <span className="form-error">{errors.dob}</span>}
          </div>

          {/* Phone Number + Phone number 2 — side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={form.phone1}
                onChange={update("phone1")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="Enter phone number"
              />
              {errors.phone1 && <span className="form-error">{errors.phone1}</span>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone number 2</label>
              <input
                type="tel"
                value={form.phone2}
                onChange={update("phone2")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Password + Repeat Password — side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={update("password")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="••••••••"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Repeat Password</label>
              <input
                type="password"
                value={form.repeatPassword}
                onChange={update("repeatPassword")}
                onFocus={inputFocusHandler}
                onBlur={inputBlurHandler}
                style={inputStyle}
                placeholder="••••••••"
              />
              {errors.repeatPassword && <span className="form-error">{errors.repeatPassword}</span>}
            </div>
          </div>

          {/* Buttons: Submit + Clear */}
          <div className="flex-center gap-md" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn-primary" style={{ minWidth: 300, justifyContent: "center" }}>
              Submit
            </button>
            <button type="button" className="btn-secondary" style={{ minWidth: 300, justifyContent: "center" }} onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </main>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
