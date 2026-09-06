import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Camera,
  CheckSquare,
  Clock,
  Package,
  Truck,
  User,
  Leaf
} from "lucide-react";

/**
 * SupervisorSidebar Component
 * Located in src/common components/sidebars/supervisor_sidebar.jsx
 * Dedicated sidebar for Field Supervisors.
 */
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
        { key: "analytics", label: "Estate Analytics (View)", icon: BarChart3 },
      ],
    },
    {
      label: "Field Operations",
      items: [
        { key: "blocks", label: "Block Details", icon: Map },
        { key: "detection", label: "Disease Detection", icon: Camera },
        { key: "TaskManagement", label: "Assign & Manage Tasks", icon: CheckSquare },
        { key: "attendance", label: "Shift Attendance", icon: Clock },
      ],
    },
    {
      label: "Stock & Inventory",
      items: [
        { key: "inventory", label: "Stock In / Stock Out", icon: Package },
        { key: "suppliers", label: "Supplier Directory", icon: Truck },
      ],
    },
    {
      label: "Personal",
      items: [
        { key: "profile", label: "My Profile", icon: User },
      ],
    },
  ];

  const isItemActive = (itemKey) => {
    if (activeItem === itemKey) return true;
    if (itemKey === "TaskManagement" && (activeItem === "tasks" || activeItem === "taskManagement")) return true;
    if (itemKey === "blocks" && (activeItem === "BlockManagement" || activeItem === "blockManagement" || activeItem === "BlockDetail")) return true;
    if (itemKey === "profile" && activeItem === "settings") return true;
    return false;
  };

  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`}>
      <div
        className="sidebar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => onNavigate("dashboard")}
      >
        <Leaf className="icon" size={20} color="var(--color-primary)" />
        <span>TEE</span>
        <span className="badge-info" style={{ fontSize: "10px", marginLeft: "auto", background: "#E0F2FE", color: "#0284C7" }}>
          👷 Supervisor
        </span>
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }} className="no-scrollbar">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(({ key, label, icon: Icon }) => {
              const active = isItemActive(key);
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate(key)}
                  onKeyDown={(e) => e.key === "Enter" && onNavigate(key)}
                  className={`sidebar-link${active ? " nav-active" : ""}`}
                >
                  <Icon className="icon" size={18} />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
