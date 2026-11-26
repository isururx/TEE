import React, { useState, useEffect } from "react";
import { Pencil, Phone, MapPin, Mail, ArrowLeft } from "lucide-react";
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
 * UserProfile
 * User profile view showing account status, contact & personal details,
 * and an editable profile modal with standard Sidebar navigation.
 * Fully styled with index.css classes and design tokens.
 */
export default function UserProfile({ onNavigate = () => { } }) {
  const [user, setUser] = useState(() => {
    try {
      const stored =
        sessionStorage.getItem("tee-worker") ||
        sessionStorage.getItem("tee-user") ||
        localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = parsed.name || parsed.full_name || parsed.username || initialProfile.name;
        const initials = name
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() || "W";
        return {
          ...initialProfile,
          ...parsed,
          name,
          initials,
          role: parsed.role || parsed.designation || initialProfile.role,
          employeeId:
            parsed.worker_id ||
            parsed.employeeId ||
            parsed.nic ||
            (parsed.id ? `W-${parsed.id}` : initialProfile.employeeId),
          phone: parsed.phone_num || parsed.phone || initialProfile.phone,
          email: parsed.email || initialProfile.email,
          address: parsed.address || initialProfile.address,
        };
      }
    } catch (e) {
      console.warn("Failed to load stored user", e);
    }
    return initialProfile;
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = user.id ?? user.user_id;
    if (!userId) return;
    const controller = new AbortController();
    fetch(`http://localhost:8000/api/users/${userId}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setUser((prev) => ({
          ...prev,
          ...data,
          initials: toInitials(data.name),
          phone: data.phone_num || prev.phone,
          address: data.address || prev.address || "Not set",
        }));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [user.id, user.user_id]);

  const handleSave = async (updatedData) => {
    const userId = user.id ?? user.user_id;
    let saved = updatedData;
    if (userId) {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
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
          saved = await res.json();
        }
      } catch (e) {
        console.error("Failed to save profile", e);
      }
    }
    setUser((prev) => {
      const next = {
        ...prev,
        ...saved,
        initials: toInitials(saved.name || prev.name),
        phone: saved.phone_num ?? saved.phone ?? prev.phone,
        address: saved.address ?? prev.address,
      };
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("user", JSON.stringify({ ...parsed, ...next }));
          window.dispatchEvent(new Event("tee-user-updated"));
        }
      } catch (e) {}
      return next;
    });
  };

  const statusItems = [
    { label: "Role", value: user.role },
    { label: "Employee ID", value: user.employeeId },
    { label: "Joined", value: user.joined || "Jan 2021" },
    { label: "Tenure", value: user.tenure || "3 years" },
  ];

  const contactItems = [
    { icon: Phone, label: "Phone", value: user.phone },
    { icon: MapPin, label: "Address", value: user.address },
    { icon: Mail, label: "Email", value: user.email },
  ];

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
        <RoleSidebar activeItem="profile" onNavigate={onNavigate} />

        {/* ---- Main Profile Content ---- */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: "var(--space-12)", overflowX: "hidden" }}>
          {/* Back Navigation Bar */}
          <div
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--color-card)",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--color-hover-green)",
                border: "1px solid var(--color-primary)",
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--color-primary)",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Cover Banner */}
          <div style={{ height: 200, background: "linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-primary) 100%)", width: "100%" }} />

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
                    background: "var(--color-primary)",
                    border: "5px solid var(--color-bg)",
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
                onClick={() => setIsEditing(true)}
                style={{ marginBottom: "var(--space-3)", padding: "var(--space-2) var(--space-4)" }}
              >
                <Pencil size={15} /> Edit Profile
              </button>
            </div>

            {/* Cards Grid: Account Status & Contact */}
            <div className="grid-2">
              {/* Left Card: Account Status */}
              <div style={{ background: "var(--color-hover-green)", border: "1px solid var(--color-primary)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
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
              <div style={{ background: "var(--color-hover-green)", border: "1px solid var(--color-primary)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
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

      {/* ---- Reusable Edit Profile Modal ---- */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={user}
        onSave={handleSave}
      />
    </div>
  );
}
