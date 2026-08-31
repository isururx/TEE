import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Footer from "../common components/footer.jsx";

const initialForm = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone1: "",
  phone2: "",
  role: "Manager",
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
 * CreateAccountStaff
 * "Create account" page for Staff (Managers & Supervisors).
 * Matches the reference wireframe: top navbar, 2-column form card, role selector, and footer.
 * Fully styled with index.css classes and design tokens.
 */
export default function CreateAccountStaff({ onNavigate = () => { } }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    const req = (k, msg) => { if (!form[k]?.trim()) e[k] = msg; };
    req("username", "Username is required");
    req("firstName", "First name is required");
    req("lastName", "Last name is required");

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address";

    req("phone1", "Phone number is required");
    if (!form.role) e.role = "Role is required";

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
      console.log("Create staff account payload:", form);
    }
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>


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
          {/* Row 1: Username */}
          <div className="grid-2">
            <InputField
              label="Username"
              field="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={update("username")}
              error={errors.username}
            />
            <div />
          </div>

          {/* Row 2: First Name & Last Name */}
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

          {/* Row 3: Email */}
          <div className="grid-2">
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
            />
            <div />
          </div>

          {/* Row 4: Phone Numbers */}
          <div className="grid-2">
            <InputField
              label="Phone number 1"
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

          {/* Row 5: Role Radio Selector */}
          <div className="grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role</label>
              <div className="flex-center gap-lg" style={{ justifyContent: "flex-start", paddingTop: "var(--space-2)" }}>
                {["Manager", "Supervisor"].map((r) => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer", fontSize: "var(--fs-sm)", color: "var(--color-text-primary)" }}>
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      className="radio-primary"
                      checked={form.role === r}
                      onChange={update("role")}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>
            <div />
          </div>

          {/* Row 6: Passwords */}
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

          {/* Action Buttons */}
          <div className="flex-center gap-md" style={{ marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn-primary" style={{ minWidth: 200, justifyContent: "center" }}>
              Submit
            </button>
            <button type="button" className="btn-secondary" style={{ minWidth: 200, justifyContent: "center" }} onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="btn-danger" style={{ minWidth: 200, justifyContent: "center" }} onClick={() => onNavigate("login")}>
              Cancel
            </button>
          </div>
        </form>
      </main>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
