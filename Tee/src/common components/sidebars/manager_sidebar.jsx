import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Map,
  CheckSquare,
  Clock,
  Package,
  Truck,
  Camera,
  Settings,
  Leaf,
  User,
} from "lucide-react";

export default function ManagerSidebar({
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const sections = [
    {
      label: "Overview",
      items: [
        { key: "dashboard", label: "Manager Dashboard", icon: LayoutDashboard },
        { key: "analytics", label: "State Analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Estate & Labor",
      items: [
        { key: "BlockManagement", label: "Block Management", icon: Map },
        { key: "WorkerManagement", label: "Worker Management", icon: Users },
        { key: "TaskManagement", label: "Task Management", icon: CheckSquare },
        { key: "attendance", label: "Attendance Tracking", icon: Clock },
      ],
    },
    {
      label: "Supply & Inventory",
      items: [
        { key: "inventory", label: "Inventory", icon: Package },
        { key: "suppliers", label: "Supplier Management", icon: Truck },
        { key: "detection", label: "Disease Detection", icon: Camera },
      ],
    },
    {
      label: "Account Settings",
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
        flexShrink: 0,
      }}
    >
      <div className="sidebar-brand" style={{ padding: "var(--space-4) var(--space-6)" }}>
        <Leaf className="icon" size={20} color="var(--color-primary)" />
        <span style={{ fontWeight: 700 }}>TEE Manager</span>
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
          Estate Manager
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
