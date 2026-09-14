import React from "react";
import {
  LayoutDashboard,
  Camera,
  CheckSquare,
  Clock,
  User,
  Leaf,
} from "lucide-react";

export default function WorkerSidebar({
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const sections = [
    {
      label: "Overview",
      items: [
        { key: "dashboard", label: "Worker Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Quality & AI Tools",
      items: [
        { key: "detection", label: "Disease Detection", icon: Camera, highlight: true },
      ],
    },
    {
      label: "My Work",
      items: [
        { key: "tasks", label: "My Daily Tasks", icon: CheckSquare },
        { key: "attendance", label: "My Attendance", icon: Clock },
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
        <span style={{ fontWeight: 700 }}>TEE Worker</span>
      </div>

      <div
        style={{
          padding: "var(--space-2) var(--space-6) var(--space-4)",
          borderBottom: "1px solid var(--color-border)",
          marginBottom: "var(--space-2)",
        }}
      >
        <span
          className="badge badge-success"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          Field Worker
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
            {section.items.map(({ key, label, icon: Icon, highlight }) => {
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
                    position: "relative",
                    background: highlight && !active ? "rgba(46, 125, 50, 0.05)" : undefined,
                  }}
                >
                  <Icon className="icon" size={18} color={highlight && !active ? "var(--color-primary)" : undefined} />
                  <span style={{ fontSize: "0.875rem", fontWeight: highlight ? 600 : 400 }}>{label}</span>
                  {highlight && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.65rem",
                        background: "var(--color-primary)",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontWeight: 700,
                      }}
                    >
                      AI
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
