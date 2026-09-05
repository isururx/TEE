import React, { useState } from "react";
import {
  Camera,
  CheckSquare,
  CheckCircle2,
  Clock,
  Home,
  User,
  Check,
  Leaf
} from "lucide-react";

/**
 * WorkerDashboardMobile Component
 * Touch-optimized mobile portal for field workers in tea plantations.
 */
export default function WorkerDashboardMobile({ onNavigate = () => {} }) {
  const [toastMessage, setToastMessage] = useState("");
  const [myTasks, setMyTasks] = useState([
    { id: "TSK-01", title: "Morning Plucking - Sector A01", time: "07:30 AM", status: "Completed" },
    { id: "TSK-02", title: "Apply Organic Fertilizer to Row 12", time: "11:00 AM", status: "In Progress" },
    { id: "TSK-03", title: "Leaf Blister Inspection & Photo Upload", time: "02:30 PM", status: "Pending" },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleTaskStatus = (taskId) => {
    setMyTasks(
      myTasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "Pending" ? "In Progress" : t.status === "In Progress" ? "Completed" : "Pending";
          showToast(`Task status: ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingBottom: "70px" }}>
      <main style={{ padding: "var(--space-4)" }}>
        {toastMessage && (
          <div className="alert alert-success" style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 1000, fontSize: "12px" }}>
            <CheckCircle2 size={16} /> <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="card" style={{ background: "linear-gradient(135deg, var(--color-hover-green) 0%, #E8F5E9 100%)", border: "1px solid var(--color-primary)", marginBottom: "var(--space-4)", padding: "var(--space-4)" }}>
          <div className="flex-between" style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Leaf size={18} color="var(--color-primary)" />
              <h1 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0 }}>
                Sunil Shantha
              </h1>
            </div>
            <span className="badge-success" style={{ fontSize: "9px" }}>Worker</span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: 0 }}>Assigned: Block A01</p>
        </div>

        {/* AI Camera Scanner Quick Button */}
        <button
          type="button"
          className="btn-primary"
          onClick={() => onNavigate("detection")}
          style={{ width: "100%", padding: "var(--space-4)", justifyContent: "center", borderRadius: "var(--radius-lg)", marginBottom: "var(--space-4)", gap: 10, fontSize: "var(--fs-sm)" }}
        >
          <Camera size={22} /> <span>Scan Leaf with AI Scanner</span>
        </button>

        {/* Tasks List */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "var(--fw-bold)", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckSquare size={16} color="var(--color-primary)" /> Today's Checklist
            </h3>
            <span className="badge-info" style={{ fontSize: "9px" }}>
              {myTasks.filter((t) => t.status === "Completed").length}/{myTasks.length} Done
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {myTasks.map((t) => (
              <div key={t.id} style={{ padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: t.status === "Completed" ? "rgba(76, 175, 80, 0.08)" : "var(--color-bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "var(--fw-bold)" }}>{t.title}</div>
                  <div className="text-muted" style={{ fontSize: "10px" }}><Clock size={10} style={{ display: "inline" }} /> {t.time}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTaskStatus(t.id)}
                  className={t.status === "Completed" ? "btn-primary" : t.status === "In Progress" ? "btn-outline" : "btn-secondary"}
                  style={{ padding: "4px 8px", fontSize: "10px" }}
                >
                  {t.status === "Completed" ? <Check size={12} /> : t.status === "In Progress" ? "Progress" : "Start"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#FFF", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 900 }}>
        <button type="button" onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Home size={20} /> <span>My Tasks</span>
        </button>
        <button type="button" onClick={() => onNavigate("detection")} style={{ background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Camera size={20} /> <span>Scan Leaf</span>
        </button>
        <button type="button" onClick={() => onNavigate("profile")} style={{ background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <User size={20} /> <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
