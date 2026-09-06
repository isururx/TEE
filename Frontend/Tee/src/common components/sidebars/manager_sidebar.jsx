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
 * ManagerSidebar Component
 * Located in src/common components/sidebars/manager_sidebar.jsx
 * Dedicated sidebar for Estate Managers.
 */
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
        { key: "analytics", label: "Estate Analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Operations & Plantation",
      items: [
        { key: "blocks", label: "Block Management", icon: Map },
        { key: "detection", label: "Disease Detection", icon: Camera },
        { key: "TaskManagement", label: "Task Management", icon: CheckSquare },
        { key: "attendance", label: "Attendance Tracking", icon: Clock },
      ],
    },
    {
      label: "Inventory & Suppliers",
      items: [
        { key: "inventory", label: "Inventory Catalogue", icon: Package },
        { key: "suppliers", label: "Supplier Management", icon: Truck },
      ],
    },
    {
      label: "Personal",
      items: [
        { key: "profile", label: "User Profile", icon: User },
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
        <span className="badge-info" style={{ fontSize: "10px", marginLeft: "auto" }}>
          🏢 Manager
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
