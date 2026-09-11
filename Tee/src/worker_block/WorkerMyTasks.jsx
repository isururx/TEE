import React, { useState, useEffect, useMemo } from "react";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Play, 
  Check, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  User, 
  Leaf, 
  Camera, 
  LogOut,
  X,
  Flame,
  FileText
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

export default function WorkerMyTasks({ onNavigate = () => {} }) {
  const [worker, setWorker] = useState({ id: 1, name: "Field Worker", assigned_block: null });
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, QUEUED, IN PROGRESS, FINISHED
  
  // Complete modal state
  const [completingTask, setCompletingTask] = useState(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load worker session or default worker
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("tee-worker") || sessionStorage.getItem("tee-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setWorker({
          id: parsed.id || parsed.user_id || 1,
          name: parsed.name || "Field Worker",
          assigned_block: parsed.assigned_block || parsed.block_id || null
        });
      }
    } catch (e) {
      console.error("Error reading stored worker session", e);
    }
  }, []);

  // Fetch tasks for current worker
  const loadTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const workerId = worker.id || 1;
      const res = await fetch(`${API_BASE}/workers/${workerId}/tasks`);
      if (!res.ok) throw new Error("Could not load assigned tasks.");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (worker.id) {
      loadTasks();
    }
  }, [worker.id]);

  // Status transition handler: Start Task
  const handleStartTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/workers/${worker.id}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN PROGRESS" })
      });
      if (!res.ok) throw new Error("Failed to start task.");
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updated, status: "IN PROGRESS" } : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // Status transition handler: Complete Task with Notes
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completingTask) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/workers/${worker.id}/tasks/${completingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "FINISHED",
          completion_notes: completionNotes.trim() || "Completed in field."
        })
      });
      if (!res.ok) throw new Error("Failed to complete task.");
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === completingTask.id ? { ...t, ...updated, status: "FINISHED" } : t)));
      setCompletingTask(null);
      setCompletionNotes("");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === "IN PROGRESS").length;
    const queued = tasks.filter((t) => t.status === "QUEUED" || t.status === "PENDING").length;
    const finished = tasks.filter((t) => t.status === "FINISHED" || t.status === "COMPLETED").length;
    return { total, inProgress, queued, finished };
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    if (activeTab === "ALL") return tasks;
    if (activeTab === "QUEUED") return tasks.filter((t) => t.status === "QUEUED" || t.status === "PENDING");
    if (activeTab === "IN PROGRESS") return tasks.filter((t) => t.status === "IN PROGRESS");
    if (activeTab === "FINISHED") return tasks.filter((t) => t.status === "FINISHED" || t.status === "COMPLETED");
    return tasks;
  }, [tasks, activeTab]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#F4F7F4", display: "flex", flexDirection: "column", position: "relative", paddingBottom: 80, fontFamily: "inherit" }}>
      {/* ---- Mobile Header ---- */}
      <header style={{ background: "#1B5E20", color: "#FFFFFF", padding: "18px 20px 24px", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, boxShadow: "0 4px 16px rgba(27,94,32,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#FFFFFF", color: "#1B5E20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16 }}>
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{worker.name}</h2>
              <span style={{ fontSize: 12, opacity: 0.85 }}>Worker #{worker.id} {worker.assigned_block ? `• Block ${worker.assigned_block}` : ""}</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={loadTasks} 
            title="Refresh tasks"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Quick KPI Badges */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "10px 8px", borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{metrics.queued}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>To Do</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", padding: "10px 8px", borderRadius: 14, textAlign: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{metrics.inProgress}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>In Progress</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "10px 8px", borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{metrics.finished}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Done</div>
          </div>
        </div>
      </header>

      {/* ---- Filter Tabs ---- */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 8px", overflowX: "auto" }}>
        {[
          { key: "ALL", label: `All (${metrics.total})` },
          { key: "IN PROGRESS", label: `In Progress (${metrics.inProgress})` },
          { key: "QUEUED", label: `To Do (${metrics.queued})` },
          { key: "FINISHED", label: `Done (${metrics.finished})` }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              background: activeTab === tab.key ? "#1B5E20" : "#E8EFE8",
              color: activeTab === tab.key ? "#FFFFFF" : "#2E7D32"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- MT-09: Task Card List ---- */}
      <main style={{ flex: 1, padding: "8px 20px 20px" }}>
        {error && (
          <div style={{ padding: 12, background: "#FFEBEE", color: "#C62828", borderRadius: 12, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
            <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
            <p style={{ fontSize: 13 }}>Loading your assignments...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#777", background: "#fff", borderRadius: 18, border: "1px solid #E0E0E0", marginTop: 8 }}>
            <ClipboardList size={36} color="#A5D6A7" style={{ marginBottom: 10 }} />
            <h4 style={{ margin: 0, fontSize: 15, color: "#333" }}>No tasks in this category</h4>
            <p style={{ margin: "4px 0 0", fontSize: 12 }}>Check other tabs or ask supervisor for new assignments.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredTasks.map((t) => {
              const isCrit = t.priority === "CRITICAL";
              const isHigh = t.priority === "HIGH";
              const isProg = t.status === "IN PROGRESS";
              const isDone = t.status === "FINISHED" || t.status === "COMPLETED";

              // Priority style mapping
              let pBg = "#E8F5E9";
              let pColor = "#2E7D32";
              if (isCrit) {
                pBg = "#FFEBEE";
                pColor = "#C62828";
              } else if (isHigh) {
                pBg = "#FFF3E0";
                pColor = "#E65100";
              } else if (t.priority === "MEDIUM") {
                pBg = "#FFF8E1";
                pColor = "#F57F17";
              }

              // Status style mapping
              let sBg = "#F5F5F5";
              let sColor = "#616161";
              if (isDone) {
                sBg = "#E8F5E9";
                sColor = "#2E7D32";
              } else if (isProg) {
                sBg = "#E3F2FD";
                sColor = "#1565C0";
              } else if (t.status === "QUEUED" || t.status === "PENDING") {
                sBg = "#E0F2F1";
                sColor = "#00695C";
              }

              return (
                <div 
                  key={t.id} 
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 18,
                    padding: 16,
                    border: isCrit ? "1.5px solid #FFCDD2" : "1px solid #E8EFE8",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Left priority indicator strip */}
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: isCrit ? "#D32F2F" : isHigh ? "#F57C00" : "#388E3C" }} />

                  {/* Top row: Priority Pill & Status Tag */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 4 }}>
                    <span 
                      style={{
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        background: pBg,
                        color: pColor,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      {isCrit && <Flame size={12} color="#C62828" />}
                      {t.priority}
                    </span>

                    <span 
                      style={{
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: 10,
                        fontWeight: 700,
                        background: sBg,
                        color: sColor,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      {isProg && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1565C0", display: "inline-block" }} />}
                      {t.status}
                    </span>
                  </div>

                  {/* Task Description & ID */}
                  <div style={{ paddingLeft: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 2 }}>TASK #{t.id}</div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1F2937", lineHeight: 1.4 }}>
                      {t.description}
                    </h3>
                  </div>

                  {/* Metadata: Block Name & Deadline */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#555", paddingLeft: 4, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#F1F8F1", padding: "4px 8px", borderRadius: 8 }}>
                      <Leaf size={14} color="#2E7D32" />
                      <span style={{ fontWeight: 600, color: "#2E7D32" }}>{t.plantation_block || `Block ${t.plantation_block_id}`}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#FFF8E1", padding: "4px 8px", borderRadius: 8 }}>
                      <Clock size={14} color="#E65100" />
                      <span style={{ fontWeight: 600, color: "#E65100" }}>Due: {t.deadline || "--"}</span>
                    </div>
                  </div>

                  {/* Completion Notes display box */}
                  {isDone && t.completion_notes && (
                    <div style={{ background: "#F1F8E9", padding: "10px 12px", borderRadius: 12, fontSize: 12, color: "#33691E", borderLeft: "3px solid #689F38", marginLeft: 4 }}>
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                        <FileText size={12} /> Completion Notes:
                      </div>
                      <div>{t.completion_notes}</div>
                    </div>
                  )}

                  {/* Action Button Section */}
                  <div style={{ marginTop: 2, paddingTop: 10, borderTop: "1px solid #F0F0F0", paddingLeft: 4 }}>
                    {t.status === "QUEUED" && (
                      <button
                        type="button"
                        onClick={() => handleStartTask(t.id)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "#1B5E20",
                          color: "#fff",
                          border: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(27,94,32,0.25)"
                        }}
                      >
                        <Play size={15} fill="#fff" /> START TASK
                      </button>
                    )}

                    {isProg && (
                      <button
                        type="button"
                        onClick={() => { setCompletingTask(t); setCompletionNotes(""); }}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "#0288D1",
                          color: "#fff",
                          border: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(2,136,209,0.25)"
                        }}
                      >
                        <Check size={16} /> COMPLETE TASK
                      </button>
                    )}

                    {isDone && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#2E7D32", fontWeight: 700, fontSize: 12, padding: "4px 0" }}>
                        <CheckCircle2 size={16} /> Completed {t.completed_at ? `(${t.completed_at})` : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ---- Complete Task Modal ---- */}
      {completingTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: 480, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "24px 20px", boxShadow: "0 -6px 24px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#111" }}>Complete Task</h3>
                <span style={{ fontSize: 12, color: "#666" }}>Task #{completingTask.id} • {completingTask.description}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setCompletingTask(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#333", marginBottom: 6 }}>
                  Completion Observations / Field Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Treated 4 rows of tea bushes, zero leaf scorch observed, 5L fungicide used."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "1.5px solid #C8E6C9",
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setCompletingTask(null)}
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid #ccc", background: "#f5f5f5", color: "#333", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: "#1B5E20", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Completion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Mobile Bottom Navigation Bar ---- */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: 64, background: "#FFFFFF", borderTop: "1px solid #E0E0E0", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
        <button
          type="button"
          onClick={() => {}}
          style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#1B5E20", cursor: "pointer", fontWeight: 700, fontSize: 11 }}
        >
          <ClipboardList size={20} color="#1B5E20" />
          <span>My Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("detection")}
          style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#666", cursor: "pointer", fontWeight: 500, fontSize: 11 }}
        >
          <Camera size={20} color="#666" />
          <span>Scan Leaf</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("login")}
          style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#C62828", cursor: "pointer", fontWeight: 500, fontSize: 11 }}
        >
          <LogOut size={20} color="#C62828" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
