import React, { useState, useEffect } from "react";
import {
  Pencil,
  Phone,
  MapPin,
  Mail,
  X,
  Check,
  UserCheck,
  AlertTriangle,
  Shield,
} from "lucide-react";
import Header from "../common components/header.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import Footer from "../common components/footer.jsx";
import EditProfileModal from "./EditProfileModal.jsx";

const initialProfile = {
  id: null,
  name: "",
  initials: "U",
  role: "",
  employeeId: "",
  joined: "Active",
  tenure: "-",
  phone: "",
  address: "",
  email: "",
  status: "Active",
};

const toInitials = (name) =>
  (name || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

/**
 * UserProfileForAdmin
 * Admin view of user profiles fully styled with index.css classes & design tokens.
 */
export default function UserProfileForAdmin({ onNavigate = () => { } }) {
  const [user, setUser] = useState(initialProfile);
  const [allUsers, setAllUsers] = useState([]);

  // Modal states
  const [isEditing, setIsEditing] = useState(false);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  const showNotification = (msg) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(""), 3500);
  };

  const loadUserById = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          ...data,
          initials: toInitials(data.name),
          phone: data.phone_num || "",
          address: data.address || "Not set",
        }));
        setSelectedRole(data.role || "");
      }
    } catch (e) {
      console.error("Failed to fetch user profile", e);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("http://localhost:8000/api/users", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (!Array.isArray(list) || list.length === 0) return;
        setAllUsers(list);
        const storedId = Number(localStorage.getItem("selected_user_id") || localStorage.getItem("user_id"));
        const target = list.find((u) => u.id === storedId) || list[0];
        loadUserById(target.id);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Handle Edit Profile Save
  const handleSaveProfile = async (updatedData) => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          address: updatedData.address,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          ...data,
          initials: toInitials(data.name),
          phone: data.phone_num || "",
          address: data.address || "Not set",
        }));
        showNotification("User profile updated successfully!");
      }
    } catch (e) {
      console.error("Failed to update user profile", e);
    }
  };

  // Handle Change Role Save
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data, role: data.role }));
        setIsRoleModalOpen(false);
        showNotification(`User role changed to ${data.role} successfully!`);
      }
    } catch (e) {
      console.error("Failed to update user role", e);
    }
  };

  // Handle Deactivate / Activate Status Toggle
  const handleToggleStatus = async () => {
    if (!user.id) return;
    const nextActive = user.status !== "Active";
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data, status: data.status }));
        setIsDeactivateModalOpen(false);
        showNotification(
          data.status === "Deactivated"
            ? "User has been deactivated."
            : "User has been reactivated successfully."
        );
      }
    } catch (e) {
      console.error("Failed to toggle user status", e);
    }
  };

  const statusItems = [
    { label: "Role", value: user.role },
    { label: "Employee ID", value: user.employeeId },
    { label: "Joined", value: user.joined },
    { label: "Tenture", value: user.tenure },
  ];

  const contactItems = [
    { icon: Phone, label: "Phone", value: user.phone },
    { icon: MapPin, label: "Address", value: user.address },
    { icon: Mail, label: "Email", value: user.email },
  ];

  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ---- Top Navigation Bar ---- */}
      <Header
        title="Workers & Blocks"
        crumbs={[
          { label: "Home", href: "#" },
          { label: "Dashboard", href: "#" },
        ]}
        onLogout={() => onNavigate("login")}
      />

      {/* ---- Main Layout (Sidebar + Main Content) ---- */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <RoleSidebar activeItem="BlockManagement" onNavigate={onNavigate} />

        {/* ---- Profile Content ---- */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: "var(--space-12)", overflowX: "hidden" }}>
          {/* Cover Banner */}
          <div
            style={{
              height: 200,
              background: "linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-primary) 100%)",
              width: "100%",
            }}
          />

          {/* Profile Container */}
          <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 var(--space-6)" }}>
            {allUsers.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
                <select
                  className="input-primary"
                  style={{ maxWidth: 260 }}
                  value={user.id || ""}
                  onChange={(e) => loadUserById(Number(e.target.value))}
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Header section: Avatar, User Info & Action Buttons */}
            <div
              className="flex-between"
              style={{
                alignItems: "flex-end",
                marginTop: -70,
                marginBottom: "var(--space-8)",
                flexWrap: "wrap",
                gap: "var(--space-4)",
              }}
            >
              {/* Avatar & Name */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-5)" }}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-primary)",
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
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <h1 className="page-title" style={{ margin: 0 }}>
                      {user.name}
                    </h1>
                    {user.status === "Deactivated" && (
                      <span className="badge-danger" style={{ fontSize: "var(--fs-xs)" }}>
                        Deactivated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Deactivate | Change Role | Edit Profile */}
              <div
                className="flex-center"
                style={{
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-3)",
                  flexWrap: "wrap",
                }}
              >
                {/* 1. Deactivate Button */}
                <button
                  type="button"
                  onClick={() => setIsDeactivateModalOpen(true)}
                  style={{
                    background: user.status === "Active" ? "rgba(229, 57, 53, 0.12)" : "rgba(67, 160, 71, 0.14)",
                    color: user.status === "Active" ? "var(--color-danger)" : "var(--color-success)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--space-2) var(--space-4)",
                    fontSize: "var(--fs-sm)",
                    fontWeight: "var(--fw-semibold)",
                    cursor: "pointer",
                    transition: "opacity var(--transition-fast)",
                  }}
                  className="hover-fade"
                >
                  {user.status === "Active" ? "Deactivate" : "Activate"}
                </button>

                {/* 2. Change Role Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(user.role);
                    setIsRoleModalOpen(true);
                  }}
                  style={{
                    background: "var(--color-dark-green)",
                    color: "var(--color-text-inverse)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--space-2) var(--space-4)",
                    fontSize: "var(--fs-sm)",
                    fontWeight: "var(--fw-semibold)",
                    cursor: "pointer",
                    transition: "background-color var(--transition-fast)",
                  }}
                  className="hover-lift"
                >
                  Change Role
                </button>

                {/* 3. Edit Profile Button */}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-text-inverse)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--space-2) var(--space-4)",
                    fontSize: "var(--fs-sm)",
                    fontWeight: "var(--fw-semibold)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                  className="hover-lift"
                >
                  <Pencil size={15} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Success Alert Notification */}
            {actionSuccessMessage && (
              <div className="alert alert-success" style={{ marginBottom: "var(--space-6)" }}>
                <Check size={18} />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Two-Column Cards Layout */}
            <div className="grid-2">
              {/* Left Card: Account Status */}
              <div
                style={{
                  background: "var(--color-hover-green)",
                  border: "1px solid var(--color-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-5)",
                }}
              >
                <h2 className="section-title" style={{ margin: 0, color: "var(--color-dark-green)" }}>
                  Account Status
                </h2>
                <div className="flex-col gap-md">
                  {statusItems.map((item) => (
                    <div key={item.label}>
                      <div
                        style={{
                          fontSize: "var(--fs-md)",
                          fontWeight: "var(--fw-bold)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--fs-sm)",
                          color: "var(--color-text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Card: Contact & Personal */}
              <div
                style={{
                  background: "var(--color-hover-green)",
                  border: "1px solid var(--color-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-5)",
                }}
              >
                <h2 className="section-title" style={{ margin: 0, color: "var(--color-dark-green)" }}>
                  Contact & Personal
                </h2>
                <div className="flex-col gap-md">
                  {contactItems.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--space-4)",
                      }}
                    >
                      <div
                        style={{
                          marginTop: 3,
                          color: "var(--color-text-primary)",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "var(--fs-md)",
                            fontWeight: "var(--fw-bold)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: "var(--fs-sm)",
                            color: "var(--color-text-secondary)",
                            marginTop: 2,
                            wordBreak: "break-all",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ---- Footer ---- */}
      <Footer />

      {/* ======================================================== */}
      {/* 1. Reusable Edit Profile Modal                           */}
      {/* ======================================================== */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={user}
        onSave={handleSaveProfile}
        title="Edit User Profile"
      />

      {/* ======================================================== */}
      {/* 2. Change Role Modal                                     */}
      {/* ======================================================== */}
      {isRoleModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsRoleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="flex-center gap-xs">
                <Shield size={20} color="var(--color-primary)" />
                <h2 className="section-title" style={{ margin: 0 }}>
                  Change User Role
                </h2>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsRoleModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="flex-col gap-md" style={{ paddingTop: "var(--space-2)" }}>
              <p className="subtitle" style={{ margin: 0 }}>
                Select a new role for <strong>{user.name}</strong>:
              </p>

              <div className="flex-col gap-sm">
                {["Manager", "Supervisor", "Worker", "Admin"].map((r) => {
                  const isSelected = selectedRole === r;
                  return (
                    <label
                      key={r}
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
                        name="userRole"
                        value={r}
                        className="radio-primary"
                        checked={isSelected}
                        onChange={() => setSelectedRole(r)}
                      />
                      <span
                        style={{
                          fontSize: "var(--fs-sm)",
                          fontWeight: isSelected ? "var(--fw-semibold)" : "var(--fw-normal)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {r}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="modal-footer" style={{ marginTop: "var(--space-3)" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Deactivate / Activate Confirmation Modal               */}
      {/* ======================================================== */}
      {isDeactivateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDeactivateModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="flex-center gap-xs">
                {user.status === "Active" ? (
                  <AlertTriangle size={20} color="var(--color-danger)" />
                ) : (
                  <UserCheck size={20} color="var(--color-success)" />
                )}
                <h2 className="section-title" style={{ margin: 0 }}>
                  {user.status === "Active" ? "Deactivate User" : "Activate User"}
                </h2>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsDeactivateModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "var(--space-2) 0 var(--space-4)" }}>
              <p className="paragraph" style={{ margin: 0, fontSize: "var(--fs-sm)" }}>
                {user.status === "Active" ? (
                  <>
                    Are you sure you want to deactivate <strong>{user.name}</strong>? They will not be able to log in to the system until reactivated.
                  </>
                ) : (
                  <>
                    Are you sure you want to reactivate <strong>{user.name}</strong>? They will regain access to the system immediately.
                  </>
                )}
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsDeactivateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                className={user.status === "Active" ? "btn-danger" : "btn-primary"}
              >
                {user.status === "Active" ? "Yes, Deactivate" : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
