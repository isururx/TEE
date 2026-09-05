import React from "react";
import AdminSidebar from "./admin_sidebar.jsx";
import ManagerSidebar from "./manager_sidebar.jsx";
import SupervisorSidebar from "./supervisor_sidebar.jsx";

/**
 * Dynamic RoleSidebar Component
 * Inspects role prop or user JSON stored in localStorage to render the matching sidebar.
 */
export default function RoleSidebar({
  role = null,
  activeItem = "dashboard",
  onNavigate = () => {},
  isOpen = false,
}) {
  const resolveRole = () => {
    if (role) return role.toLowerCase();

    const storedRole = localStorage.getItem("user_role");
    if (storedRole) return storedRole.toLowerCase();

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.role) return userObj.role.toLowerCase();
      }
    } catch (e) {
      console.warn("Could not parse user JSON from localStorage:", e);
    }

    return "manager";
  };

  const activeRole = resolveRole();

  if (activeRole.includes("admin")) {
    return <AdminSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
  }

  if (activeRole.includes("supervisor")) {
    return <SupervisorSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
  }

  return <ManagerSidebar activeItem={activeItem} onNavigate={onNavigate} isOpen={isOpen} />;
}
