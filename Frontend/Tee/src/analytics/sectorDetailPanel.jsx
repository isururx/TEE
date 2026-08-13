import React from "react";
import { X } from "lucide-react";

export default function SectorDetailPanel({ sector, onClose }) {
  if (!sector) return null;

  return (
    <div className="card-dashboard" style={{ width: "264px", flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          {sector.name}
        </h3>
        <button onClick={onClose} className="btn-icon">
          <X size={18} />
        </button>
      </div>

      <div className="grid-2 gap-sm">
        <div className="stat-card" style={{ padding: "var(--space-3)" }}>
          <p className="label-text">Tea Variety</p>
          <p
            className="stat-value"
            style={{ fontSize: "var(--fs-md)", color: "var(--color-primary)" }}
          >
            {sector.teaVariety}
          </p>
        </div>
        <div className="stat-card" style={{ padding: "var(--space-3)" }}>
          <p className="label-text">Area Size</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-md)" }}>
            {sector.areaSize}
          </p>
        </div>
      </div>
    </div>
  );
}