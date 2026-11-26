import React from "react";
import { Leaf } from "lucide-react";

/**
 * Footer
 * Reusable footer for the TEE app, matching the wireframe's bottom bar
 * (logo + system name on the left, link list on the right).
 *
 * Props:
 *  - links: array of { label, href }
 *  - year: shown in the copyright line (defaults to current year)
 */
export default function Footer({
  links = [
    { label: "Home", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Terms", href: "#" },
  ],
  year = new Date().getFullYear(),
}) {
  return (
    <footer
      className="flex-between"
      
      style={{
        padding: "var(--space-5) var(--space-6)",
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-card)",
        flexWrap: "wrap",
        gap: "var(--space-4)",
      }}
    >
      <div className="flex-center gap-xs">
        <Leaf size={18} color="var(--color-primary)" />
        <div>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
            TEE
          </div>
          <div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
            TEE AI-Based Tea Disease Detection and Estate Management System
          </div>
        </div>
      </div>

      <nav className="flex-center gap-md">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="text-muted" style={{ fontSize: "var(--fs-xs)", width: "100%", textAlign: "center" }}>
        © {year} TEE — Mini Project Group. All rights reserved.
      </div>
    </footer>
  );
}
