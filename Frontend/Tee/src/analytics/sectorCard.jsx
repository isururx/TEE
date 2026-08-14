import React from "react";

export default function SectorCard({ name, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card hover-lift"
      style={{
        height: "112px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "var(--fw-bold)",
        fontSize: "var(--fs-lg)",
        cursor: "pointer",
        width: "100%",
        // Inline overrides for the selected state — kept inline (rather than
        // relying on a class like .nav-active) because .card is declared
        // later in index.css than component classes like .nav-active, so a
        // class-only override could lose the cascade. Inline style always wins.
        backgroundColor: selected ? "var(--color-primary)" : undefined,
        borderColor: selected ? "var(--color-primary)" : undefined,
        color: selected ? "var(--color-text-inverse)" : "var(--color-text-primary)",
      }}
    >
      {name}
    </button>
  );
}