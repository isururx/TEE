import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import {
  Users,
  ShieldCheck,
  Activity,
  Map,
  Package,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  BarChart3,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboard({ onNavigate = () => {} }) {
  const [toastMessage, setToastMessage] = useState("");

  const systemMetrics = [
    { label: "Active Users", value: "48", icon: Users, color: "var(--color-primary)", change: "+4 this week" },
    { label: "Estate Managers", value: "6", icon: ShieldCheck, color: "#2563EB", change: "All Active" },
    { label: "Supervisors", value: "14", icon: Map, color: "#D97706", change: "Active across 12 blocks" },
    { label: "System Health", value: "99.9%", icon: Activity, color: "#059669", change: "Optimal" },
  ];

  const recentLogs = [
    { id: 1, user: "Kasun M.", action: "Created new worker account", time: "10 mins ago", role: "Manager" },
    { id: 2, user: "Kamal P.", action: "Updated attendance records for Block A1", time: "25 mins ago", role: "Supervisor" },
    { id: 3, user: "System", action: "Completed automated daily yield backup", time: "1 hour ago", role: "System" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Header
        title="Admin Dashboard"
        crumbs={[{ label: "Home", href: "#" }, { label: "Admin Dashboard", href: "#" }]}
        user={{ name: "Admin", role: "Administrator", initials: "AD" }}
      />

      <div style={{ minHeight: "calc(100vh - var(--topbar-height))", display: "flex" }}>
        <RoleSidebar activeItem="dashboard" role="admin" onNavigate={onNavigate} />

        <main style={{ flex: 1, minWidth: 0, padding: "var(--space-6) var(--space-8)" }}>
          <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
            
            {/* Top Banner / Title Header */}
            <div
              className="card"
              style={{
                marginBottom: "var(--space-6)",
                background: "linear-gradient(135deg, #FFFFFF 0%, var(--color-hover-green) 100%)",
                border: "1px solid var(--color-border)",
                padding: "var(--space-5) var(--space-6)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--space-4)",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "var(--fs-2xl)",
                    fontWeight: "var(--fw-bold)",
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                    margin: 0,
                  }}
                >
                  Admin Control Center
                </h1>
                <p
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--color-text-secondary)",
                    margin: "4px 0 0 0",
                  }}
                >
                  System Administration, User Access Control & Plantation System Monitoring
                </p>
              </div>
              <div className="flex-center gap-md" style={{ flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate("users")}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <UserPlus size={16} />
                  <span>Manage Users</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-4)",
                marginBottom: "var(--space-6)",
              }}
            >
              {systemMetrics.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="card" style={{ padding: "var(--space-5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                      <span style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                        {m.label}
                      </span>
                      <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={m.color} />
                      </div>
                    </div>
                    <div style={{ fontSize: "var(--fs-3xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-success)" }}>
                      {m.change}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)", marginBottom: "var(--space-6)" }}>
              {/* Activity Overview */}
              <div className="card" style={{ padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 600 }}>Recent System Activity</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("activityLogs")}>
                    View All Logs
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {recentLogs.map((log) => (
                    <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3)", background: "var(--color-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{log.action}</div>
                        <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>{log.user} ({log.role})</div>
                      </div>
                      <span style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-tertiary)" }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="card" style={{ padding: "var(--space-6)" }}>
                <h3 style={{ margin: "0 0 var(--space-4) 0", fontSize: "var(--fs-lg)", fontWeight: 600 }}>Admin Quick Tools</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <button className="btn btn-secondary" onClick={() => onNavigate("analytics")} style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", height: "auto" }}>
                    <BarChart3 size={20} color="var(--color-primary)" />
                    <span style={{ fontWeight: 600 }}>State Analytics</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => onNavigate("BlockManagement")} style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", height: "auto" }}>
                    <Map size={20} color="#2563EB" />
                    <span style={{ fontWeight: 600 }}>Block Management</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => onNavigate("inventory")} style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", height: "auto" }}>
                    <Package size={20} color="#D97706" />
                    <span style={{ fontWeight: 600 }}>Inventory Overview</span>
                  </button>
                  <button className="btn btn-secondary" onClick={() => onNavigate("adminProfile")} style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", height: "auto" }}>
                    <Users size={20} color="#7C3AED" />
                    <span style={{ fontWeight: 600 }}>Admin Profile</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
