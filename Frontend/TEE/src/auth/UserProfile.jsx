import React, { useState } from "react";
import { Pencil, Phone, MapPin, Mail, X, Check } from "lucide-react";
import Header from "../common components/header.jsx";
import Sidebar from "../common components/sidebar.jsx";
import Footer from "../common components/footer.jsx";

const initialProfile = {
  name: "Hashanth J",
  initials: "HJ",
  role: "Manager",
  employeeId: "EF00123",
  joined: "Mar 2022",
  tenure: "2 years",
  phone: "070654164",
  address: "Block 4, Staff Quarters",
  email: "harshanth@example.com",
};

/**
 * UserProfile
 * User profile view showing account status, contact & personal details,
 * and an editable profile modal with standard Sidebar navigation.
 * Fully styled with index.css classes and design tokens.
 */
export default function UserProfile({ onNavigate = () => { } }) {
  const [user, setUser] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialProfile);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...editForm });
    setIsEditing(false);
  };

  const statusItems = [
    { label: "Role", value: user.role },
    { label: "Employee ID", value: user.employeeId },
    { label: "Joined", value: user.joined },
    { label: "Tenure", value: user.tenure },
  ];

  const contactItems = [
    { icon: Phone, label: "Phone", value: user.phone },
    { icon: MapPin, label: "Address", value: user.address },
    { icon: Mail, label: "Email", value: user.email },
  ];

  /* Modal Input Field Helper */
  const ModalInput = ({ label, field, type = "text" }) => (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="input-primary"
        value={editForm[field]}
        onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
        required
      />
    </div>
  );

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Header ---- */}
      <Header
        title="Profile"
        user={{ name: user.name, role: user.role, initials: user.initials }}
        onLogout={() => onNavigate("login")}
      />

      {/* ---- Layout with Sidebar and Main Content Area ---- */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar activeItem="settings" role="manager" onNavigate={onNavigate} />

        {/* ---- Main Profile Content ---- */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: "var(--space-12)", overflowX: "hidden" }}>
          {/* Cover Banner */}
          <div style={{ height: 200, background: "linear-gradient(135deg, #606770 0%, #474E57 100%)", width: "100%" }} />

          {/* Profile Container */}
          <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 var(--space-6)" }}>
            {/* Avatar & Edit Action */}
            <div className="flex-between" style={{ alignItems: "flex-end", marginTop: -70, marginBottom: "var(--space-8)", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-5)" }}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "var(--radius-full)",
                    background: "#D1D5DB",
                    border: "5px solid #FFFFFF",
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    fontWeight: "var(--fw-medium)",
                    color: "#FFFFFF",
                    userSelect: "none",
                  }}
                >
                  {user.initials}
                </div>

                <div style={{ paddingBottom: "var(--space-3)" }}>
                  <h1 className="page-title" style={{ margin: 0 }}>{user.name}</h1>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setEditForm({ ...user });
                  setIsEditing(true);
                }}
                style={{ background: "#000000", color: "#FFFFFF", marginBottom: "var(--space-3)", padding: "var(--space-2) var(--space-4)" }}
              >
                <Pencil size={15} /> Edit Profile
              </button>
            </div>

            {/* Cards Grid: Account Status & Contact */}
            <div className="grid-2">
              {/* Left Card: Account Status */}
              <div style={{ background: "#EDEDEE", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                <h2 className="section-title" style={{ margin: 0 }}>Account Status</h2>
                <div className="flex-col gap-md">
                  {statusItems.map((item) => (
                    <div key={item.label}>
                      <div style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{item.label}</div>
                      <div style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)", marginTop: 2 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Card: Contact & Personal */}
              <div style={{ background: "#EDEDEE", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                <h2 className="section-title" style={{ margin: 0 }}>Contact & Personal</h2>
                <div className="flex-col gap-md">
                  {contactItems.map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
                      <div style={{ marginTop: 3, color: "var(--color-text-primary)", flexShrink: 0 }}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{label}</div>
                        <div style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)", marginTop: 2, wordBreak: "break-all" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ---- Full-Width Footer across entire bottom ---- */}
      <Footer />

      {/* ---- Edit Profile Modal ---- */}
      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="section-title" style={{ margin: 0 }}>Edit Profile</h2>
              <button type="button" className="btn-icon" onClick={() => setIsEditing(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-col gap-sm">
              <ModalInput label="Full Name" field="name" />
              <ModalInput label="Phone" field="phone" type="tel" />
              <ModalInput label="Address" field="address" />
              <ModalInput label="Email" field="email" type="email" />

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
