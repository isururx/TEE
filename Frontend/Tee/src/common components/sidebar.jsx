import React from "react";
import {
  LayoutDashboard,
  Camera,
  Users,
  Truck,
  Map,
  CheckSquare,
  Clock,
  Package,
  Settings,
  Leaf,
  BarChart3,
} from "lucide-react";

/**
 * Sidebar
 * Reusable left navigation for the TEE app.
 * Uses theme.css classes: .sidebar, .sidebar-brand, .sidebar-section-label,
 * .sidebar-link, .nav-active
 *
 * Props:
 *  - role: "admin" | "manager" | "supervisor" | "worker"  (controls which sections show)
 *  - activeItem: string key of the currently active nav item
 *  - onNavigate: (key: string) => void  called when a nav item is clicked
 *  - isOpen: boolean, for mobile slide-in state (adds .is-open class)
 */
export default function Sidebar({
  role = "manager",
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const sections = [
    {
      label: "Overview",
      items: [
        { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { key: "detection", label: "Disease Detection", icon: Camera },
        { key: "analytics", label: "State Analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Management",
      roles: ["admin", "manager"],
      items: [
        { key: "users", label: "User Management", icon: Users },
        { key: "suppliers", label: "Supplier Management", icon: Truck },
        { key: "BlockManagement", label: "Block Management", icon: Map },
        { key: "tasks", label: "Task Management", icon: CheckSquare },
      ],
    },
    {
      label: "System",
      items: [
        { key: "attendance", label: "Attendance Tracking", icon: Clock },
        { key: "inventory", label: "Inventory", icon: Package },
        { key: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className={`sidebar${isOpen ? " is-open" : ""}`}>
      <div className="sidebar-brand">
        <Leaf className="icon" size={20} color="var(--color-primary)" />
        <span>TEE</span>
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        {sections
          .filter((section) => !section.roles || section.roles.includes(role))
          .map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
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
