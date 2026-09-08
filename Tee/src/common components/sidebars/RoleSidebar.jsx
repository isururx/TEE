import React from "react";
import AdminSidebar from "./admin_sidebar.jsx";
import ManagerSidebar from "./manager_sidebar.jsx";
import SupervisorSidebar from "./supervisor_sidebar.jsx";

/**
 * Reads user role from localStorage JSON ("user"), or direct keys ("user_role", "role").
 * Default fallback is "manager".
 */
export function getStoredRole() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed?.role) return parsed.role.toLowerCase();
      if (parsed?.user_role) return parsed.user_role.toLowerCase();
    }
  } catch (e) {
    // ignore json error
  }
  const directRole = localStorage.getItem("user_role") || localStorage.getItem("role") || "manager";
  return directRole.toLowerCase();
}

export default function RoleSidebar({
  role,
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const effectiveRole = (role || getStoredRole()).toLowerCase();

  if (effectiveRole.includes("admin")) {
    return <AdminSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
  }

  if (effectiveRole.includes("supervisor")) {
    return <SupervisorSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
  }

  return <ManagerSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
}
