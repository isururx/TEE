import React, { useState } from "react";
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
  Download,
  Calendar,
  ShieldCheck,
  Home,
  Settings,
  ChevronRight,
} from "lucide-react";

/**
 * SupervisorDashboardMobile Component
 * 
 * Mobile-optimized Supervisor Dashboard offering complete field feature access with 
 * touch-first controls, single-column stacking, mobile bottom navigation, and bottom sheets.
 */
export default function SupervisorDashboardMobile({ onNavigate = () => {} }) {
  const [activeModal, setActiveModal] = useState(null); // null | 'newWorker' | 'assignWorker' | 'manageSuppliers'
  const [toastMessage, setToastMessage] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState("dashboard"); // 'dashboard' | 'detection' | 'tasks' | 'settings'

  // Data States
  const [workers, setWorkers] = useState([
    { id: "W001", name: "Sunil Shantha", role: "Field Worker", block: "Block A01", status: "Active" },
    { id: "W003", name: "Nimal Siripala", role: "Field Worker", block: "Block B02", status: "Active" },
    { id: "W004", name: "Saman Kumara", role: "Field Worker", block: "Block C01", status: "On Leave" },
    { id: "W005", name: "Anura Bandara", role: "Field Worker", block: "Block A02", status: "Active" },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: "SUP-01", name: "AgroChem Lanka Ltd", category: "Fungicides & Pesticides", contact: "+94 77 123 4567" },
    { id: "SUP-02", name: "GreenCare Fertilizer Corp", category: "NPK & Fertilizers", contact: "+94 71 987 6543" },
    { id: "SUP-03", name: "Ceylon Estate Supplies", category: "Harvesting Tools", contact: "+94 81 222 3344" },
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, item: "Copper Fungicide 50WP", quantity: "4.5 L", threshold: "10 L", level: "Critical", statusClass: "badge-danger" },
    { id: 2, item: "NPK 15-15-15 Fertilizer", quantity: "12 bags", threshold: "30 bags", level: "Warning", statusClass: "badge-warning" },
    { id: 3, item: "Pruning Shears", quantity: "3 units", threshold: "8 units", level: "Warning", statusClass: "badge-warning" },
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: "TSK-201", title: "Sector A01 Early Blight Spraying", assignee: "Sunil Shantha", role: "Worker", progress: 65, priority: "High" },
    { id: "TSK-202", title: "Block B02 Harvest Plucking", assignee: "Nimal Siripala", role: "Worker", progress: 85, priority: "Medium" },
    { id: "TSK-203", title: "Block A02 Soil Aeration", assignee: "Anura Bandara", role: "Worker", progress: 30, priority: "Low" },
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
    if (!newWorkerData.name.trim()) return;
    const newW = {
      id: `W00${workers.length + 1}`,
      name: newWorkerData.name.trim(),
      role: newWorkerData.role,
      block: newWorkerData.block,
      status: "Active",
    };
    setWorkers([...workers, newW]);
    setNewWorkerData({ name: "", role: "Field Worker", block: "Block A01" });
    setActiveModal(null);
    showToast(`Registered: ${newW.name}`);
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierData.name.trim()) return;
    const newSup = {
      id: `SUP-0${suppliers.length + 1}`,
      name: newSupplierData.name.trim(),
      category: newSupplierData.category.trim() || "General Supplies",
      contact: newSupplierData.contact.trim() || "N/A",
    };
    setSuppliers([...suppliers, newSup]);
    setNewSupplierData({ name: "", category: "", contact: "" });
    showToast(`Added: ${newSup.name}`);
  };

  const handleRemoveSupplier = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    showToast("Supplier removed");
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskData.title.trim() || !taskData.assignee) return;
    const newTask = {
      id: `TSK-${201 + assignedTasks.length}`,
      title: taskData.title.trim(),
      assignee: taskData.assignee,
      role: "Worker",
      progress: 0,
      priority: taskData.priority,
    };
    setAssignedTasks([newTask, ...assignedTasks]);
    setTaskData({ title: "", assignee: "", priority: "Medium" });
    setActiveModal(null);
    showToast(`Task assigned to ${newTask.assignee}`);
  };

  // Mobile Shortcut Items
  const shortcuts = [
    { id: "detection", label: "Disease Detection", icon: Camera, color: "var(--color-primary)", badge: "AI Ready" },
    { id: "inventory", label: "Inventory", icon: Package, color: "#2563EB", badge: `${lowStockItems.length} Low` },
    { id: "analytics", label: "State Analytics", icon: BarChart3, color: "#7C3AED", badge: "Live" },
    { id: "tasks", label: "Task Management", icon: CheckSquare, color: "#D97706", badge: `${assignedTasks.length} Active` },
    { id: "attendance", label: "Attendance Tracking", icon: Clock, color: "#059669", badge: "92%" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* Main Container */}
      <main style={{ padding: "var(--space-4)" }}>
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className="alert alert-success"
            style={{
              position: "fixed",
              top: 70,
              left: 16,
              right: 16,
              zIndex: "var(--z-toast)",
              boxShadow: "var(--shadow-modal)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "13px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Mobile Header Banner Card */}
        <div
          className="card"
          style={{
            marginBottom: "var(--space-4)",
            padding: "var(--space-4)",
            background: "linear-gradient(135deg, #FFFFFF 0%, var(--color-hover-green) 100%)",
          }}
        >
          <div className="flex-between" style={{ marginBottom: 6 }}>
            <h1 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", margin: 0 }}>
              Supervisor Dashboard
            </h1>
            <span className="badge-info" style={{ fontSize: "10px" }}>Supervisor Mobile</span>
          </div>
          <p className="text-muted" style={{ fontSize: "var(--fs-xs)", margin: "0 0 10px 0" }}>
            Field Operations & Worker Management
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="status-chip" style={{ fontSize: "10px", background: "#FFF" }}>
              <ShieldCheck size={12} color="var(--color-primary)" /> Active Shift
            </span>
            <span className="status-chip" style={{ fontSize: "10px", background: "#FFF" }}>
              <Calendar size={12} /> Today
            </span>
          </div>
        </div>

        {/* --------------------------------------------------------------------
           1. SHORTCUTS AT GLANCE (Mobile Touch Grid)
           -------------------------------------------------------------------- */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <div className="flex-between" style={{ marginBottom: "var(--space-2)" }}>
            <h2 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", margin: 0 }}>
              Shortcuts At Glance
            </h2>
            <span className="text-muted" style={{ fontSize: "11px" }}>Quick Access</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--space-3)",
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
                    padding: "var(--space-3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-hover-green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: sc.color,
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "var(--fs-xs)",
                        fontWeight: "var(--fw-semibold)",
                        color: "var(--color-text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sc.label}
                    </div>
                    {sc.badge && (
                      <span className="badge-info" style={{ fontSize: "9px", padding: "1px 4px" }}>
                        {sc.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --------------------------------------------------------------------
           2. MOBILE STACKED SECTIONS
           -------------------------------------------------------------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          
          {/* Card: User Controlling */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <Users size={16} color="var(--color-primary)" />
                User Controlling
              </h3>
              <span className="badge-info">{workers.length} Workers</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveModal("newWorker")}
                style={{
                  justifyContent: "flex-start",
                  width: "100%",
                  minHeight: "42px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--fs-xs)",
                  background: "#F3F4F6",
                }}
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
                  minHeight: "42px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--fs-xs)",
                  background: "#F3F4F6",
                }}
              >
                <Clock size={16} color="var(--color-primary)" />
                <span>Attendance Tracking</span>
              </button>
            </div>

            {/* Field Workers Preview */}
            <div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", marginBottom: 8, color: "var(--color-text-secondary)" }}>
              Field Personnel
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {workers.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                  }}
                >
                  <div>
                    <strong>{w.name}</strong> • <span className="text-muted">{w.block}</span>
                  </div>
                  <span className={w.status === "Active" ? "badge-success" : "badge-warning"} style={{ fontSize: "9px" }}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Manage Suppliers */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <Truck size={16} color="var(--color-primary)" />
                Manage Suppliers
              </h3>
              <span className="badge-info">{suppliers.length} Active</span>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActiveModal("manageSuppliers")}
              style={{
                justifyContent: "flex-start",
                width: "100%",
                minHeight: "42px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--fs-xs)",
                background: "#F3F4F6",
              }}
            >
              <Plus size={16} color="var(--color-primary)" />
              <span>Add / Remove Suppliers</span>
            </button>
          </div>

          {/* Card: Manage Tasks */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <CheckSquare size={16} color="var(--color-primary)" />
                Manage Tasks
              </h3>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActiveModal("assignWorker")}
              style={{
                justifyContent: "flex-start",
                width: "100%",
                minHeight: "42px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--fs-xs)",
                background: "#F3F4F6",
              }}
            >
              <Send size={16} color="var(--color-primary)" />
              <span>Assign Tasks To workers</span>
            </button>
          </div>

          {/* Card: Low Stocks */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <AlertTriangle size={16} color="#D97706" />
                Low Stocks
              </h3>
              <span className="badge-warning">{lowStockItems.length} Low</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    background: "#FFFDF9",
                    fontSize: "12px",
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <strong style={{ fontSize: "11px" }}>{item.item}</strong>
                    <span className={item.statusClass} style={{ fontSize: "9px" }}>
                      {item.level}
                    </span>
                  </div>
                  <div className="flex-between" style={{ fontSize: "10px" }}>
                    <span className="text-muted">Stock: <strong style={{ color: "var(--color-danger)" }}>{item.quantity}</strong> (Min {item.threshold})</span>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => showToast(`Restock requested for ${item.item}`)}
                      style={{ padding: "2px 6px", fontSize: "9px" }}
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
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <ClipboardList size={16} color="var(--color-primary)" />
                Assigned Tasks
              </h3>
              <span className="badge-info">{assignedTasks.length} Active</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {assignedTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "8px 10px",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: 2 }}>
                    <span style={{ fontWeight: "var(--fw-semibold)", fontSize: "11px" }}>{t.title}</span>
                    <span className={t.priority === "High" ? "badge-danger" : "badge-info"} style={{ fontSize: "9px" }}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-muted" style={{ fontSize: "10px", marginBottom: 4 }}>
                    {t.assignee}
                  </div>
                  <div className="progress-bar" style={{ height: 4 }}>
                    <div className="progress-bar-fill" style={{ width: `${t.progress}%` }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: "9px", color: "var(--color-text-muted)", marginTop: 2 }}>
                    {t.progress}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Reports */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: "var(--space-2)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <FileText size={16} color="var(--color-primary)" />
                Reports
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                onClick={() => showToast("Downloading Sector Performance Log...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "var(--color-bg)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                <span>Weekly Sector Yield & Worker Performance</span>
                <Download size={12} color="var(--color-primary)" />
              </div>
              <div
                onClick={() => showToast("Downloading Sector Disease Log...")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "var(--color-bg)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                <span>Field Disease Detection Log</span>
                <Download size={12} color="var(--color-primary)" />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --------------------------------------------------------------------
         BOTTOM NAVIGATION BAR (Mobile Native Experience)
         -------------------------------------------------------------------- */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "var(--color-card)",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: "var(--z-sticky)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => setActiveMobileTab("dashboard")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            color: activeMobileTab === "dashboard" ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontSize: "10px",
            fontWeight: activeMobileTab === "dashboard" ? "var(--fw-bold)" : "var(--fw-normal)",
            cursor: "pointer",
          }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate("detection")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            color: "var(--color-text-secondary)",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          <Camera size={18} />
          <span>Detection</span>
        </button>

        <button
          onClick={() => onNavigate("tasks")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            color: "var(--color-text-secondary)",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          <CheckSquare size={18} />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => onNavigate("profile")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            color: "var(--color-text-secondary)",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          <Settings size={18} />
          <span>Profile</span>
        </button>
      </nav>

      {/* --------------------------------------------------------------------
         MODALS / DIALOGS (Bottom Sheets)
         -------------------------------------------------------------------- */}

      {/* Modal: New Worker Registration */}
      {activeModal === "newWorker" && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ margin: "auto 16px 16px 16px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)" }}>New Field Worker</h3>
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
                  placeholder="Full name"
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
                  <option value="Harvester">Harvester</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Sector</label>
                <select
                  className="input-primary"
                  value={newWorkerData.block}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, block: e.target.value })}
                >
                  <option value="Block A01">Block A01</option>
                  <option value="Block A02">Block A02</option>
                  <option value="Block A03">Block A03</option>
                  <option value="Block B01">Block B01</option>
                  <option value="Block B02">Block B02</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Tasks To Workers */}
      {activeModal === "assignWorker" && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ margin: "auto 16px 16px 16px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)" }}>
                Assign Task To Worker
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
                  placeholder="Task title"
                  required
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select
                  className="input-primary"
                  required
                  value={taskData.assignee}
                  onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                >
                  <option value="">Select Worker</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} ({w.block})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Suppliers */}
      {activeModal === "manageSuppliers" && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ margin: "auto 16px 16px 16px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)" }}>Manage Suppliers</h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: "var(--space-3)" }}>
              {suppliers.map((s) => (
                <div
                  key={s.id}
                  className="flex-between"
                  style={{
                    padding: "6px 8px",
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: 4,
                    fontSize: "11px",
                  }}
                >
                  <div>
                    <strong>{s.name}</strong> <span className="text-muted">({s.category})</span>
                  </div>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: "var(--color-danger)" }}
                    onClick={() => handleRemoveSupplier(s.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSupplier}>
              <div className="form-group">
                <input
                  type="text"
                  className="input-primary"
                  placeholder="New Supplier Name"
                  required
                  value={newSupplierData.name}
                  onChange={(e) => setNewSupplierData({ ...newSupplierData, name: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
