import React, { useState, useEffect } from "react";
import {
  Camera,
  CheckSquare,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";

/**
 * WorkerDashboard Component (Mobile Dashboard)
 * 
 * Mobile-first dashboard for Field Workers.
 * Restricts access strictly to:
 *  1. Disease Detection (AI Scanner)
 *  2. View Assigned Tasks (with status updates & task detail bottom-sheet)
 * 
 * Designed without a sidebar for a touch-first mobile experience.
 */
export default function WorkerDashboard({ onNavigate = () => {} }) {
  const [activeFilter, setActiveFilter] = useState("ALL"); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [selectedTask, setSelectedTask] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Read worker profile from localStorage or fallback
  const [workerInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          name: parsed.name || parsed.username || "Sunil Shantha",
          role: parsed.role || "Field Worker",
          block: parsed.assigned_block ? `Block ${parsed.assigned_block}` : "Block A01",
          initials: (parsed.name || parsed.username || "Sunil Shantha")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        };
      }
    } catch {
      // fallback
    }
    return {
      name: "Sunil Shantha",
      role: "Field Worker",
      block: "Block A01",
      initials: "SS",
    };
  });

  // Assigned Tasks State
  const [tasks, setTasks] = useState([
    {
      id: "TSK-101",
      title: "Morning Leaf Plucking (Two Leaves & A Bud)",
      description: "Harvest mature flush from bushes in Sector 2. Inspect plucking table height.",
      block: "Block A01 - Sector 2",
      priority: "HIGH",
      time: "07:00 AM - 11:30 AM",
      status: "IN_PROGRESS",
    },
    {
      id: "TSK-102",
      title: "Leaf Blight Spot Inspection & Leaf Sweep",
      description: "Walk rows 12-25. Use AI scanner if blister blight spots or curling is spotted.",
      block: "Block A01 - South Ridge",
      priority: "HIGH",
      time: "12:00 PM - 01:30 PM",
      status: "PENDING",
    },
    {
      id: "TSK-103",
      title: "Drainage Channel Clearing & Weeding",
      description: "Clear debris and dry leaf buildup from runoff waterways before evening rains.",
      block: "Block A01 - Waterway #3",
      priority: "MEDIUM",
      time: "02:00 PM - 04:30 PM",
      status: "PENDING",
    },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === "PENDING"
              ? "IN_PROGRESS"
              : t.status === "IN_PROGRESS"
              ? "COMPLETED"
              : "PENDING";
          showToast(`Task updated to ${nextStatus.replace("_", " ")}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({
        ...prev,
        status:
          prev.status === "PENDING"
            ? "IN_PROGRESS"
            : prev.status === "IN_PROGRESS"
            ? "COMPLETED"
            : "PENDING",
      }));
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "COMPLETED") return t.status === "COMPLETED";
    if (activeFilter === "PENDING") return t.status !== "COMPLETED";
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status !== "COMPLETED").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div
      style={{
        background: "var(--color-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Centered Mobile Viewport Wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          minHeight: "100vh",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: "0 0 24px rgba(0, 0, 0, 0.08)",
          paddingBottom: "80px", // Space for bottom navigation
        }}
      >
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className="alert alert-success"
            style={{
              position: "fixed",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 32px)",
              maxWidth: "460px",
              zIndex: "var(--z-toast)",
              boxShadow: "var(--shadow-modal)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "var(--fs-xs)",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* -------------------------------------------------------------
            1. MOBILE TOP APP BAR
           ------------------------------------------------------------- */}
        <header
          style={{
            padding: "var(--space-4) var(--space-4) var(--space-3)",
            background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
            color: "#FFFFFF",
            borderBottomLeftRadius: "var(--radius-xl)",
            borderBottomRightRadius: "var(--radius-xl)",
            boxShadow: "0 4px 16px rgba(27, 94, 32, 0.2)",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "var(--fw-bold)",
                  fontSize: "var(--fs-base)",
                }}
              >
                {workerInfo.initials}
              </div>
              <div>
                <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  TEE Field Worker
                </div>
                <h1 style={{ fontSize: "var(--fs-base)", fontWeight: "var(--fw-bold)", margin: 0 }}>
                  {workerInfo.name}
                </h1>
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={() => onNavigate("login")}
              title="Log Out"
              aria-label="Log Out"
              style={{
                background: "rgba(255, 255, 255, 0.18)",
                border: "none",
                borderRadius: "var(--radius-full)",
                color: "#FFFFFF",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background var(--transition-fast)",
              }}
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Quick Shift Status Strip */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(8px)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-2) var(--space-3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} /> {workerInfo.block}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={13} />
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* -------------------------------------------------------------
            2. MAIN CONTENT SCROLL AREA
           ------------------------------------------------------------- */}
        <div style={{ padding: "var(--space-4)", flex: 1 }}>

          {/* AI DISEASE DETECTION CARD (Primary Feature) */}
          <div
            className="hover-lift"
            onClick={() => onNavigate("detection")}
            style={{
              marginBottom: "var(--space-4)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 50%, #FFF3E0 100%)",
              border: "1.5px solid #FFE082",
              boxShadow: "var(--shadow-card)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  background: "linear-gradient(135deg, #FF6F00 0%, #E65100 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  flexShrink: 0,
                  boxShadow: "0 4px 10px rgba(230, 81, 0, 0.25)",
                }}
              >
                <Camera size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontSize: "var(--fs-sm)",
                      fontWeight: "var(--fw-bold)",
                      color: "#E65100",
                    }}
                  >
                    Disease Detection
                  </span>
                  <Sparkles size={14} color="#FF8F00" />
                </div>
                <p style={{ fontSize: "var(--fs-xs)", color: "#5D4037", margin: "2px 0 var(--space-3)", lineHeight: 1.3 }}>
                  Inspect tea leaves with the AI camera scanner to detect Blister Blight or Spot diseases.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#E65100",
                    color: "#FFFFFF",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "11px",
                    fontWeight: "var(--fw-semibold)",
                    boxShadow: "0 2px 6px rgba(230, 81, 0, 0.25)",
                  }}
                >
                  <Camera size={13} /> Open Camera Scanner
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNED TASKS SECTION */}
          <div>
            <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
              <div>
                <h2 style={{ fontSize: "var(--fs-base)", fontWeight: "var(--fw-bold)", margin: 0, color: "var(--color-text-primary)" }}>
                  Assigned Tasks
                </h2>
                <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                  {pendingCount} pending &bull; {completedCount} completed
                </span>
              </div>

              {/* Status Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "var(--color-hover-green)",
                  borderRadius: "var(--radius-full)",
                  padding: "2px",
                }}
              >
                <button
                  onClick={() => setActiveFilter("ALL")}
                  style={{
                    border: "none",
                    background: activeFilter === "ALL" ? "#FFFFFF" : "transparent",
                    color: activeFilter === "ALL" ? "var(--color-primary)" : "var(--color-text-secondary)",
                    fontWeight: activeFilter === "ALL" ? 700 : 500,
                    borderRadius: "var(--radius-full)",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    boxShadow: activeFilter === "ALL" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setActiveFilter("PENDING")}
                  style={{
                    border: "none",
                    background: activeFilter === "PENDING" ? "#FFFFFF" : "transparent",
                    color: activeFilter === "PENDING" ? "var(--color-primary)" : "var(--color-text-secondary)",
                    fontWeight: activeFilter === "PENDING" ? 700 : 500,
                    borderRadius: "var(--radius-full)",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    boxShadow: activeFilter === "PENDING" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  Active ({pendingCount})
                </button>
                <button
                  onClick={() => setActiveFilter("COMPLETED")}
                  style={{
                    border: "none",
                    background: activeFilter === "COMPLETED" ? "#FFFFFF" : "transparent",
                    color: activeFilter === "COMPLETED" ? "var(--color-primary)" : "var(--color-text-secondary)",
                    fontWeight: activeFilter === "COMPLETED" ? 700 : 500,
                    borderRadius: "var(--radius-full)",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    boxShadow: activeFilter === "COMPLETED" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  Done ({completedCount})
                </button>
              </div>
            </div>

            {/* Task List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {filteredTasks.map((task) => {
                const isDone = task.status === "COMPLETED";
                const isInProgress = task.status === "IN_PROGRESS";

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      borderLeft: `4px solid ${
                        isDone ? "#2E7D32" : isInProgress ? "#FF9800" : "var(--color-border)"
                      }`,
                      background: isDone ? "#FAFCFA" : "#FFFFFF",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          className={
                            task.priority === "HIGH"
                              ? "badge badge-danger"
                              : "badge badge-warning"
                          }
                          style={{ fontSize: "10px", padding: "2px 6px" }}
                        >
                          {task.priority}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                          {task.id}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={isDone ? "btn-secondary" : isInProgress ? "btn-primary" : "btn-secondary"}
                        style={{
                          fontSize: "11px",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          cursor: "pointer",
                        }}
                      >
                        {isDone ? (
                          <span style={{ color: "#2E7D32", display: "flex", alignItems: "center", gap: 3 }}>
                            <CheckCircle2 size={12} /> Done
                          </span>
                        ) : isInProgress ? (
                          "In Progress"
                        ) : (
                          "Start"
                        )}
                      </button>
                    </div>

                    <div
                      onClick={() => setSelectedTask(task)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "var(--fw-semibold)",
                          fontSize: "var(--fs-sm)",
                          color: "var(--color-text-primary)",
                          textDecoration: isDone ? "line-through" : "none",
                          opacity: isDone ? 0.75 : 1,
                          marginBottom: 4,
                        }}
                      >
                        {task.title}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "11px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} /> {task.time}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--color-primary)" }}>
                          Details <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div
                  className="card"
                  style={{
                    padding: "var(--space-6)",
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--fs-xs)",
                  }}
                >
                  <CheckSquare size={32} style={{ margin: "0 auto var(--space-2)", opacity: 0.4 }} />
                  <div>No tasks under "{activeFilter.toLowerCase()}" filter.</div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* -------------------------------------------------------------
            3. MOBILE BOTTOM NAVIGATION BAR
           ------------------------------------------------------------- */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "500px",
            background: "#FFFFFF",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "8px 0",
            zIndex: "var(--z-sticky)",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Tasks Tab */}
          <button
            onClick={() => setActiveFilter("ALL")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: "var(--color-primary)",
              cursor: "pointer",
              padding: "4px 16px",
            }}
          >
            <CheckSquare size={20} />
            <span style={{ fontSize: "10px", fontWeight: 700 }}>My Tasks</span>
          </button>

          {/* Disease Detection Quick Scan (Floating center action) */}
          <button
            onClick={() => onNavigate("detection")}
            style={{
              background: "linear-gradient(135deg, #FF6F00 0%, #E65100 100%)",
              border: "none",
              color: "#FFFFFF",
              width: 48,
              height: 48,
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(230, 81, 0, 0.35)",
              transform: "translateY(-10px)",
            }}
            title="Scan Leaf for Diseases"
            aria-label="Disease Scanner"
          >
            <Camera size={24} />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => onNavigate("login")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              padding: "4px 16px",
            }}
          >
            <LogOut size={20} />
            <span style={{ fontSize: "10px", fontWeight: 600 }}>Log Out</span>
          </button>
        </nav>

        {/* -------------------------------------------------------------
            4. TASK DETAIL BOTTOM-SHEET MODAL
           ------------------------------------------------------------- */}
        {selectedTask && (
          <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 440,
                width: "92%",
                margin: "auto",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <div className="modal-header">
                <div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                    Task ID: {selectedTask.id}
                  </div>
                  <h3 style={{ margin: 0, fontSize: "var(--fs-base)", fontWeight: "var(--fw-bold)" }}>
                    {selectedTask.title}
                  </h3>
                </div>
                <button className="btn-icon" onClick={() => setSelectedTask(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: "var(--space-4) 0", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <span className="form-label" style={{ display: "block", marginBottom: 2 }}>
                    Instructions / Description
                  </span>
                  <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
                    {selectedTask.description}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <div>
                    <span className="form-label" style={{ display: "block", marginBottom: 2 }}>
                      Assigned Area
                    </span>
                    <span style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-medium)" }}>
                      {selectedTask.block}
                    </span>
                  </div>
                  <div>
                    <span className="form-label" style={{ display: "block", marginBottom: 2 }}>
                      Time Window
                    </span>
                    <span style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-medium)" }}>
                      {selectedTask.time}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="form-label" style={{ display: "block", marginBottom: 2 }}>
                    Priority & Status
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      className={
                        selectedTask.priority === "HIGH"
                          ? "badge badge-danger"
                          : "badge badge-warning"
                      }
                      style={{ fontSize: "10px" }}
                    >
                      {selectedTask.priority}
                    </span>
                    <span
                      className={
                        selectedTask.status === "COMPLETED"
                          ? "badge badge-success"
                          : "badge badge-info"
                      }
                      style={{ fontSize: "10px" }}
                    >
                      {selectedTask.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    handleToggleTask(selectedTask.id);
                  }}
                >
                  {selectedTask.status === "COMPLETED"
                    ? "Mark Incomplete"
                    : selectedTask.status === "IN_PROGRESS"
                    ? "Mark Complete"
                    : "Start Task"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
