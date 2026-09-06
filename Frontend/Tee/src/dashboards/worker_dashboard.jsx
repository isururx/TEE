import React, { useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import {
  Camera,
  CheckSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  Sparkles,
  AlertCircle,
  User,
  Check,
  ChevronRight
} from "lucide-react";

/**
 * WorkerDashboard Component (Desktop)
 * 
 * Complies strictly with the TEE RBAC Matrix for Field Workers:
 * - Direct focus on "Own Tasks" (checklist, status toggles).
 * - Instant AI Disease Detection & Treatment Recommendations scanner.
 * - View access for Assigned Block Details & Activity History.
 * - Access to User Profile & Edit Own Profile.
 * - Restricted from management, analytics, system settings, and stock actions.
 */
export default function WorkerDashboard({ onNavigate = () => {} }) {
  const [toastMessage, setToastMessage] = useState("");
  const [myTasks, setMyTasks] = useState([
    { id: "TSK-01", title: "Morning Plucking - Sector A01", time: "07:30 AM", status: "Completed", block: "Block A01" },
    { id: "TSK-02", title: "Apply Organic Fertilizer to Row 12-18", time: "11:00 AM", status: "In Progress", block: "Block A01" },
    { id: "TSK-03", title: "Leaf Blister Disease Inspection & Photo Upload", time: "02:30 PM", status: "Pending", block: "Block A01" },
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
          showToast(`Task "${t.title}" status updated to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Header
        title="Field Worker Portal"
        crumbs={[{ label: "Home", href: "#" }, { label: "My Dashboard", href: "#" }]}
        user={{ name: "Sunil Shantha", role: "Field Worker", initials: "SS" }}
        onLogout={() => onNavigate("login")}
      />

      <div style={{ minHeight: "calc(100vh - var(--topbar-height))", display: "flex", flexDirection: "column" }}>
        <main style={{ flex: 1, padding: "var(--space-6) var(--space-8)" }}>
          <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
            
            {toastMessage && (
              <div className="alert alert-success" style={{ position: "fixed", top: 80, right: 24, zIndex: "var(--z-toast)", boxShadow: "var(--shadow-modal)", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Worker Welcome Banner */}
            <div
              className="card"
              style={{
                marginBottom: "var(--space-6)",
                background: "linear-gradient(135deg, var(--color-hover-green) 0%, #E8F5E9 100%)",
                border: "1px solid var(--color-primary)",
                padding: "var(--space-5) var(--space-6)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--space-4)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Leaf size={22} color="var(--color-primary)" />
                  <h1 style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", margin: 0, color: "var(--color-dark-green)" }}>
                    Welcome, Sunil Shantha!
                  </h1>
                </div>
                <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  Assigned Block: <strong>Block A01 (Sector 4)</strong> • Shift: Morning Shift
                </p>
              </div>

              <div className="flex-center gap-sm">
                <button
                  type="button"
                  className="btn-primary hover-lift"
                  onClick={() => onNavigate("detection")}
                  style={{ padding: "var(--space-3) var(--space-5)", fontSize: "var(--fs-sm)", gap: 8 }}
                >
                  <Camera size={18} />
                  <span>Scan Leaf for AI Disease Detection</span>
                </button>
              </div>
            </div>

            {/* Main 2-Column Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)", alignItems: "start" }}>
              
              {/* Left Column: Today's Tasks Checklist */}
              <div className="card">
                <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                  <h2 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckSquare size={20} color="var(--color-primary)" />
                    My Assigned Tasks Today
                  </h2>
                  <span className="badge-info">
                    {myTasks.filter((t) => t.status === "Completed").length}/{myTasks.length} Completed
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {myTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: "var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: t.status === "Completed" ? "rgba(76, 175, 80, 0.06)" : "var(--color-bg)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "var(--space-3)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)", marginBottom: 2 }}>
                          {t.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
                          <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                          {t.time} • {t.block}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleTaskStatus(t.id)}
                        className={t.status === "Completed" ? "btn-primary" : t.status === "In Progress" ? "btn-outline" : "btn-secondary"}
                        style={{ padding: "6px 12px", fontSize: "var(--fs-xs)", minWidth: 100, justifyContent: "center" }}
                      >
                        {t.status === "Completed" ? (
                          <>
                            <Check size={14} /> Done
                          </>
                        ) : t.status === "In Progress" ? (
                          "In Progress"
                        ) : (
                          "Start Task"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Disease Scanner Launcher & Assigned Block Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                
                {/* AI Disease Scan Card */}
                <div
                  className="card hover-lift"
                  onClick={() => onNavigate("detection")}
                  style={{
                    padding: "var(--space-6)",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-primary) 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Camera size={26} color="#FFFFFF" />
                    </div>
                    <Sparkles size={20} color="#FFD54F" />
                  </div>
                  <h3 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", margin: "0 0 4px 0", color: "#FFFFFF" }}>
                    AI Leaf Disease Camera Scanner
                  </h3>
                  <p style={{ fontSize: "var(--fs-xs)", color: "rgba(255,255,255,0.85)", margin: "0 0 16px 0" }}>
                    Spot blister blight, black rot, or leaf spots? Take a photo now to get instantaneous diagnosis & treatment steps.
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-sm)" }}>
                    Open Scanner Now <ChevronRight size={16} />
                  </div>
                </div>

                {/* Assigned Block Overview */}
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: "var(--space-3)" }}>
                    <h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <MapPin size={18} color="var(--color-primary)" />
                      My Assigned Block Info
                    </h3>
                    <span className="badge-success">Block A01</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--fs-xs)" }}>
                    <div className="flex-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                      <span className="text-muted">Crop Type</span>
                      <strong>TRI 2025 High-Yield Clone</strong>
                    </div>
                    <div className="flex-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                      <span className="text-muted">Soil Health</span>
                      <strong style={{ color: "var(--color-primary)" }}>Optimal Moisture (74%)</strong>
                    </div>
                    <div className="flex-between" style={{ padding: "8px 0" }}>
                      <span className="text-muted">Supervisor</span>
                      <strong>Kamal Perera</strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
