import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Build a compact page list: 1 2 3 ... last
  const pages = [];
  const visible = [1, 2, 3, totalPages];
  for (const p of visible) {
    if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p);
  }
  pages.sort((a, b) => a - b);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
      <span className="subtitle">
        Showing {start}-{end} of {totalItems} Blocks
      </span>

      <div className="pagination">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="pagination-item"
          disabled={currentPage === 1}
          style={{
            opacity: currentPage === 1 ? 0.35 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => (
          <React.Fragment key={p}>
            {idx > 0 && p - pages[idx - 1] > 1 && (
              <span className="text-muted" style={{ padding: "0 var(--space-1)" }}>
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`pagination-item ${p === currentPage ? "active" : ""}`}
            >
              {p}
            </button>
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="pagination-item"
          disabled={currentPage === totalPages}
          style={{
            opacity: currentPage === totalPages ? 0.35 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
