import React from "react";
import Header from "../common components/header.jsx";
import Sidebar from "../common components/sidebar.jsx";
import Footer from "../common components/footer.jsx";
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Leaf,
  Gauge,
  ClipboardList,
} from "lucide-react";

/**
 * DetectionResultPage
 * Page 2 of 2 — shows the outcome of the disease detection model for the
 * previously submitted image: diagnosis, confidence score, severity, and
 * recommended actions.
 *
 * `result` shape expected from the backend / mock:
 * {
 *   isHealthy: boolean,
 *   diseaseName: string,
 *   confidence: number,        // 0–100
 *   severity: "Low" | "Moderate" | "High",
 *   description: string,
 *   recommendations: string[],
 * }
 */
export default function DetectionResultPage({
  preview,
  fileName,
  result,
  onScanAnother,
  onDownloadReport,
}) {
  if (!result) return null;

  const { isHealthy, diseaseName, confidence, severity, description, recommendations } = result;

  const severityBadgeClass =
    severity === "High" ? "badge-danger" : severity === "Moderate" ? "badge-warning" : "badge-success";

  return (
    <div>
      <Header title="Detection Result" crumbs={[{ label: "Home", href: "#" }, { label: "Disease Detection", href: "#" }]} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <Sidebar activeItem="detection" />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "var(--space-8)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <p className="text-gradient" style={{ marginBottom: "var(--space-1)" }}>
                  Detection Result
                </p>
                <p className="paragraph">Here's what our model found in your image.</p>
              </div>

              <div className="grid-2" style={{ alignItems: "start" }}>
                {/* ---- Left: image ---- */}
                <div className="card" style={{ padding: "var(--space-4)" }}>
                  <div
                    style={{
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      border: "1px solid var(--color-border)",
                      aspectRatio: "1 / 1",
                      background: "var(--color-hover-green)",
                    }}
                  >
                    <img
                      src={preview}
                      alt="Analyzed tea leaf"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="text-muted" style={{ fontSize: "var(--fs-xs)", marginTop: "var(--space-3)", textAlign: "center" }}>
                    {fileName}
                  </div>
                </div>

                {/* ---- Right: prediction result ---- */}
                <div className="prediction-result">
                  <div className={`disease-status-box ${isHealthy ? "healthy" : "infected"}`}>
                    {isHealthy ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {isHealthy ? "No Disease Detected" : "Disease Detected"}
                  </div>

                  <div>
                    <div className="label-text" style={{ marginBottom: 4 }}>
                      Diagnosis
                    </div>
                    <div className="section-title" style={{ marginBottom: 0 }}>
                      {diseaseName}
                    </div>
                  </div>

                  <div>
                    <div className="flex-between" style={{ marginBottom: 6 }}>
                      <span className="label-text">Confidence</span>
                      <span className="confidence-score">{confidence}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex-center gap-sm" style={{ justifyContent: "flex-start" }}>
                    <span className="label-text" style={{ marginBottom: 0 }}>
                      Severity
                    </span>
                    <span className={severityBadgeClass}>{severity}</span>
                  </div>

                  <p className="paragraph" style={{ marginTop: "var(--space-1)" }}>
                    {description}
                  </p>
                </div>
              </div>

              {/* ---- Recommendations ---- */}
              <div className="card-prediction" style={{ marginTop: "var(--space-6)" }}>
                <div className="flex-center gap-xs" style={{ justifyContent: "flex-start", marginBottom: "var(--space-3)" }}>
                  <ClipboardList size={18} color="var(--color-primary)" />
                  <span className="section-title" style={{ marginBottom: 0 }}>
                    Recommended Actions
                  </span>
                </div>
                <div className="flex-col gap-sm">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex-center gap-sm" style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                      <Leaf size={15} color="var(--color-primary)" style={{ marginTop: 3, flexShrink: 0 }} />
                      <span className="paragraph" style={{ margin: 0 }}>
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Stat strip ---- */}
              <div className="grid-3" style={{ marginTop: "var(--space-6)" }}>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Gauge size={18} />
                  </div>
                  <span className="label-text">Model Confidence</span>
                  <span className="stat-value" style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)" }}>
                    {confidence}%
                  </span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    {isHealthy ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  </div>
                  <span className="label-text">Status</span>
                  <span className="stat-value" style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)" }}>
                    {isHealthy ? "Healthy" : "Infected"}
                  </span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Leaf size={18} />
                  </div>
                  <span className="label-text">Severity</span>
                  <span className="stat-value" style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)" }}>
                    {severity}
                  </span>
                </div>
              </div>

              {/* ---- Actions ---- */}
              <div
                className="flex-center gap-md"
                style={{ marginTop: "var(--space-8)", marginBottom: "var(--space-4)" }}
              >
                <button type="button" className="btn-primary" onClick={onScanAnother}>
                  <RotateCcw size={16} />
                  Scan Another Image
                </button>
                <button type="button" className="btn-outline" onClick={onDownloadReport}>
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
