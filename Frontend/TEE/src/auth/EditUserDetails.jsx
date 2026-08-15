import React, { useState } from "react";
import { XCircle, Save, CheckCircle2 } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";

const initialDetails = {
  username: "",
  firstName: "",
  lastName: "",
  nic: "",
  address: "",
  dob: "",
  phone1: "",
  phone2: "",
};

const formRows = [
  [{ label: "Username", field: "username" }, null],
  [{ label: "First name", field: "firstName" }, { label: "Last Name", field: "lastName" }],
  [{ label: "NIC", field: "nic" }, null],
  [{ label: "Address", field: "address" }, null],
  [{ label: "Date of Birth", field: "dob", type: "date" }, null],
  [{ label: "Phone Number", field: "phone1", type: "tel" }, { label: "Phone number 2", field: "phone2", type: "tel" }],
];

/**
 * EditUserDetails
 * "Edit your details" page matching the wireframe:
 * Top navbar, heading with Discard and Save buttons, 2-column form layout, and footer.
 * Fully styled with index.css classes and design tokens.
 */
export default function EditUserDetails({ onNavigate = () => { } }) {
  const [form, setForm] = useState(initialDetails);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    const req = (k, msg) => { if (!form[k]?.trim()) e[k] = msg; };
    req("username", "Username is required");
    req("firstName", "First name is required");
    req("lastName", "Last name is required");
    req("nic", "NIC is required");
    req("address", "Address is required");
    if (!form.dob) e.dob = "Date of Birth is required";
    req("phone1", "Phone number is required");
    return e;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log("Updated user details:", form);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleDiscard = () => {
    setForm(initialDetails);
    setErrors({});
    setIsSaved(false);
  };

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Header ---- */}
      <Header/>

      {/* ---- Main Form Content ---- */}
      <main style={{ flex: 1, padding: "var(--space-8) var(--space-6)", maxWidth: 960, width: "100%", margin: "0 auto" }}>
        {/* Action Bar */}
        <div className="flex-between" style={{ alignItems: "center", marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            Edit your details
          </h1>

          <div className="flex-center gap-md">
            <button
              type="button"
              onClick={handleDiscard}
              className="btn-danger"
              style={{ padding: "var(--space-2) var(--space-5)" }}
            >
              <XCircle size={16} /> Discard
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{ padding: "var(--space-2) var(--space-5)" }}
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="alert alert-success" style={{ marginBottom: "var(--space-6)" }}>
            <CheckCircle2 size={18} />
            <span>Your details have been saved successfully!</span>
          </div>
        )}

        {/* 2-Column Form Layout */}
        <form onSubmit={handleSave} className="flex-col" style={{ gap: "var(--space-5)" }}>
          {formRows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-2">
              {row.map((item, colIdx) =>
                item ? (
                  <div key={item.field} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{item.label}</label>
                    <input
                      type={item.type || "text"}
                      className={`input-primary ${errors[item.field] ? "input-invalid" : ""}`}
                      value={form[item.field]}
                      onChange={update(item.field)}
                    />
                    {errors[item.field] && <span className="form-error">{errors[item.field]}</span>}
                  </div>
                ) : (
                  <div key={`empty-${colIdx}`} />
                )
              )}
            </div>
          ))}
        </form>
      </main>

      {/* ---- Footer ---- */}
      <Footer />
    </div>
  );
}
