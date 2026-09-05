import React, { useState, useEffect } from "react";
import Header from "../common components/header.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import Footer from "../common components/footer.jsx";
import {
  Search, Filter, Download, Calendar, User, Shield, Zap,
  CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Activity, Users, Eye, X, RefreshCw, Layers,
} from "lucide-react";

/* ─── Mock data ──────────────────────────────────────────────────────────── */
const ALL_LOGS = [
  {
    id: 1, timestamp: "29 Aug 2026 10:30:45 AM",
    user: "Kasun M.", email: "kasun.manager@estate.lk", initials: "KM", avatarBg: "#16A34A",
    role: "Manager", action: "Updated Stock", actionType: "update",
    module: "Inventory Management", description: 'Updated quantity of item "Copper Oxychloride"',
    status: "Success", extra: "Quantity changed from 20 to 35 units.",
  },
  {
    id: 2, timestamp: "29 Aug 2026 10:25:12 AM",
    user: "Nimal Perera", email: "nimal.supervisor@estate.lk", initials: "NP", avatarBg: "#7C3AED",
    role: "Supervisor", action: "Created Task", actionType: "create",
    module: "Task Management", description: "Created new task for Block B-05",
    status: "Success", extra: "Task assigned to 3 workers, deadline 30 Aug 2026.",
  },
  {
    id: 3, timestamp: "29 Aug 2026 10:20:05 AM",
    user: "Admin User", email: "admin@estate.lk", initials: "AU", avatarBg: "#1B5E20",
    role: "Admin", action: "Approved User", actionType: "approve",
    module: "User Management", description: "Approved registration request of user Saman",
    status: "Success", extra: "New account activated and welcome email sent.",
  },
  {
    id: 4, timestamp: "29 Aug 2026 10:15:33 AM",
    user: "Worker01", email: "worker01@estate.lk", initials: "W1", avatarBg: "#DC2626",
    role: "Worker", action: "Login Attempt", actionType: "login",
    module: "Authentication", description: "Failed login attempt due to incorrect password",
    status: "Failed", extra: "Account temporarily locked after 3 consecutive failures.",
  },
  {
    id: 5, timestamp: "29 Aug 2026 10:10:22 AM",
    user: "Saman K.", email: "saman.manager@estate.lk", initials: "SK", avatarBg: "#0EA5E9",
    role: "Manager", action: "Deleted Item", actionType: "delete",
    module: "Inventory Management", description: 'Deleted item "Neem Oil 1L" from inventory',
    status: "Success", extra: "Item removed permanently. No stock remained.",
  },
  {
    id: 6, timestamp: "29 Aug 2026 09:58:44 AM",
    user: "Admin User", email: "admin@estate.lk", initials: "AU", avatarBg: "#1B5E20",
    role: "Admin", action: "Role Changed", actionType: "update",
    module: "User Management", description: "Changed Nimal Perera role: Worker → Supervisor",
    status: "Success", extra: "Role updated in the system. Permissions adjusted.",
  },
  {
    id: 7, timestamp: "29 Aug 2026 09:47:02 AM",
    user: "Kasun M.", email: "kasun.manager@estate.lk", initials: "KM", avatarBg: "#16A34A",
    role: "Manager", action: "Export Report", actionType: "export",
    module: "Reports & Analytics", description: "Exported monthly analytics report — August 2026",
    status: "Success", extra: "PDF report generated and downloaded.",
  },
  {
    id: 8, timestamp: "29 Aug 2026 09:32:19 AM",
    user: "Worker02", email: "worker02@estate.lk", initials: "W2", avatarBg: "#F59E0B",
    role: "Worker", action: "Attendance Marked", actionType: "create",
    module: "Attendance", description: "Clocked in at Block D, Row 5 — GPS verified",
    status: "Success", extra: "Clock-in time: 09:32 AM. Location: Block D.",
  },
  {
    id: 9, timestamp: "29 Aug 2026 09:15:55 AM",
    user: "Saman K.", email: "saman.manager@estate.lk", initials: "SK", avatarBg: "#0EA5E9",
    role: "Manager", action: "Supplier Added", actionType: "create",
    module: "Inventory Management", description: "Registered new supplier — AgriChem Solutions Pvt Ltd",
    status: "Success", extra: "Supplier ID: SUP-2026-009 assigned.",
  },
  {
    id: 10, timestamp: "29 Aug 2026 09:01:07 AM",
    user: "Worker03", email: "worker03@estate.lk", initials: "W3", avatarBg: "#7C3AED",
    role: "Worker", action: "Logout", actionType: "logout",
    module: "Authentication", description: "User session ended normally",
    status: "Success", extra: "Session duration: 3 hours 14 minutes.",
  },
];

const TOTAL_ENTRIES = 1245;
const TOTAL_PAGES   = Math.ceil(TOTAL_ENTRIES / 10);

/* ─── Badge colour maps ──────────────────────────────────────────────────── */
const ACTION_BADGE = {
  update:  { bg: "#DBEAFE", color: "#1D4ED8" },
  create:  { bg: "#D1FAE5", color: "#065F46" },
  approve: { bg: "#D1FAE5", color: "#065F46" },
  login:   { bg: "#FEE2E2", color: "#DC2626" },
  logout:  { bg: "#F3F4F6", color: "#6B7280" },
  delete:  { bg: "#FEE2E2", color: "#DC2626" },
  export:  { bg: "#EDE9FE", color: "#7C3AED" },
};
const ROLE_BADGE = {
  Admin:      { bg: "#D1FAE5", color: "#065F46" },
  Manager:    { bg: "#DBEAFE", color: "#1D4ED8" },
  Supervisor: { bg: "#EDE9FE", color: "#7C3AED" },
  Worker:     { bg: "#FEF3C7", color: "#92400E" },
};

/* ─── Stat card icons config ─────────────────────────────────────────────── */
const STATS = [
  { label: "Total Activities", value: "1,245", sub: "All time",          icon: Layers,   iconBg: "#F0F0FF", iconColor: "#6366F1" },
  { label: "Today's Activities",value: "186",  sub: "Today",             icon: Calendar, iconBg: "#EFF6FF", iconColor: "#3B82F6" },
  { label: "Active Users",      value: "24",   sub: "Currently online",  icon: Users,    iconBg: "var(--color-hover-green)", iconColor: "var(--color-primary)" },
  { label: "Failed / Suspicious",value: "12",  sub: "Today",             icon: Shield,   iconBg: "#FEF2F2", iconColor: "var(--color-danger)" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON ROW — uses .skeleton from index.css
═══════════════════════════════════════════════════════════════════════════ */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
      {[120, 160, 80, 110, 140, 200, 80, 54].map((w, i) => (
        <td key={i} className="p-compact">
          <div className="skeleton" style={{ width: w, height: 12 }} />
        </td>
      ))}
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMPTY STATE — uses .empty-state from index.css
═══════════════════════════════════════════════════════════════════════════ */
function EmptyState({ onReset }) {
  return (
    <tr>
      <td colSpan={8}>
        <div className="empty-state">
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-full)",
            background: "var(--color-hover-green)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={26} color="var(--color-text-muted)" />
          </div>
          <h3 className="section-title" style={{ marginBottom: 0 }}>No activity logs found</h3>
          <p className="subtitle">Try changing your search or filter criteria.</p>
          <button className="btn-primary" onClick={onReset} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <RefreshCw size={14} /> Reset Filters
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER DROPDOWN — uses .input-primary (select variant) from index.css
═══════════════════════════════════════════════════════════════════════════ */
function FilterDropdown({ label, icon, value, options, onChange }) {
  return (
    <div className="form-group" style={{ marginBottom: 0, minWidth: 130 }}>
      <label className="label-text">{label}</label>
      <div className="input-search" style={{ borderRadius: "var(--radius-md)", paddingLeft: "var(--space-3)" }}>
        <span className="text-muted" style={{ display: "flex", flexShrink: 0 }}>{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: "none", outline: "none", background: "transparent",
            fontSize: "var(--fs-sm)", color: "var(--color-text-primary)",
            cursor: "pointer", width: "100%", fontFamily: "var(--font-sans)",
            fontWeight: "var(--fw-medium)",
          }}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL MODAL — uses .modal-backdrop .modal-card .modal-header .modal-footer
═══════════════════════════════════════════════════════════════════════════ */
function DetailModal({ log, onClose }) {
  if (!log) return null;
  const isSuccess = log.status === "Success";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 520, padding: 0, borderRadius: "var(--radius-xl)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-border)", marginBottom: 0 }}>
          <div className="flex-center gap-sm">
            <div style={{
              width: 36, height: 36, borderRadius: "var(--radius-md)",
              background: "var(--color-hover-green)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Eye size={17} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: "var(--fs-md)", marginBottom: 2 }}>Activity Details</h2>
              <span className="label-text">Read-only audit record</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        {/* User strip */}
        <div className="flex-between" style={{ padding: "var(--space-4) var(--space-6)", background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="flex-center gap-sm">
            <div
              className="avatar avatar-md"
              style={{ background: log.avatarBg, color: "#fff", fontWeight: "var(--fw-bold)" }}
            >
              {log.initials}
            </div>
            <div>
              <div style={{ fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)" }}>{log.user}</div>
              <div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{log.email}</div>
            </div>
          </div>
          <span
            className="badge-info"
            style={{ background: ROLE_BADGE[log.role]?.bg, color: ROLE_BADGE[log.role]?.color }}
          >
            {log.role}
          </span>
        </div>

        {/* Detail rows */}
        <div style={{ padding: "0 var(--space-6)" }}>
          {[
            ["Action",      log.action],
            ["Module",      log.module],
            ["Description", log.description],
            ["Date & Time", log.timestamp],
            ["Details",     log.extra],
          ].map(([label, val]) => (
            <div key={label} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)", alignItems: "flex-start", gap: "var(--space-3)" }}>
              <span className="label-text" style={{ flexShrink: 0, width: 120 }}>{label}</span>
              <span style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-primary)", lineHeight: "var(--lh-relaxed)", textAlign: "right" }}>{val}</span>
            </div>
          ))}
          {/* Status row */}
          <div className="flex-between" style={{ padding: "10px 0", alignItems: "center", gap: "var(--space-3)" }}>
            <span className="label-text" style={{ flexShrink: 0, width: 120 }}>Status</span>
            <span className={isSuccess ? "badge-success" : "badge-danger"}>
              {isSuccess ? <CheckCircle size={12} /> : <XCircle size={12} />}
              {log.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-border)" }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function ActivityLogs({ onNavigate = () => {} }) {
  const [search, setSearch]             = useState("");
  const [dateRange, setDateRange]       = useState("This Month");
  const [roleFilter, setRoleFilter]     = useState("All Roles");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage]   = useState(1);
  const [viewLog, setViewLog]           = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [exportMsg, setExportMsg]       = useState("");

  /* Simulate loading when dropdown filters change */
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, [dateRange, roleFilter, actionFilter, statusFilter]);

  /* Filter */
  const filtered = ALL_LOGS.filter((log) => {
    const q = search.toLowerCase();
    if (q && ![log.user, log.email, log.action, log.module, log.description]
      .some((v) => v.toLowerCase().includes(q))) return false;
    if (roleFilter   !== "All Roles"   && log.role   !== roleFilter)   return false;
    if (statusFilter !== "All Status"  && log.status !== statusFilter) return false;
    if (actionFilter !== "All Actions" &&
      !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    return true;
  });

  const resetFilters = () => {
    setSearch(""); setDateRange("This Month");
    setRoleFilter("All Roles"); setActionFilter("All Actions");
    setStatusFilter("All Status"); setCurrentPage(1);
  };

  const handleExport = () => {
    setExportMsg("Generating PDF…");
    setTimeout(() => setExportMsg("PDF exported successfully!"), 1200);
    setTimeout(() => setExportMsg(""), 3000);
  };

  const paginate  = (p) => { if (p >= 1 && p <= TOTAL_PAGES) setCurrentPage(p); };
  const pageNums  = () => TOTAL_PAGES <= 5
    ? Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)
    : [1, 2, 3, "...", TOTAL_PAGES];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ── Shared Header ── */}
      <Header
        title="Activity Logs"
        crumbs={[{ label: "Home", href: "#" }, { label: "System", href: "#" }]}
        user={{ name: "Admin User", role: "System Admin", initials: "AU" }}
        onLogout={() => onNavigate("login")}
      />

      <div style={{ display: "flex", minHeight: "calc(100vh - var(--topbar-height))" }}>

        {/* ── Shared Sidebar ── */}
        <RoleSidebar activeItem="activityLogs" onNavigate={onNavigate} />

        {/* ── Main column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "var(--space-6) var(--space-8)" }}>
            <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>

              {/* Export toast */}
              {exportMsg && (
                <div className="toast toast-success" style={{ position: "fixed", top: 76, right: 24, zIndex: "var(--z-toast)" }}>
                  {exportMsg}
                </div>
              )}

              {/* ── Page heading ── */}
              <div className="flex-between" style={{ marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-4)" }}>
                <div>
                  <h1 className="page-title">Activity Logs</h1>
                  <p className="subtitle" style={{ color: "var(--color-primary)" }}>Monitor and audit system activities</p>
                </div>
                <button className="btn-primary" onClick={handleExport}>
                  <Download size={15} /> Export PDF
                </button>
              </div>

              {/* ── Stat cards ── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "var(--space-4)", marginBottom: "var(--space-6)",
              }}>
                {STATS.map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
                  <div key={label} className="card hover-lift" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-5)" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "var(--radius-md)",
                      background: iconBg, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={22} color={iconColor} />
                    </div>
                    <div>
                      <div className="label-text">{label}</div>
                      <div className="stat-value" style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)", lineHeight: 1.1 }}>{value}</div>
                      <div style={{ fontSize: "var(--fs-xs)", color: iconColor, marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Filter card ── */}
              <div className="card" style={{ marginBottom: "var(--space-5)" }}>
                {/* Search */}
                <div className="input-search" style={{ maxWidth: 500, marginBottom: "var(--space-4)" }}>
                  <Search size={16} />
                  <input
                    placeholder="Search by username, email, action or user ID..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                  {search && (
                    <button className="btn-icon" style={{ padding: 0, width: 20, height: 20 }} onClick={() => setSearch("")}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-end" }}>
                  <FilterDropdown label="Date Range"  icon={<Calendar size={14} />} value={dateRange}
                    options={["Today","Yesterday","This Week","This Month","Custom Range"]}
                    onChange={(v) => { setDateRange(v); setCurrentPage(1); }} />

                  <FilterDropdown label="User Role"   icon={<User size={14} />}     value={roleFilter}
                    options={["All Roles","Admin","Manager","Supervisor","Worker"]}
                    onChange={(v) => { setRoleFilter(v); setCurrentPage(1); }} />

                  <FilterDropdown label="Action Type" icon={<Zap size={14} />}      value={actionFilter}
                    options={["All Actions","Login","Logout","Create","Update","Delete","Approve","Reject","Export"]}
                    onChange={(v) => { setActionFilter(v); setCurrentPage(1); }} />

                  <FilterDropdown label="Status"      icon={<Shield size={14} />}   value={statusFilter}
                    options={["All Status","Success","Failed"]}
                    onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} />

                  <div className="flex-center gap-xs" style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
                    <button className="btn-ghost" onClick={resetFilters}>
                      <RefreshCw size={13} /> Reset
                    </button>
                    <button className="btn-secondary">
                      <Filter size={13} /> Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Table card ── */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-responsive">
                  <table className="table-modern">
                    <thead>
                      <tr>
                        {["Timestamp","User","Role","Action","Module","Description","Status","View"].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                        : filtered.length === 0
                          ? <EmptyState onReset={resetFilters} />
                          : filtered.map((log) => {
                              const aStyle = ACTION_BADGE[log.actionType] || ACTION_BADGE.update;
                              const rStyle = ROLE_BADGE[log.role]         || ROLE_BADGE.Worker;
                              const ok     = log.status === "Success";

                              return (
                                <tr key={log.id}>
                                  {/* Timestamp */}
                                  <td className="text-muted" style={{ whiteSpace: "nowrap", fontSize: "var(--fs-xs)" }}>
                                    {log.timestamp}
                                  </td>

                                  {/* User */}
                                  <td>
                                    <div className="flex-center gap-xs" style={{ justifyContent: "flex-start" }}>
                                      <div
                                        className="avatar avatar-sm"
                                        style={{ background: log.avatarBg, color: "#fff", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-xs)", flexShrink: 0 }}
                                      >
                                        {log.initials}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", whiteSpace: "nowrap", fontSize: "var(--fs-sm)" }}>
                                          {log.user}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{log.email}</div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Role badge */}
                                  <td>
                                    <span className="badge-info" style={{ background: rStyle.bg, color: rStyle.color }}>
                                      {log.role}
                                    </span>
                                  </td>

                                  {/* Action badge */}
                                  <td>
                                    <span className="badge-info" style={{ background: aStyle.bg, color: aStyle.color }}>
                                      {log.action}
                                    </span>
                                  </td>

                                  {/* Module */}
                                  <td style={{ whiteSpace: "nowrap", fontSize: "var(--fs-xs)" }}>{log.module}</td>

                                  {/* Description */}
                                  <td className="truncate text-muted" style={{ maxWidth: 220, fontSize: "var(--fs-xs)" }} title={log.description}>
                                    {log.description}
                                  </td>

                                  {/* Status */}
                                  <td>
                                    <span className={ok ? "badge-success" : "badge-danger"}>
                                      {ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                      {log.status}
                                    </span>
                                  </td>

                                  {/* View */}
                                  <td>
                                    <button
                                      className="btn-outline"
                                      onClick={() => setViewLog(log)}
                                      style={{ padding: "4px 14px", fontSize: "var(--fs-xs)" }}
                                    >
                                      <Eye size={13} /> View
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                      }
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination ── */}
                {!isLoading && filtered.length > 0 && (
                  <div className="flex-between" style={{ padding: "var(--space-4) var(--space-5)", borderTop: "1px solid var(--color-border)", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
                      Showing 1 to 10 of {TOTAL_ENTRIES.toLocaleString()} entries
                    </span>

                    <div className="pagination">
                      {/* Previous */}
                      <button
                        className="btn-ghost"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ padding: "5px 12px", fontSize: "var(--fs-xs)", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <ChevronLeft size={13} /> Previous
                      </button>

                      {/* Page numbers */}
                      {pageNums().map((p, i) => (
                        <button
                          key={i}
                          onClick={() => typeof p === "number" && paginate(p)}
                          className={`pagination-item${p === currentPage ? " active" : ""}`}
                          style={{ cursor: typeof p === "number" ? "pointer" : "default" }}
                        >
                          {p}
                        </button>
                      ))}

                      {/* Next */}
                      <button
                        className="btn-ghost"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === TOTAL_PAGES}
                        style={{ padding: "5px 12px", fontSize: "var(--fs-xs)", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        Next <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* ── Shared Footer ── */}
          <Footer />
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {viewLog && <DetailModal log={viewLog} onClose={() => setViewLog(null)} />}
    </div>
  );
}
