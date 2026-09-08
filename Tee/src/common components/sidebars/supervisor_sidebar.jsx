import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Map,
  Users,
  Camera,
  User,
  Leaf,
} from "lucide-react";

export default function SupervisorSidebar({
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const sections = [
    {
      label: "Overview",
      items: [
        { key: "dashboard", label: "Supervisor Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Field Operations",
      items: [
        { key: "TaskManagement", label: "Daily Tasks", icon: CheckSquare },
        { key: "attendance", label: "Attendance Tracking", icon: Clock },
        { key: "BlockManagement", label: "Assigned Blocks", icon: Map },
        { key: "WorkerManagement", label: "Field Workers", icon: Users },
      ],
    },
    {
      label: "Quality Control",
      items: [
        { key: "detection", label: "Disease Detection", icon: Camera },
      ],
    },
    {
      label: "Account",
      items: [
        { key: "profile", label: "My Profile", icon: User },
      ],
    },
  ];

  return (
    <aside
      className={`sidebar${isOpen ? " is-open" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="sidebar-brand" style={{ padding: "var(--space-4) var(--space-6)" }}>
        <Leaf className="icon" size={20} color="var(--color-primary)" />
        <span style={{ fontWeight: 700 }}>TEE Supervisor</span>
      </div>

      <div
        style={{
          padding: "var(--space-2) var(--space-6) var(--space-4)",
          borderBottom: "1px solid var(--color-border)",
          marginBottom: "var(--space-2)",
        }}
      >
        <span
          className="badge badge-warning"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          Field Supervisor
        </span>
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "var(--space-6)",
        }}
        className="hide-scrollbar"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {sections.map((section) => (
          <div key={section.label} style={{ marginBottom: "var(--space-3)" }}>
            <div className="sidebar-section-label" style={{ padding: "var(--space-2) var(--space-6)", fontSize: "0.7rem" }}>
              {section.label}
            </div>
            {section.items.map(({ key, label, icon: Icon }) => {
              const active = activeItem === key;
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate(key)}
                  onKeyDown={(e) => e.key === "Enter" && onNavigate(key)}
                  className={`sidebar-link${active ? " nav-active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) var(--space-6)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon className="icon" size={18} />
                  <span style={{ fontSize: "0.875rem" }}>{label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
