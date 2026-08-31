import React from "react";
import { Users, HardHat, ArrowRight, Leaf, Sparkles } from "lucide-react";
import Footer from "../common components/footer.jsx";

/**
 * WelcomePage
 * Landing / role-selection page.
 * Uses styles and design tokens defined in index.css.
 *
 * Props:
 *  - onNavigate: (pageKey: string) => void
 */
export default function WelcomePage({ onNavigate = () => {} }) {
  return (
    <div className="flex-col" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── Main Hero Section with Background ── */}
      <div
        className="flex-center"
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          padding: "var(--space-10) var(--space-6)",
        }}
      >
        {/* Background Plantation Image & Overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/login-bg.png"
            alt="Tea Plantation"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(248, 250, 247, 0.7) 100%)",
              backdropFilter: "blur(2px)",
            }}
          />
        </div>

        {/* Decorative Quote */}
        <div
          style={{
            position: "absolute",
            top: "var(--space-6)",
            right: "var(--space-8)",
            zIndex: 2,
            textAlign: "right",
            maxWidth: 180,
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              fontSize: "var(--fs-sm)",
              color: "var(--color-primary)",
              lineHeight: 1.5,
              margin: 0,
              fontWeight: "var(--fw-medium)",
            }}
          >
            “Healthy Tea
            <br />
            for a Better
            <br />
            Tomorrow”
          </p>
          <div
            style={{
              marginTop: "var(--space-2)",
              height: 2,
              width: 44,
              background: "var(--color-primary)",
              marginLeft: "auto",
              borderRadius: "var(--radius-full)",
            }}
          />
        </div>

        {/* Content Container */}
        <div
          className="flex-col"
          style={{
            position: "relative",
            zIndex: 1,
            alignItems: "center",
            width: "100%",
            maxWidth: 880,
            textAlign: "center",
          }}
        >
          {/* Logo Badge */}
          <div
            className="flex-center"
            style={{
              width: 58,
              height: 58,
              borderRadius: "var(--radius-full)",
              background: "var(--color-hover-green)",
              border: "2px solid rgba(46, 125, 50, 0.28)",
              boxShadow: "0 6px 16px rgba(46, 125, 50, 0.14)",
              marginBottom: "var(--space-3)",
            }}
          >
            <Leaf size={28} color="var(--color-primary)" />
          </div>

          {/* Welcome Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "4px 14px",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(46, 125, 50, 0.2)",
              borderRadius: "var(--radius-full)",
              marginBottom: "var(--space-2)",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Sparkles size={13} color="var(--color-primary)" />
            <span
              style={{
                fontSize: "var(--fs-xs)",
                fontWeight: "var(--fw-semibold)",
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Welcome to
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="page-title"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.25rem)",
              fontWeight: "var(--fw-bold)",
              color: "var(--color-dark-green)",
              letterSpacing: "0.02em",
              marginBottom: "var(--space-2)",
              lineHeight: 1.1,
              textShadow: "0 2px 8px rgba(27, 94, 32, 0.08)",
            }}
          >
            TEE
          </h1>

          {/* System Subtitle */}
          <p
            style={{
              fontSize: "var(--fs-base)",
              color: "var(--color-text-primary)",
              fontWeight: "var(--fw-medium)",
              lineHeight: "var(--lh-normal)",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            AI-Based Tea Disease Detection and
            <br />
            Estate Management System
          </p>

          {/* Prompt / Instruction Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "6px 18px",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(46, 125, 50, 0.2)",
              borderRadius: "var(--radius-full)",
              marginTop: "var(--space-4)",
              marginBottom: "var(--space-8)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "var(--radius-full)",
                background: "var(--color-primary)",
              }}
            />
            <span
              style={{
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-medium)",
                color: "var(--color-primary)",
              }}
            >
              Choose your login type to continue
            </span>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-8)",
              width: "100%",
              maxWidth: 780,
            }}
          >
            {/* Staff Card */}
            <div
              className="glass-card hover-lift flex-col"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "var(--space-8) var(--space-6)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-card)",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                alignItems: "center",
                textAlign: "center",
                gap: "var(--space-4)",
              }}
            >
              {/* Icon Badge */}
              <div
                className="flex-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-hover-green)",
                  border: "2px solid rgba(46, 125, 50, 0.2)",
                  color: "var(--color-primary)",
                }}
              >
                <Users size={36} strokeWidth={1.75} />
              </div>

              <div>
                <h2
                  className="section-title"
                  style={{
                    fontSize: "var(--fs-xl)",
                    color: "var(--color-dark-green)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Staff Login
                </h2>
                <p
                  className="paragraph"
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "var(--lh-relaxed)",
                  }}
                >
                  Login to manage estate operations,
                  <br />
                  view reports and access all features.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "var(--space-4)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-md)",
                }}
                onClick={() => onNavigate("login")}
              >
                Login as Staff <ArrowRight size={16} />
              </button>
            </div>

            {/* Worker Card */}
            <div
              className="glass-card hover-lift flex-col"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "var(--space-8) var(--space-6)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-card)",
                border: "1px solid rgba(46, 125, 50, 0.15)",
                alignItems: "center",
                textAlign: "center",
                gap: "var(--space-4)",
              }}
            >
              {/* Icon Badge */}
              <div
                className="flex-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-hover-green)",
                  border: "2px solid rgba(46, 125, 50, 0.2)",
                  color: "var(--color-primary)",
                }}
              >
                <HardHat size={36} strokeWidth={1.75} />
              </div>

              <div>
                <h2
                  className="section-title"
                  style={{
                    fontSize: "var(--fs-xl)",
                    color: "var(--color-dark-green)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Worker Login
                </h2>
                <p
                  className="paragraph"
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "var(--lh-relaxed)",
                  }}
                >
                  Login to access your tasks, mark
                  <br />
                  attendance and use field tools.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "var(--space-4)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-secondary)",
                }}
                onClick={() => onNavigate("workerLogin")}
              >
                Login as Worker <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
