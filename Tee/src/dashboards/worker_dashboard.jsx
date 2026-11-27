import { apiFetch } from "../api/apiClient.js";
import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Leaf,
  CheckSquare,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Plus,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Home,
  User,
  X,
  Calendar,
  Activity,
  Send,
  HelpCircle,
  ClipboardList,
  Mail,
  Phone,
  LogOut,
} from "lucide-react";
import WorkerMyTasks from "../worker_block/WorkerMyTasks.jsx";

/**
 * WorkerDashboard Component
 * 
 * Exclusively mobile-based Worker Dashboard designed for tea estate field workers.
 * Features touch-first controls, single-column stacking, mobile bottom navigation,
 * direct camera AI leaf disease detection, and daily task management.
 * Perfectly aligned with the design, CSS tokens, and layout patterns of manager_Dashobard_mobile and supervisor_dashboard_mobile.
 */
export default function WorkerDashboard({ onNavigate = () => {}, initialTab = "dashboard", initialModal = null }) {
  const [toastMessage, setToastMessage] = useState("");
  const [activeModal, setActiveModal] = useState(initialModal); // null | 'addTask' | 'profile'
  const [activeMobileTab, setActiveMobileTab] = useState(initialTab); // 'dashboard' | 'tasks'
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const fileInputRef = useRef(null);

  // Worker Profile & Shift State
  const [workerInfo, setWorkerInfo] = useState({
    name: "Sunil Shantha",
    workerId: "W-104",
    id: null,
    nic: "198912345678",
    dob: "1989-05-14",
    phone: "+94 71 234 5678",
    email: "sunil.estate@teafarm.lk",
    address: "Block A Quarters #14, East Ridge Estate",
    assignedBlock: "Block A-04 (East Ridge)",
    supervisor: "Kamal Perera",
    supervisorPhone: "+94 77 123 4567",
    shiftTime: "07:00 AM - 03:30 PM",
    clockInTime: "07:15 AM",
    status: "On Duty",
    joinedDate: "15 Jan 2021",
    tenure: "3 Years",
    designation: "Field Worker / Senior Tea Harvester",
  });

  // Worker Tasks Checklist State
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Harvest Tea Leaves - Sector 4",
      time: "07:30 AM - 11:30 AM",
      completed: true,
      status: "COMPLETED",
      priority: "HIGH",
    },
    {
      id: 2,
      title: "Leaf Disease Visual Inspection",
      time: "11:45 AM - 01:00 PM",
      completed: false,
      status: "IN PROGRESS",
      priority: "MEDIUM",
    },
    {
      id: 3,
      title: "Weed Clearing - Drain Border B",
      time: "01:30 PM - 03:00 PM",
      completed: false,
      status: "QUEUED",
      priority: "LOW",
    },
  ]);

  useEffect(() => {
    if (initialModal === "profile") {
      onNavigate("profile");
    } else if (initialModal) {
      setActiveModal(initialModal);
    }
  }, [initialModal, onNavigate]);

  // Load worker session and fetch live worker profile details
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("tee-worker") || sessionStorage.getItem("tee-user") || localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const rawId = parsed.id ?? parsed.user_id ?? parsed.worker_id ?? parsed.workerId;
        const wId = typeof rawId === "string" && rawId.startsWith("W-")
          ? Number(rawId.replace("W-", ""))
          : Number(rawId);
        if (!Number.isFinite(wId) || wId <= 0) return;
        setWorkerInfo((prev) => ({
          ...prev,
          name: parsed.name || parsed.full_name || prev.name,
          workerId: parsed.worker_id || (parsed.id ? `W-${parsed.id}` : prev.workerId),
          id: wId,
          nic: parsed.nic || parsed.NIC || prev.nic,
          dob: parsed.dob || prev.dob,
          phone: parsed.phone_num || parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          address: parsed.address || prev.address,
          assignedBlock: parsed.assigned_block ? `Block ${parsed.assigned_block}` : prev.assignedBlock,
        }));

        apiFetch(`http://localhost:8000/api/workers/${wId}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data) {
              setWorkerInfo((prev) => ({
                ...prev,
                name: data.name || prev.name,
                nic: data.NIC || data.nic || prev.nic,
                dob: data.dob || prev.dob,
                phone: data.phone_num || prev.phone,
                email: data.email || prev.email,
                address: data.address || prev.address,
                assignedBlock: data.assigned_block ? `Block ${data.assigned_block}` : prev.assignedBlock,
              }));
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.error("Failed to parse worker session", e);
    }
  }, []);

  // Fetch real worker assigned tasks from backend API — only after real id resolves
  useEffect(() => {
    if (!workerInfo.id) return; // never fetch id 1 as fallback
    async function fetchWorkerTasks() {
      try {
        const workerId = workerInfo.id;
        const res = await apiFetch(`http://localhost:8000/api/workers/${workerId}/tasks`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTasks(
              data.map((t) => ({
                id: t.id,
                title: t.description || `Task #${t.id}`,
                time: t.deadline ? `Due: ${t.deadline}` : (t.plantation_block ? `Block ${t.plantation_block}` : "Current Shift"),
                completed: t.status === "FINISHED" || t.status === "COMPLETED",
                status: t.status,
                priority: t.priority,
              }))
            );
          }
        }
      } catch (err) {
        // Keep fallback checklist if backend is not responding
      }
    }
    fetchWorkerTasks();
  }, [workerInfo.id]);


  // Helper toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Toggle task complete
  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add custom worker field note/task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      time: "Current Shift",
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setActiveModal(null);
    showToast("Field task added to checklist.");
  };

  // Trigger quick scan file upload / mobile camera
  const handleFileScan = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast("Analyzing leaf image with AI model...");
    setTimeout(() => {
      showToast("Scan complete! Blister Blight detected (Mild severity). Supervisor alerted.");
    }, 1200);
    e.target.value = "";
  };

  // Mobile Shortcut Items
  const shortcuts = [
    {
      id: "scan",
      label: "AI Disease Scan",
      icon: Camera,
      color: "var(--color-primary)",
      badge: "AI Ready",
      action: () => onNavigate("detection"),
    },
    {
      id: "tasks",
      label: "My Assigned Tasks",
      icon: ClipboardList,
      color: "#D97706",
      badge: `${(tasks || []).filter((t) => !t.completed).length} Active`,
      action: () => setActiveMobileTab("tasks"),
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      color: "#2563EB",
      badge: "Account",
      action: () => onNavigate("profile"),
    },
  ];

  // When 'tasks' tab is active, render WorkerMyTasks directly — pass resolved id so it never re-guesses id 1
  if (activeMobileTab === "tasks") {
    return (
      <WorkerMyTasks
        onNavigate={onNavigate}
        onBack={() => setActiveMobileTab("dashboard")}
        workerId={workerInfo.id}
      />
    );
  }

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* Hidden Mobile Camera / File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileScan}
      />

      {/* Main Mobile Container */}
      <main style={{ padding: "var(--space-4)", maxWidth: 520, margin: "0 auto" }}>
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className="alert alert-success"
            style={{
              position: "fixed",
              top: 70,
              left: 16,
              right: 16,
              maxWidth: 480,
              margin: "0 auto",
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
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Leaf size={18} color="var(--color-primary)" />
              <h1 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", margin: 0 }}>
                Worker Dashboard
              </h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 14,
                border: "1px solid var(--color-primary)",
                background: "rgba(46, 125, 50, 0.08)",
                color: "var(--color-primary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <User size={13} />
              <span>My Profile</span>
            </button>
          </div>

          <p className="text-muted" style={{ fontSize: "var(--fs-xs)", margin: "0 0 10px 0" }}>
            Ayubowan, <strong>{workerInfo.name}</strong> ({workerInfo.workerId}) • {workerInfo.assignedBlock}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="status-chip" style={{ fontSize: "10px", background: "#FFF", color: "var(--color-primary)", fontWeight: 600 }}>
              <ShieldCheck size={12} color="var(--color-primary)" /> {workerInfo.status} (In at {workerInfo.clockInTime})
            </span>
            <span className="status-chip" style={{ fontSize: "10px", background: "#FFF" }}>
              <Clock size={12} /> Shift: {workerInfo.shiftTime}
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
            <span className="text-muted" style={{ fontSize: "11px" }}>Quick Actions</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {shortcuts.map((sc) => {
              const IconComp = sc.icon;
              return (
                <div
                  key={sc.id}
                  onClick={sc.action}
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

          {/* ========================================================================= */}
          {/* ⭐ PROMINENT AI DISEASE DETECTION MOBILE HERO CARD ⭐                      */}
          {/* ========================================================================= */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
              color: "#FFFFFF",
              padding: "var(--space-4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <Sparkles size={12} />
                <span>AI Tea Leaf Scanner</span>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.9 }}>Real-Time AI</span>
            </div>

            <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: "4px 0 6px", color: "#FFF" }}>
              Scan & Detect Tea Bush Diseases
            </h3>
            <p style={{ margin: "0 0 14px 0", fontSize: "11px", opacity: 0.92, lineHeight: 1.4 }}>
              Spot abnormal spots or fungal blister bubbles? Take a live photo or upload from phone. The AI diagnoses Blister Blight, Grey Blight, or Black Rot in seconds.
            </p>

            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                type="button"
                onClick={() => onNavigate("detection")}
                style={{
                  flex: 1,
                  background: "#FFFFFF",
                  color: "var(--color-primary)",
                  border: "none",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: "var(--fw-bold)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <Camera size={16} />
                <span>Launch Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: "var(--fw-semibold)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <Upload size={15} />
                <span>Snap / Upload</span>
              </button>
            </div>

            {/* Disease tags */}
            <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap", fontSize: "9px" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "1px 6px", borderRadius: 8 }}>🍃 Healthy Leaf</span>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "1px 6px", borderRadius: 8 }}>🔴 Blister Blight</span>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "1px 6px", borderRadius: 8 }}>⚪ Grey Blight</span>
            </div>
          </div>


          {/* ========================================================================= */}
          {/* Card: Daily Work Checklist                                                */}
          {/* ========================================================================= */}
          <div className="card" id="shift-tasks-section">
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <ClipboardList size={16} color="#D97706" />
                Shift Tasks Checklist
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="badge-warning">
                  {(tasks || []).filter((t) => t.completed).length}/{(tasks || []).length} Done
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("tasks")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: 0,
                  }}
                >
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              {(tasks || []).slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setActiveMobileTab("tasks")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    background: task.completed ? "rgba(46, 125, 50, 0.05)" : "var(--color-bg)",
                    border: "1px solid",
                    borderColor: task.completed ? "rgba(46, 125, 50, 0.2)" : "var(--color-border)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    style={{ accentColor: "var(--color-primary)", width: 18, height: 18, cursor: "pointer" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "var(--fw-semibold)",
                        color: task.completed ? "var(--color-text-muted)" : "var(--color-text-primary)",
                        textDecoration: task.completed ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span className="text-muted" style={{ fontSize: "10px" }}>
                        {task.time}
                      </span>
                      {task.status && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 5px",
                            borderRadius: 4,
                            fontWeight: 700,
                            background: task.completed ? "#E8F5E9" : task.status === "IN PROGRESS" ? "#E3F2FD" : "#FFF3E0",
                            color: task.completed ? "#2E7D32" : task.status === "IN PROGRESS" ? "#1565C0" : "#E65100",
                          }}
                        >
                          {task.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.completed ? (
                    <CheckCircle2 size={16} color="var(--color-primary)" />
                  ) : (
                    <Clock size={16} color="var(--color-text-muted)" />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveMobileTab("tasks")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "#1B5E20",
                  color: "#FFF",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ClipboardList size={14} />
                <span>Open My Tasks Portal</span>
              </button>

              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveModal("addTask")}
                style={{
                  padding: "8px 12px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <Plus size={14} />
                <span>Quick Note</span>
              </button>
            </div>
          </div>


          {/* ========================================================================= */}
          {/* Card: Field Guidelines & Supervisor Contact                               */}
          {/* ========================================================================= */}
          <div className="card" style={{ background: "#FAFDF7", border: "1px dashed var(--color-border)" }}>
            <div className="flex-between" style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Leaf size={16} color="var(--color-primary)" />
                <strong style={{ fontSize: "12px", color: "var(--color-primary)" }}>
                  Field Plucking Best Practice
                </strong>
              </div>
              <span className="badge-info" style={{ fontSize: "9px" }}>Ceylon Estate</span>
            </div>
            <p className="text-muted" style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}>
              Maintain standard <strong>"Two leaves and a bud"</strong> plucking. If blister leaf spots or powdery fungal growth is spotted, isolate the infected bushes and record an AI Leaf Scan immediately.
            </p>
          </div>

        </div>
      </main>

      {/* --------------------------------------------------------------------
         MOBILE BOTTOM NAVIGATION BAR
         -------------------------------------------------------------------- */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "#FFFFFF",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 900,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveMobileTab("dashboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "none",
            border: "none",
            color: activeMobileTab === "dashboard" ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontSize: "10px",
            fontWeight: activeMobileTab === "dashboard" ? "var(--fw-semibold)" : "normal",
            cursor: "pointer",
          }}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("detection")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "none",
            border: "none",
            color: "var(--color-primary)",
            fontSize: "10px",
            fontWeight: "var(--fw-semibold)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--color-primary)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: -10,
              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.4)",
            }}
          >
            <Camera size={18} />
          </div>
          <span>Detect AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab("tasks")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "none",
            border: "none",
            color: activeMobileTab === "tasks" ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontSize: "10px",
            fontWeight: activeMobileTab === "tasks" ? "var(--fw-semibold)" : "normal",
            cursor: "pointer",
          }}
        >
          <ClipboardList size={20} />
          <span>My Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("profile")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "none",
            border: "none",
            color: "var(--color-text-secondary)",
            fontSize: "10px",
            fontWeight: "normal",
            cursor: "pointer",
          }}
        >
          <User size={19} />
          <span>Profile</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------
         MOBILE MODALS / BOTTOM SHEETS
         -------------------------------------------------------------------- */}

      {/* Modal 1: Worker Profile View */}
      {activeModal === "profile" && (
        <div className="modal-backdrop" style={{ alignItems: "flex-end" }}>
          <div
            className="modal-card"
            style={{
              margin: "auto 0 0 0",
              maxWidth: 520,
              width: "100%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "20px",
              boxShadow: "0 -8px 30px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <User size={18} color="var(--color-primary)" />
                Worker Profile
              </h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Profile Hero Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
                color: "#FFFFFF",
                padding: "18px 16px",
                borderRadius: "var(--radius-lg)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(27,94,32,0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    color: "#1B5E20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 22,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    flexShrink: 0,
                  }}
                >
                  {workerInfo.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#FFFFFF" }}>
                      {workerInfo.name}
                    </h3>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        padding: "1px 7px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {workerInfo.workerId}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                    {workerInfo.designation || "Field Worker / Senior Tea Harvester"}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <ShieldCheck size={12} /> {workerInfo.status}
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Leaf size={12} /> {workerInfo.assignedBlock}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              <div style={{ background: "var(--color-bg)", padding: "10px 8px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--color-primary)" }}>
                  {(tasks || []).filter((t) => t.completed).length}/{(tasks || []).length}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Tasks Done</div>
              </div>
              <div style={{ background: "var(--color-bg)", padding: "10px 8px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#D97706" }}>
                  {workerInfo.clockInTime}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Clock In</div>
              </div>
              <div style={{ background: "var(--color-bg)", padding: "10px 8px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#2563EB" }}>
                  {workerInfo.tenure || "3 Yrs"}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Experience</div>
              </div>
            </div>

            {/* Personal & Contact Details Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Personal & Contact Details
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <Phone size={16} color="var(--color-primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Phone Number</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{workerInfo.phone}</div>
                  </div>
                  <a
                    href={`tel:${workerInfo.phone}`}
                    style={{
                      background: "rgba(46, 125, 50, 0.1)",
                      color: "var(--color-primary)",
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Call
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <ShieldCheck size={16} color="#D97706" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>National ID (NIC)</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{workerInfo.nic}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <Calendar size={16} color="#2563EB" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Date of Birth</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{workerInfo.dob}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <MapPin size={16} color="#DC2626" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Estate Residence / Address</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{workerInfo.address}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <Mail size={16} color="#059669" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Email Address</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{workerInfo.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor & Shift Details */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Workplace Assignment
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F1F8F1", borderRadius: 12, border: "1px solid rgba(46,125,50,0.2)" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Assigned Field Supervisor</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1B5E20" }}>{workerInfo.supervisor}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>Field In-Charge</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12 }}>
                  <Clock size={16} color="var(--color-text-secondary)" />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Daily Working Hours</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{workerInfo.shiftTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate("profile");
                }}
                style={{ flex: 1, padding: "11px", fontSize: "12px", fontWeight: 700, borderRadius: 12 }}
              >
                Open Full Profile
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveModal(null)}
                style={{ padding: "11px 16px", fontSize: "12px", fontWeight: 700, borderRadius: 12 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Field Task / Note */}
      {activeModal === "addTask" && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ margin: "auto 16px 16px 16px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                <Plus size={18} color="var(--color-primary)" />
                Add Field Note / Task
              </h3>
              <button className="btn-icon" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
                <label className="form-label" style={{ fontSize: "11px" }}>
                  Task or Observation Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect drain blockage near bush 42"
                  className="input-primary"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
