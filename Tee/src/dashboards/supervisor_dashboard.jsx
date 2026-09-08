import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import {
  Camera,
  Package,
  BarChart3,
  CheckSquare,
  Clock,
  Users,
  Truck,
  FileText,
  AlertTriangle,
  ClipboardList,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  X,
  UserPlus,
  RotateCcw,
  Download,
  Calendar,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

/**
 * SupervisorDashboard Component
 * 
 * Implements the Supervisor Dashboard layout following the exact structure,
 * design system rules, and UI conventions of Manager Dashboard.
 */
export default function SupervisorDashboard({ onNavigate = () => {} }) {
  // Modal state management
  const [activeModal, setActiveModal] = useState(null); // null | 'newWorker' | 'assignWorker' | 'manageSuppliers'

  // Toast / notification feedback state
  const [toastMessage, setToastMessage] = useState("");

  // Sample State Data
  const [workers, setWorkers] = useState([
    { id: "W001", name: "Sunil Shantha", role: "Field Worker", block: "Block A01", status: "Active" },
    { id: "W002", name: "Nimal Siripala", role: "Sprayer Specialist", block: "Block A02", status: "Active" },
    { id: "W003", name: "Saman Kumara", role: "Field Worker", block: "Block B01", status: "Active" },
    { id: "W004", name: "Chandana Silva", role: "Field Worker", block: "Block A01", status: "On Leave" },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: "SUP-01", name: "AgroChem Lanka Ltd", category: "Fungicides & Pesticides", contact: "+94 77 123 4567" },
    { id: "SUP-02", name: "GreenCare Fertilizer Corp", category: "NPK & Organic Fertilizers", contact: "+94 71 987 6543" },
    { id: "SUP-03", name: "Ceylon Estate Supplies", category: "Harvesting Tools & Gear", contact: "+94 81 222 3344" },
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, item: "Copper Fungicide 50WP", quantity: "3.5 L", threshold: "10 L", level: "Critical", statusClass: "badge-danger" },
    { id: 2, item: "NPK 15-15-15 Fertilizer", quantity: "14 bags", threshold: "30 bags", level: "Warning", statusClass: "badge-warning" },
    { id: 3, item: "Pruning Shears (Heavy Duty)", quantity: "3 units", threshold: "8 units", level: "Warning", statusClass: "badge-warning" },
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: "TSK-201", title: "Block A01 Morning Leaf Plucking", assignee: "Sunil Shantha", role: "Worker", progress: 85, priority: "High" },
    { id: "TSK-202", title: "Block A02 Blister Blight Spraying", assignee: "Nimal Siripala", role: "Worker", progress: 60, priority: "High" },
    { id: "TSK-203", title: "Drainage Channel Inspection", assignee: "Saman Kumara", role: "Worker", progress: 40, priority: "Medium" },
  ]);

  // Form states for modals
  const [newWorkerData, setNewWorkerData] = useState({ name: "", role: "Field Worker", block: "Block A01" });
  const [newSupplierData, setNewSupplierData] = useState({ name: "", category: "", contact: "" });
  const [taskData, setTaskData] = useState({ title: "", assignee: "", priority: "Medium" });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Handlers
  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorkerData.name) return;
    const newW = {
      id: `W00${workers.length + 1}`,
      name: newWorkerData.name,
      role: newWorkerData.role,
      block: newWorkerData.block,
      status: "Active",
    };
    setWorkers([...workers, newW]);
    setNewWorkerData({ name: "", role: "Field Worker", block: "Block A01" });
    setActiveModal(null);
    showToast(`Successfully registered new worker: ${newW.name}`);
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierData.name) return;
    const newSup = {
      id: `SUP-0${suppliers.length + 1}`,
      name: newSupplierData.name,
      category: newSupplierData.category || "General Supplies",
      contact: newSupplierData.contact || "N/A",
    };
    setSuppliers([...suppliers, newSup]);
    setNewSupplierData({ name: "", category: "", contact: "" });
    showToast(`Added supplier: ${newSup.name}`);
  };

  const handleRemoveSupplier = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    showToast("Supplier removed successfully");
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.assignee) return;
    const newTask = {
      id: `TSK-${201 + assignedTasks.length}`,
      title: taskData.title,
      assignee: taskData.assignee,
      role: "Worker",
      progress: 0,
      priority: taskData.priority,
    };
    setAssignedTasks([newTask, ...assignedTasks]);
    setTaskData({ title: "", assignee: "", priority: "Medium" });
    setActiveModal(null);
    showToast(`Task "${newTask.title}" assigned to ${newTask.assignee}`);
  };

  // Shortcuts items configuration matching wireframe
  const shortcuts = [
    { id: "detection", label: "Disease Detection", icon: Camera, color: "var(--color-primary)", badge: "AI Ready" },
    { id: "inventory", label: "Inventory", icon: Package, color: "#2563EB", badge: `${lowStockItems.length} Low` },
    { id: "analytics", label: "State Analytics", icon: BarChart3, color: "#7C3AED", badge: "Live" },
    { id: "tasks", label: "Task Management", icon: CheckSquare, color: "#D97706", badge: `${assignedTasks.length} Active` },
    { id: "attendance", label: "Attendance Tracking", icon: Clock, color: "#059669", badge: "96% Today" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <Header
        title="Supervisor Dashboard"
        crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }]}
        user={{ name: "Kamal Perera", role: "Field Supervisor", initials: "KP" }}
      />

      {/* Main Layout Body */}
      <div style={{ minHeight: "calc(100vh - var(--topbar-height))", display: "flex" }}>
        <RoleSidebar activeItem="dashboard" role="supervisor" onNavigate={onNavigate} />
        <main style={{ flex: 1, minWidth: 0, padding: "var(--space-6) var(--space-8)" }}>
          <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
            
            {/* Toast Notification Feedback */}
            {toastMessage && (
              <div
                className="alert alert-success"
                style={{
                  position: "fixed",
                  top: 80,
                  right: 24,
                  zIndex: "var(--z-toast)",
                  boxShadow: "var(--shadow-modal)",
                }}
              >
                <CheckCircle2 size={18} />
                <span>{toastMessage}</span>
              </div>
            )}

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
                  Supervisor Dashboard
                </h1>
                <p
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--color-text-secondary)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Direct Field Supervision, Worker Attendance, Daily Task Allocation & Inventory Watch
                </p>
              </div>
              <div className="flex-center gap-md" style={{ flexWrap: "wrap" }}>
                <div className="status-chip" style={{ background: "#FFFFFF", padding: "6px 12px" }}>
                  <ShieldCheck size={14} color="var(--color-primary)" />
                  <span>System Status: <strong>Optimal</strong></span>
                </div>
                <div className="status-chip" style={{ background: "#FFFFFF", padding: "6px 12px" }}>
                  <Calendar size={14} color="var(--color-text-secondary)" />
                  <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------------
               1. SHORTCUTS AT GLANCE SECTION
               -------------------------------------------------------------------- */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                <h2
                  style={{
                    fontSize: "var(--fs-lg)",
                    fontWeight: "var(--fw-semibold)",
                    color: "var(--color-text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <span>Shortcuts At Glance</span>
                </h2>
                <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
                  Quick Navigation & Controls
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "var(--space-4)",
                }}
              >
                {shortcuts.map((sc) => {
                  const IconComp = sc.icon;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => onNavigate(sc.id)}
                      className="card"
                      style={{
                        padding: "var(--space-5) var(--space-4)",
                        textAlign: "center",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "var(--space-3)",
                        position: "relative",
                        transition: "all var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "var(--color-border)";
                      }}
                    >
                      {sc.badge && (
                        <span
                          className="badge-info"
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: "10px",
                            padding: "2px 6px",
                          }}
                        >
                          {sc.badge}
                        </span>
                      )}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "var(--radius-md)",
                          background: "var(--color-hover-green)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: sc.color,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        }}
                      >
                        <IconComp size={26} />
                      </div>
                      <span
                        style={{
                          fontSize: "var(--fs-sm)",
                          fontWeight: "var(--fw-semibold)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------------------------------
               2. MAIN DASHBOARD GRID (3 COLUMNS matching the wireframe)
               -------------------------------------------------------------------- */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "var(--space-6)",
                alignItems: "start",
              }}
            >
              {/* ================= COLUMN 1: User Controlling ================= */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div className="card" style={{ height: "100%" }}>
                  <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <Users size={18} color="var(--color-primary)" />
                      User Controlling
                    </h3>
                    <span className="badge-info">{workers.length} Registered</span>
                  </div>

                  <p className="text-muted" style={{ fontSize: "var(--fs-xs)", marginBottom: "var(--space-4)" }}>
                    Manage field workers, attendance logs, and sector assignments.
                  </p>

                  {/* Action Pill Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveModal("newWorker")}
                      style={{
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-full)",
                        fontWeight: "var(--fw-medium)",
                        background: "#F3F4F6",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-hover-green)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                    >
                      <UserPlus size={16} color="var(--color-primary)" />
                      <span>New Worker registration</span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onNavigate("attendance")}
                      style={{
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-full)",
                        fontWeight: "var(--fw-medium)",
                        background: "#F3F4F6",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-hover-green)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                    >
                      <Clock size={16} color="var(--color-primary)" />
                      <span>Attendance Tracking</span>
                    </button>
                  </div>

                  {/* Active Personnel Preview */}
                  <div>
                    <div className="section-title" style={{ fontSize: "var(--fs-xs)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                      Active Personnel Preview
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {workers.slice(0, 3).map((w) => (
                        <div
                          key={w.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "var(--space-2) var(--space-3)",
                            background: "var(--color-bg)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--fs-xs)",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>{w.name}</div>
                            <div className="text-muted">{w.role} • {w.block}</div>
                          </div>
                          <span className={w.status === "Active" ? "badge-success" : "badge-warning"} style={{ fontSize: "10px" }}>
                            {w.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= COLUMN 2: Manage Suppliers, Tasks & Reports ================= */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                
                {/* Card: Manage Suppliers */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <Truck size={18} color="var(--color-primary)" />
                      Manage Suppliers
                    </h3>
                    <span className="badge-info">{suppliers.length} Partners</span>
                  </div>

                  <div style={{ marginBottom: "var(--space-3)" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveModal("manageSuppliers")}
                      style={{
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-full)",
                        fontWeight: "var(--fw-medium)",
                        background: "#F3F4F6",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-hover-green)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                    >
                      <Plus size={16} color="var(--color-primary)" />
                      <span>Add / Remove Suppliers</span>
                    </button>
                  </div>
                </div>

                {/* Card: Manage Tasks */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <CheckSquare size={18} color="var(--color-primary)" />
                      Manage Tasks
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveModal("assignWorker")}
                      style={{
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-full)",
                        fontWeight: "var(--fw-medium)",
                        background: "#F3F4F6",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-hover-green)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
                    >
                      <Send size={16} color="var(--color-primary)" />
                      <span>Assign Tasks To workers</span>
                    </button>
                  </div>
                </div>

                {/* Card: Reports */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <FileText size={18} color="var(--color-primary)" />
                      Reports
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    <div
                      onClick={() => showToast("Exporting Field Shift & Harvest Report PDF...")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "var(--space-3)",
                        background: "var(--color-bg)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontSize: "var(--fs-xs)",
                      }}
                    >
                      <span style={{ fontWeight: "var(--fw-medium)" }}>Daily Field Shift & Harvest Log</span>
                      <Download size={14} color="var(--color-primary)" />
                    </div>

                    <div
                      onClick={() => showToast("Exporting Disease Detection Logs...")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "var(--space-3)",
                        background: "var(--color-bg)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontSize: "var(--fs-xs)",
                      }}
                    >
                      <span style={{ fontWeight: "var(--fw-medium)" }}>AI Disease Diagnosis Monthly Log</span>
                      <Download size={14} color="var(--color-primary)" />
                    </div>
                  </div>
                </div>

              </div>

              {/* ================= COLUMN 3: Low Stocks & Assigned Tasks ================= */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                
                {/* Card: Low Stocks */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <AlertTriangle size={18} color="#D97706" />
                      Low Stocks
                    </h3>
                    <span className="badge-warning">{lowStockItems.length} Alerts</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: "var(--space-3)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          background: "#FFFDF9",
                        }}
                      >
                        <div className="flex-between" style={{ marginBottom: 4 }}>
                          <span style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-xs)", color: "var(--color-text-primary)" }}>
                            {item.item}
                          </span>
                          <span className={item.statusClass} style={{ fontSize: "10px" }}>
                            {item.level}
                          </span>
                        </div>
                        <div className="flex-between" style={{ fontSize: "11px" }}>
                          <span className="text-muted">Current: <strong style={{ color: "var(--color-danger)" }}>{item.quantity}</strong> (Min: {item.threshold})</span>
                          <button
                            type="button"
                            className="btn-outline"
                            onClick={() => showToast(`Restock request sent for ${item.item}`)}
                            style={{ padding: "2px 8px", fontSize: "10px" }}
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card: Assigned Tasks */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3
                      style={{
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <ClipboardList size={18} color="var(--color-primary)" />
                      Assigned Tasks
                    </h3>
                    <span className="badge-info">{assignedTasks.length} In Progress</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {assignedTasks.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          padding: "var(--space-3)",
                          borderRadius: "var(--radius-md)",
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <div className="flex-between" style={{ marginBottom: 4 }}>
                          <span style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-xs)", color: "var(--color-text-primary)" }}>
                            {t.title}
                          </span>
                          <span className={t.priority === "High" ? "badge-danger" : "badge-info"} style={{ fontSize: "10px" }}>
                            {t.priority}
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: "11px", marginBottom: 6 }}>
                          Assigned to: {t.assignee} ({t.role})
                        </div>
                        {/* Progress bar */}
                        <div className="progress-bar" style={{ height: 6 }}>
                          <div className="progress-bar-fill" style={{ width: `${t.progress}%` }} />
                        </div>
                        <div style={{ textAlign: "right", fontSize: "10px", color: "var(--color-text-muted)", marginTop: 2 }}>
                          {t.progress}% Completed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* --------------------------------------------------------------------
         MODALS / DIALOGS
         -------------------------------------------------------------------- */}

      {/* 1. Modal: New Worker Registration */}
      {activeModal === "newWorker" && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>New Worker Registration</h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddWorker}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input-primary"
                  placeholder="e.g. Ruwan Jayasuriya"
                  required
                  value={newWorkerData.name}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="input-primary"
                  value={newWorkerData.role}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, role: e.target.value })}
                >
                  <option value="Field Worker">Field Worker</option>
                  <option value="Machine Operator">Machine Operator</option>
                  <option value="Sprayer Specialist">Sprayer Specialist</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Block</label>
                <select
                  className="input-primary"
                  value={newWorkerData.block}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, block: e.target.value })}
                >
                  <option value="Block A01">Block A01</option>
                  <option value="Block A02">Block A02</option>
                  <option value="Block B01">Block B01</option>
                  <option value="Block B02">Block B02</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Assign Tasks To Workers */}
      {activeModal === "assignWorker" && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>
                Assign Task To Workers
              </h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAssignTask}>
              <div className="form-group">
                <label className="form-label">Task Description</label>
                <input
                  type="text"
                  className="input-primary"
                  placeholder="e.g. Sector B Fungicide Spraying"
                  required
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  className="input-primary"
                  required
                  value={taskData.assignee}
                  onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                >
                  <option value="">Select Personnel</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} ({w.block})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="input-primary"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Manage Suppliers */}
      {activeModal === "manageSuppliers" && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>Manage Suppliers List</h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            {/* List existing suppliers */}
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {suppliers.map((s) => (
                  <div
                    key={s.id}
                    className="flex-between"
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--color-bg)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--fs-xs)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "var(--fw-semibold)" }}>{s.name}</div>
                      <div className="text-muted">{s.category} • {s.contact}</div>
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: "var(--color-danger)" }}
                      onClick={() => handleRemoveSupplier(s.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form to add supplier */}
            <form onSubmit={handleAddSupplier} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
              <h4 style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--space-3)" }}>Add New Supplier</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className="form-group">
                  <label className="form-label">Supplier Name</label>
                  <input
                    type="text"
                    className="input-primary"
                    placeholder="Company Name"
                    required
                    value={newSupplierData.name}
                    onChange={(e) => setNewSupplierData({ ...newSupplierData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="input-primary"
                    placeholder="e.g. Fertilizer"
                    value={newSupplierData.category}
                    onChange={(e) => setNewSupplierData({ ...newSupplierData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
