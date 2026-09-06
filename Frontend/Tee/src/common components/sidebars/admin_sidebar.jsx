import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCheck,
  Shield,
  Map,
  Camera,
  CheckSquare,
  Clock,
  Package,
  Truck,
  Settings,
  Leaf
} from "lucide-react";

/**
 * AdminSidebar Component
 * Located in src/common components/sidebars/admin_sidebar.jsx
 * Dedicated sidebar for System Administrators.
 */
export default function AdminSidebar({
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const sections = [
    {
      label: "System Overview",
      items: [
        { key: "dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
        { key: "analytics", label: "Estate Analytics", icon: BarChart3 },
      ],
    },
    {
      label: "User & Access Control",
      items: [
        { key: "users", label: "User Management", icon: Users },
        { key: "accountApprovals", label: "Account Approvals", icon: UserCheck },
        { key: "roleAssignment", label: "Role Assignment", icon: Shield },
      ],
    },
    {
      label: "Operations & Plantation",
      items: [
        { key: "blocks", label: "Plantation Block Registry", icon: Map },
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
      label: "System Administration",
      items: [
        { key: "settings", label: "System Settings", icon: Settings },
      ],
    },
  ];

  const isItemActive = (itemKey) => {
    if (activeItem === itemKey) return true;
    if (itemKey === "TaskManagement" && (activeItem === "tasks" || activeItem === "taskManagement")) return true;
    if (itemKey === "blocks" && (activeItem === "BlockManagement" || activeItem === "blockManagement" || activeItem === "BlockDetail")) return true;
    if (itemKey === "settings" && activeItem === "system") return true;
    if (itemKey === "users" && (activeItem === "userProfileForAdmin" || activeItem === "adminProfile")) return true;
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
        <span className="badge-warning" style={{ fontSize: "10px", marginLeft: "auto", background: "rgba(245, 158, 11, 0.2)", color: "#D97706" }}>
          👑 Admin
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
