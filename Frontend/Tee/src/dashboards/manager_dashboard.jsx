import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
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
  ShieldCheck,
  Activity,
  Leaf
} from "lucide-react";

/**
 * Recreated ManagerDashboard Component (Standalone Dashboard Content)
 * Sidebars are rendered alongside in the parent layout/App wrapper.
 */
export default function ManagerDashboard({ onNavigate = () => {} }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [workers, setWorkers] = useState([
    { id: "W001", name: "Sunil Shantha", role: "Field Worker", block: "Block A01", status: "Active" },
    { id: "W002", name: "Kamal Perera", role: "Supervisor", block: "Block A03", status: "Active" },
    { id: "W003", name: "Nimal Siripala", role: "Field Worker", block: "Block B02", status: "Active" },
    { id: "W004", name: "Saman Kumara", role: "Field Worker", block: "Block C01", status: "On Leave" },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: "SUP-01", name: "AgroChem Lanka Ltd", category: "Fungicides & Pesticides", contact: "+94 77 123 4567" },
    { id: "SUP-02", name: "GreenCare Fertilizer Corp", category: "NPK & Organic Fertilizers", contact: "+94 71 987 6543" },
    { id: "SUP-03", name: "Ceylon Estate Supplies", category: "Harvesting Tools & Gear", contact: "+94 81 222 3344" },
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, item: "Copper Fungicide 50WP", quantity: "4.5 L", threshold: "10 L", level: "Critical", statusClass: "badge-danger" },
    { id: 2, item: "NPK 15-15-15 Fertilizer", quantity: "12 bags", threshold: "30 bags", level: "Warning", statusClass: "badge-warning" },
    { id: 3, item: "Pruning Shears (Heavy Duty)", quantity: "3 units", threshold: "8 units", level: "Warning", statusClass: "badge-warning" },
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: "TSK-101", title: "Sector A03 Blister Blight Spraying", assignee: "Kamal Perera", role: "Supervisor", progress: 75, priority: "High" },
    { id: "TSK-102", title: "Block B Morning Harvest Quality Audit", assignee: "Sunil Shantha", role: "Worker", progress: 40, priority: "Medium" },
    { id: "TSK-103", title: "Soil Moisture & Drainage Inspection", assignee: "Saman Kumara", role: "Worker", progress: 90, priority: "Low" },
  ]);

  const [newWorkerData, setNewWorkerData] = useState({ name: "", role: "Field Worker", block: "Block A01" });
  const [newSupplierData, setNewSupplierData] = useState({ name: "", category: "", contact: "" });
  const [taskData, setTaskData] = useState({ title: "", assignee: "", priority: "Medium" });
  const [selectedBlockToClear, setSelectedBlockToClear] = useState("Block A01");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

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
    showToast(`Successfully registered worker: ${newW.name}`);
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
      id: `TSK-${101 + assignedTasks.length}`,
      title: taskData.title,
      assignee: taskData.assignee,
      role: activeModal === "assignSupervisor" ? "Supervisor" : "Worker",
      progress: 0,
      priority: taskData.priority,
    };
    setAssignedTasks([newTask, ...assignedTasks]);
    setTaskData({ title: "", assignee: "", priority: "Medium" });
    setActiveModal(null);
    showToast(`Task "${newTask.title}" assigned to ${newTask.assignee}`);
  };

  const handleClearDiseaseHistory = () => {
    setActiveModal(null);
    showToast(`Disease history successfully cleared for ${selectedBlockToClear}`);
  };

  const shortcuts = [
    { id: "detection", label: "Disease Detection", icon: Camera, color: "var(--color-primary)", badge: "AI Ready" },
    { id: "inventory", label: "Inventory Catalogue", icon: Package, color: "#2563EB", badge: `${lowStockItems.length} Alerts` },
    { id: "analytics", label: "Estate Analytics", icon: BarChart3, color: "#7C3AED", badge: "Live Metrics" },
    { id: "tasks", label: "Task Management", icon: CheckSquare, color: "#D97706", badge: `${assignedTasks.length} Active` },
    { id: "attendance", label: "Attendance Tracking", icon: Clock, color: "#059669", badge: "94% Today" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", flex: 1, width: "100%" }}>
      {/* Header */}
      <Header
        title="Estate Manager Dashboard"
        crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }]}
        user={{ name: "Estate Manager", role: "Manager", initials: "EM" }}
        onLogout={() => onNavigate("login")}
      />

      <main style={{ padding: "var(--space-6) var(--space-8)" }}>
        <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
          
          {toastMessage && (
            <div className="alert alert-success" style={{ position: "fixed", top: 80, right: 24, zIndex: "var(--z-toast)", boxShadow: "var(--shadow-modal)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Manager Welcome Banner */}
          <div
            className="card"
            style={{
              marginBottom: "var(--space-6)",
              background: "linear-gradient(135deg, var(--color-card) 0%, var(--color-hover-green) 100%)",
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
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <Leaf size={22} color="var(--color-primary)" />
                <h1 style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)", letterSpacing: "-0.02em", margin: 0 }}>
                  Estate Operations Command
                </h1>
              </div>
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                Real-time tea plantation monitoring, field worker assignment & inventory management
              </p>
            </div>

            <div className="flex-center gap-md" style={{ flexWrap: "wrap" }}>
              <div className="status-chip" style={{ background: "var(--color-card)", padding: "6px 12px" }}>
                <ShieldCheck size={14} color="var(--color-primary)" />
                <span>System: <strong>Operational</strong></span>
              </div>
              <div className="status-chip" style={{ background: "var(--color-card)", padding: "6px 12px" }}>
                <Calendar size={14} color="var(--color-text-secondary)" />
                <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(46, 125, 50, 0.12)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Active Field Force</div>
                <div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{workers.length} Members</div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(217, 119, 6, 0.12)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Low Stock Warnings</div>
                <div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{lowStockItems.length} Items</div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(37, 99, 235, 0.12)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ClipboardList size={22} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Active Tasks</div>
                <div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{assignedTasks.length} Dispatched</div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(124, 58, 237, 0.12)", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={22} />
              </div>
              <div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>Estate Health Index</div>
                <div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-primary)" }}>98.4% Optimal</div>
              </div>
            </div>
          </div>

          {/* Shortcuts */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
              <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", margin: 0 }}>
                Shortcuts At Glance
              </h2>
              <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>Module Quick Navigation</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
              {shortcuts.map((sc) => {
                const IconComp = sc.icon;
                return (
                  <div
                    key={sc.id}
                    onClick={() => onNavigate(sc.id)}
                    className="card hover-lift"
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
                    }}
                  >
                    {sc.badge && (
                      <span className="badge-info" style={{ position: "absolute", top: 10, right: 10, fontSize: "10px", padding: "2px 6px" }}>
                        {sc.badge}
                      </span>
                    )}
                    <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: "var(--color-hover-green)", display: "flex", alignItems: "center", justifyContent: "center", color: sc.color }}>
                      <IconComp size={26} />
                    </div>
                    <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3-Column Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)", alignItems: "start" }}>
            {/* User Controlling */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "var(--space-2)", margin: 0 }}>
                  <Users size={18} color="var(--color-primary)" />
                  User Controlling
                </h3>
                <span className="badge-info">{workers.length} Registered</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                <button type="button" className="btn-secondary hover-lift" onClick={() => setActiveModal("newWorker")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                  <UserPlus size={16} color="var(--color-primary)" />
                  <span>New Worker registration</span>
                </button>

                <button type="button" className="btn-secondary hover-lift" onClick={() => onNavigate("attendance")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                  <Clock size={16} color="var(--color-primary)" />
                  <span>Attendance Tracking</span>
                </button>

                <button type="button" className="btn-secondary hover-lift" onClick={() => setActiveModal("clearHistory")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                  <RotateCcw size={16} color="var(--color-danger)" />
                  <span>Clear Disease history of a block</span>
                </button>
              </div>
            </div>

            {/* Manage Suppliers & Tasks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <div className="card">
                <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                  <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "var(--space-2)", margin: 0 }}>
                    <Truck size={18} color="var(--color-primary)" />
                    Manage Suppliers
                  </h3>
                  <span className="badge-info">{suppliers.length} Partners</span>
                </div>

                <button type="button" className="btn-secondary hover-lift" onClick={() => setActiveModal("manageSuppliers")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                  <Plus size={16} color="var(--color-primary)" />
                  <span>Add / Remove Suppliers</span>
                </button>
              </div>

              <div className="card">
                <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                  <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "var(--space-2)", margin: 0 }}>
                    <CheckSquare size={18} color="var(--color-primary)" />
                    Manage Tasks
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <button type="button" className="btn-secondary hover-lift" onClick={() => setActiveModal("assignSupervisor")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                    <Send size={16} color="var(--color-primary)" />
                    <span>Assign Tasks To Supervisor</span>
                  </button>
                  <button type="button" className="btn-secondary hover-lift" onClick={() => setActiveModal("assignWorker")} style={{ justifyContent: "flex-start", width: "100%", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                    <Send size={16} color="var(--color-primary)" />
                    <span>Assign Tasks To workers</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Low Stocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <div className="card">
                <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                  <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "var(--space-2)", margin: 0 }}>
                    <AlertTriangle size={18} color="#D97706" />
                    Low Stock Alerts
                  </h3>
                  <span className="badge-warning">{lowStockItems.length} Alerts</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {lowStockItems.map((item) => (
                    <div key={item.id} style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "rgba(249, 168, 37, 0.08)" }}>
                      <div className="flex-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-xs)", color: "var(--color-text-primary)" }}>{item.item}</span>
                        <span className={item.statusClass} style={{ fontSize: "10px" }}>{item.level}</span>
                      </div>
                      <div className="flex-between" style={{ fontSize: "11px" }}>
                        <span className="text-muted">Stock: <strong style={{ color: "var(--color-danger)" }}>{item.quantity}</strong></span>
                        <button type="button" className="btn-outline" onClick={() => showToast(`Restock requested for ${item.item}`)} style={{ padding: "2px 8px", fontSize: "10px" }}>Restock</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
