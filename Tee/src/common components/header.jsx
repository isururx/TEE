import React, { useState, useEffect } from "react";
import { Bell, Search, ChevronDown, User, Settings, LogOut, Moon, Sun } from "lucide-react";

const THEME_KEY = "tee-theme";

function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", theme);
}

/**
 * Header
 * Reusable top bar for the TEE app.
 * Uses theme.css classes: .breadcrumbs, .input-search, .btn-icon,
 * .avatar, .dropdown-menu, .dropdown-item, .badge-danger
 *
 * Props:
 *  - title: current page title shown as the breadcrumb trail's last item
 *  - crumbs: array of { label, href } for the trail before `title`
 *  - user: { name, role, initials }
 *  - notificationCount: number shown on the bell badge
 *  - onSearch: (value: string) => void
 *  - onLogout: () => void
 */
export default function Header({
  title = "Dashboard",
  crumbs = [{ label: "Home", href: "#" }],
  user = { name: "Hasanth J", role: "Manager", initials: "HJ" },
  notificationCount = 3,
  onSearch = () => {},
  onLogout = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <header
      className="flex-between"
      
      style={{
        height: "var(--topbar-height)",
        padding: "0 var(--space-6)",
        background: "var(--color-card)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
      }}
    >
      {/* Left: breadcrumbs */}
      <div className="breadcrumbs">
        {crumbs.map((c) => (
          <React.Fragment key={c.label}>
            <a href={c.href}>{c.label}</a>
            <span>/</span>
          </React.Fragment>
        ))}
        <span className="current">{title}</span>
      </div>

      {/* Right: search, notifications, avatar */}
      <div className="flex-center gap-md">
        <div className="input-search" style={{ width: 220 }}>
          <Search size={16} />
          <input
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <button
          className="btn-icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          style={{ marginRight: "var(--space-2)" }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: "relative" }}>
          <button
            className="btn-icon"
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={18} />
          </button>
          {notificationCount > 0 && (
            <span
              className="badge-danger"
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                padding: "0 5px",
                fontSize: "10px",
                lineHeight: "16px",
                minWidth: 16,
                textAlign: "center",
              }}
            >
              {notificationCount}
            </span>
          )}

          {notifOpen && (
            <div
              className="dropdown-menu"
              style={{ position: "absolute", right: 0, top: 36, width: 280 }}
            >
              <div className="notification-item unread">
                New disease report on Sector A03
              </div>
              <div className="notification-item">
                Task assigned: Harvest inspection
              </div>
              <div className="notification-item">
                Supplier delivery confirmed
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <div
            role="button"
            tabIndex={0}
            className="flex-center gap-xs"
            style={{ cursor: "pointer" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="avatar avatar-md">{user.initials}</div>
            <ChevronDown size={16} color="var(--color-text-secondary)" />
          </div>

          {menuOpen && (
            <div
              className="dropdown-menu"
              style={{ position: "absolute", right: 0, top: 44, width: 200 }}
            >
              <div style={{ padding: "8px 12px" }}>
                <div className="section-title" style={{ fontSize: 13 }}>
                  {user.name}
                </div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {user.role}
                </div>
              </div>
              <div className="dropdown-item">
                <User size={15} /> Profile
              </div>
              <div className="dropdown-item">
                <Settings size={15} /> Settings
              </div>
              <div className="dropdown-item" onClick={onLogout}>
                <LogOut size={15} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
