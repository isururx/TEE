import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";

const initialForm = {
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
};

/* Reusable Form Field Component defined outside the parent to preserve input focus across renders */
function InputField({ label, field, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`input-primary ${error ? "input-invalid" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

/**
 * CreateAccountUser
 * "Create account" page for new user registration.
 * Matches the reference wireframe: top navbar, centered form card, and footer.
 * Fully styled with index.css classes and design tokens.
 *
 * Props:
 *  - onNavigate: (pageKey: string) => void
 */
export default function CreateAccountUser({ onNavigate = () => { } }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  /* ---- helpers ---- */
  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    const req = (k, msg) => { if (!form[k]?.trim()) e[k] = msg; };
    req("username", "Username is required");
    req("firstName", "First name is required");
    req("lastName", "Last name is required");
    req("nic", "NIC is required");
    req("address", "Address is required");
    if (!form.dob) e.dob = "Date of birthday is required";
    req("phone1", "Phone number is required");

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";

    if (form.password !== form.repeatPassword) e.repeatPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log("Create user account payload:", form);
      onNavigate("login");
    }
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Header ---- */}
      <Header title="Create Account" onLogout={() => onNavigate("login")} />

      {/* ---- Main Form Content ---- */}
      <main style={{ flex: 1, padding: "var(--space-8) var(--space-6)", maxWidth: 860, width: "100%", margin: "0 auto" }}>
        <h1
          className="page-title text-center"
          style={{
            textAlign: "center",
            marginBottom: "var(--space-8)",
            color: "var(--color-primary)",
          }}
        >
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="flex-col" style={{ gap: "var(--space-5)" }}>
          {/* Row 1: Username — full width */}
          <InputField
            label="Username"
            field="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={update("username")}
            error={errors.username}
          />

          {/* Row 2: First name + Last Name — side by side */}
          <div className="grid-2">
            <InputField
              label="First name"
              field="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={update("firstName")}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              field="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={update("lastName")}
              error={errors.lastName}
            />
          </div>

          {/* Row 3: NIC — full width */}
          <InputField
            label="NIC"
            field="nic"
            placeholder="Enter NIC number"
            value={form.nic}
            onChange={update("nic")}
            error={errors.nic}
          />

          {/* Row 4: Address — full width */}
          <InputField
            label="Address"
            field="address"
            placeholder="Enter your address"
            value={form.address}
            onChange={update("address")}
            error={errors.address}
          />

          {/* Row 5: Date of birthday — left half */}
          <div className="grid-2">
            <InputField
              label="Date of birthday"
              field="dob"
              type="date"
              placeholder=""
              value={form.dob}
              onChange={update("dob")}
              error={errors.dob}
            />
            <div />
          </div>

          {/* Row 6: Phone Number + Phone number 2 — side by side */}
          <div className="grid-2">
            <InputField
              label="Phone Number"
              field="phone1"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone1}
              onChange={update("phone1")}
              error={errors.phone1}
            />
            <InputField
              label="Phone number 2"
              field="phone2"
              type="tel"
              placeholder="Optional"
              value={form.phone2}
              onChange={update("phone2")}
              error={errors.phone2}
            />
          </div>

          {/* Row 7: Password + Repeat Password — side by side */}
          <div className="grid-2">
            <InputField
              label="Password"
              field="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />
            <InputField
              label="Repeat Password"
              field="repeatPassword"
              type="password"
              placeholder="••••••••"
              value={form.repeatPassword}
              onChange={update("repeatPassword")}
              error={errors.repeatPassword}
            />
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
