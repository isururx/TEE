import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import {
  Crown,
  Users,
  UserCheck,
  Shield,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Check,
  Server,
  Lock
} from "lucide-react";

/**
 * AdminDashboard Component (Standalone Dashboard Content)
 * Sidebars are rendered alongside in the parent layout/App wrapper.
 */
export default function AdminDashboard({ onNavigate = () => {} }) {
  const [toastMessage, setToastMessage] = useState("");

  const [pendingApprovals, setPendingApprovals] = useState([
    { id: "REQ-101", name: "Dhammika Perera", email: "dhammika@estate.lk", requestedRole: "Estate Manager", date: "2026-09-03" },
    { id: "REQ-102", name: "Suresh Raina", email: "suresh@estate.lk", requestedRole: "Supervisor", date: "2026-09-04" },
    { id: "REQ-103", name: "Anura Kumara", email: "anura@field.lk", requestedRole: "Field Worker", date: "2026-09-04" },
  ]);

  const [systemUsers, setSystemUsers] = useState([
    { id: "USR-001", name: "Hasanth J", email: "harshanth@example.com", role: "Estate Manager", status: "Active" },
    { id: "USR-002", name: "Kamal Perera", email: "kamal@example.com", role: "Supervisor", status: "Active" },
    { id: "USR-003", name: "Sunil Shantha", email: "sunil@example.com", role: "Field Worker", status: "Active" },
    { id: "USR-004", name: "Admin Lead", email: "admin@tee.lk", role: "Admin", status: "Active" },
  ]);

  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRoleInput, setNewRoleInput] = useState("Estate Manager");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleApproveAccount = (reqId, name) => {
    setPendingApprovals(pendingApprovals.filter((r) => r.id !== reqId));
    showToast(`Account approved for ${name}`);
  };

  const handleRejectAccount = (reqId, name) => {
    setPendingApprovals(pendingApprovals.filter((r) => r.id !== reqId));
    showToast(`Account registration rejected for ${name}`);
  };

  const handleChangeRole = (e) => {
    e.preventDefault();
    if (!selectedUserForRole) return;
    setSystemUsers(
      systemUsers.map((u) => (u.id === selectedUserForRole.id ? { ...u, role: newRoleInput } : u))
    );
    showToast(`Role updated for ${selectedUserForRole.name} to ${newRoleInput}`);
    setSelectedUserForRole(null);
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", flex: 1, width: "100%" }}>
      <Header
        title="Admin Control Center"
        crumbs={[{ label: "Home", href: "#" }, { label: "Admin Dashboard", href: "#" }]}
        user={{ name: "Admin Lead", role: "Admin", initials: "AD" }}
        onLogout={() => onNavigate("login")}
      />

      <main style={{ padding: "var(--space-6) var(--space-8)" }}>
        <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
          
          {toastMessage && (
            <div className="alert alert-success" style={{ position: "fixed", top: 80, right: 24, zIndex: "var(--z-toast)", boxShadow: "var(--shadow-modal)", display: "flex", flex: 1, alignItems: "center", gap: "var(--space-2)" }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Admin Banner */}
          <div
            className="card"
            style={{
              marginBottom: "var(--space-6)",
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              color: "#FFFFFF",
              padding: "var(--space-6)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex-between" style={{ flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: 4 }}>
                  <Crown size={24} color="#F59E0B" />
                  <h1 style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", margin: 0, color: "#FFFFFF" }}>
                    System Administrator Dashboard
                  </h1>
                </div>
                <p style={{ fontSize: "var(--fs-sm)", color: "#94A3B8", margin: 0 }}>
                  Master User Controls, Account Approvals, System Settings & Master Audit Controls
                </p>
              </div>

              <div className="flex-center gap-sm">
                <span className="badge-warning" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FBBF24", border: "1px solid #F59E0B" }}>
                  👑 Super Admin Access
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(245, 158, 11, 0.15)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Pending Approvals</div>
                <div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{pendingApprovals.length} Accounts</div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(37, 99, 235, 0.15)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Total Active Users</div>
                <div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{systemUsers.length} Users</div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Server size={24} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Server Status</div>
                <div style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", color: "#10B981" }}>Optimal</div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
            {/* Approvals */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <UserCheck size={18} color="var(--color-primary)" />
                  Account Approval Queue
                </h3>
                <span className="badge-warning">{pendingApprovals.length} Pending</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {pendingApprovals.map((req) => (
                  <div key={req.id} style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg)" }}>
                    <div className="flex-between" style={{ marginBottom: 4 }}>
                      <strong style={{ fontSize: "var(--fs-sm)" }}>{req.name}</strong>
                      <span className="badge-info" style={{ fontSize: "10px" }}>{req.requestedRole}</span>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", marginTop: 8 }}>
                      <button type="button" className="btn-outline" onClick={() => handleRejectAccount(req.id, req.name)} style={{ padding: "4px 8px", fontSize: "11px", color: "var(--color-danger)" }}>Reject</button>
                      <button type="button" className="btn-primary" onClick={() => handleApproveAccount(req.id, req.name)} style={{ padding: "4px 8px", fontSize: "11px" }}>Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={18} color="var(--color-primary)" />
                  System Users & Roles
                </h3>
                <span className="badge-info">{systemUsers.length} Users</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {systemUsers.map((usr) => (
                  <div key={usr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3)", background: "var(--color-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <div>
                      <strong style={{ fontSize: "var(--fs-sm)" }}>{usr.name}</strong>
                      <div className="text-muted" style={{ fontSize: "11px" }}>{usr.email}</div>
                    </div>
                    <span className="badge-success" style={{ fontSize: "10px" }}>{usr.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
