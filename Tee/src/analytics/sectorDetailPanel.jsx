import React from "react";
import { X, Activity, ShieldCheck, AlertTriangle, AlertCircle, Calendar } from "lucide-react";

export default function SectorDetailPanel({ sector, onClose }) {
  if (!sector) return null;

  // Calculate health value & status details
  const health = sector.health ?? Math.min(98, Math.max(45, 65 + ((sector.id * 17) % 32)));

  let healthStatus = {
    label: "Optimal",
    color: "#2E7D32",
    bgGradient: "linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)",
    badgeClass: "badge-success",
    Icon: ShieldCheck,
  };

  if (health < 65) {
    healthStatus = {
      label: "Critical",
      color: "#E53935",
      bgGradient: "linear-gradient(90deg, #DC2626 0%, #EF4444 100%)",
      badgeClass: "badge-danger",
      Icon: AlertCircle,
    };
  } else if (health < 80) {
    healthStatus = {
      label: "Moderate",
      color: "#D97706",
      bgGradient: "linear-gradient(90deg, #D97706 0%, #F59E0B 100%)",
      badgeClass: "badge-warning",
      Icon: AlertTriangle,
    };
  }

  return (
    <div className="card-dashboard" style={{ width: "290px", flexShrink: 0, padding: "var(--space-4)" }}>
      {/* Panel Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-4)",
          paddingBottom: "var(--space-2)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h3 className="section-title" style={{ marginBottom: 0, fontSize: "var(--fs-lg)" }}>
          {sector.name}
        </h3>
        <button onClick={onClose} className="btn-icon" aria-label="Close detail panel">
          <X size={18} />
        </button>
      </div>

      {/* Sector Health Bar Section */}
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-3)",
          marginBottom: "var(--space-4)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={16} color={healthStatus.color} />
            <span style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
              Sector Health
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: healthStatus.color }}>
              {health}%
            </span>
            <span className={healthStatus.badgeClass} style={{ fontSize: "10px", padding: "2px 6px" }}>
              {healthStatus.label}
            </span>
          </div>
        </div>

        {/* Health Bar Track */}
        <div
          style={{
            width: "100%",
            height: "10px",
            backgroundColor: "#E5E7EB",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Animated Health Bar Fill */}
          <div
            style={{
              width: `${health}%`,
              height: "100%",
              background: healthStatus.bgGradient,
              borderRadius: "var(--radius-full)",
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Health Indicators Breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-2)",
            marginTop: "var(--space-3)",
            fontSize: "11px",
          }}
        >
          <div style={{ background: "#FFFFFF", padding: "6px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
            <div className="text-muted">Leaf Density</div>
            <div style={{ fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
              {Math.round(health * 0.94)}% Optimal
            </div>
          </div>
          <div style={{ background: "#FFFFFF", padding: "6px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
            <div className="text-muted">Pest Risk</div>
            <div style={{ fontWeight: "var(--fw-semibold)", color: health < 65 ? "var(--color-danger)" : health < 80 ? "var(--color-warning)" : "var(--color-primary)" }}>
              {health < 65 ? "High Risk" : health < 80 ? "Moderate" : "Low Risk"}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Details Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div className="stat-card" style={{ padding: "var(--space-3)" }}>
          <p className="label-text" style={{ fontSize: "var(--fs-xs)", marginBottom: "2px" }}>Tea Variety</p>
          <p
            className="stat-value"
            style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-primary)" }}
          >
            {sector.teaVariety}
          </p>
        </div>

        <div className="stat-card" style={{ padding: "var(--space-3)" }}>
          <p className="label-text" style={{ fontSize: "var(--fs-xs)", marginBottom: "2px" }}>Area Size</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>
            {sector.areaSize}
          </p>
        </div>

        <div className="stat-card" style={{ padding: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Calendar size={16} color="var(--color-text-muted)" />
          <div>
            <p className="label-text" style={{ fontSize: "10px", margin: 0 }}>Last Health Scan</p>
            <p style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)", margin: 0 }}>
              Today, 08:30 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}