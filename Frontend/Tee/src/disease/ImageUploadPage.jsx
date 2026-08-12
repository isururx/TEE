import React from "react";
import Header from "../common components/header.jsx";
import Sidebar from "../common components/sidebar.jsx";
import Footer from "../common components/footer.jsx";
import UploadZone from "./components/UploadZone.jsx";
import { ScanLine, Info } from "lucide-react";

/**
 * ImageUploadPage
 * Page 1 of 2 — select a tea leaf image from local storage (or drag & drop),
 * preview it, then submit it for disease detection.
 *
 * All state (selected file, preview, drag state, validation error) lives in
 * the parent controller (DiseaseDetection.jsx) and is passed in as props —
 * this component only renders.
 */
export default function ImageUploadPage({
  preview,
  fileName,
  fileSize,
  isDragOver,
  error,
  fileInputRef,
  isAnalyzing,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowseClick,
  onFileInputChange,
  onRemove,
  onAnalyze,
}) {
  return (
    <div data-theme="light">
      <Header title="Disease Detection" crumbs={[{ label: "Home", href: "#" }]} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <Sidebar activeItem="detection" />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "var(--space-8)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
                <p className="text-gradient" style={{ marginBottom: "var(--space-2)" }}>
                  Disease Detection
                </p>
                <p className="paragraph" style={{ maxWidth: 480, margin: "0 auto" }}>
                  Upload a clear photo of a tea leaf to detect signs of disease and
                  get instant, AI-powered diagnosis and treatment guidance.
                </p>
              </div>

              <UploadZone
                preview={preview}
                fileName={fileName}
                fileSize={fileSize}
                isDragOver={isDragOver}
                error={error}
                fileInputRef={fileInputRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onBrowseClick={onBrowseClick}
                onFileInputChange={onFileInputChange}
                onRemove={onRemove}
              />

              {/* ---- Tips card ---- */}
              <div
                className="alert alert-info"
                style={{ marginTop: "var(--space-6)" }}
              >
                <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    For best results
                  </strong>
                  Use good lighting, keep the leaf in focus, and fill most of the
                  frame with a single leaf against a plain background.
                </div>
              </div>

              {/* ---- Submit ---- */}
              <div
                className="flex-center"
                style={{ marginTop: "var(--space-8)", flexDirection: "column", gap: "var(--space-3)" }}
              >
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!preview || isAnalyzing}
                  onClick={onAnalyze}
                  style={{ minWidth: 220, padding: "var(--space-4) var(--space-6)" }}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanLine size={18} />
                      Analyze Image
                    </>
                  )}
                </button>
                {!preview && (
                  <span className="form-helper">Select an image to enable analysis</span>
                )}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
