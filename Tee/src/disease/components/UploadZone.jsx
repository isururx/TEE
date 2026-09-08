import React from "react";
import { UploadCloud, ImageIcon, X, RefreshCw } from "lucide-react";

/**
 * UploadZone
 * Presentational drag-and-drop / browse widget for the Disease Detection
 * upload page. Purely controlled — all state lives in the parent page.
 *
 * Uses theme.css classes: .upload-zone, .card-upload, .btn-primary,
 * .btn-outline, .btn-ghost, .form-error, .form-helper
 */
export default function UploadZone({
  preview,
  fileName,
  fileSize,
  isDragOver,
  error,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowseClick,
  onFileInputChange,
  onRemove,
}) {
  // ---- Preview state: an image has been selected ----
  if (preview) {
    return (
      <div className="card" style={{ padding: "var(--space-6)" }}>
        <div
          style={{
            display: "flex",
            gap: "var(--space-6)",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              flexShrink: 0,
              background: "var(--color-hover-green)",
            }}
          >
            <img
              src={preview}
              alt="Selected tea leaf"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }} className="flex-col gap-md">
            <div>
              <div className="section-title" style={{ marginBottom: 4 }}>
                Image Ready
              </div>
              <div className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>
                {fileName} {fileSize ? `· ${fileSize}` : ""}
              </div>
            </div>

            <div className="status-chip" style={{ width: "fit-content", color: "var(--color-success)" }}>
              Valid image · ready to analyze
            </div>

            <div className="flex-center gap-sm" style={{ justifyContent: "flex-start" }}>
              <button type="button" className="btn-outline" onClick={onBrowseClick}>
                <RefreshCw size={15} />
                Replace
              </button>
              <button type="button" className="btn-ghost" onClick={onRemove}>
                <X size={15} />
                Remove
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={onFileInputChange}
          style={{ display: "none" }}
        />
      </div>
    );
  }

  // ---- Empty state: drag & drop / browse ----
  return (
    <div>
      <div
        className={`upload-zone${isDragOver ? " is-dragover" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onBrowseClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onBrowseClick()}
      >
        {isDragOver ? (
          <ImageIcon className="upload-icon" />
        ) : (
          <UploadCloud className="upload-icon" />
        )}

        <h3 style={{ margin: 0 }}>
          {isDragOver ? "Drop your image here" : "Drag & drop a tea leaf image"}
        </h3>
        <p style={{ margin: 0, textAlign: "center", maxWidth: 340 }}>
          or click to browse your local storage
        </p>

        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: "var(--space-2)" }}
          onClick={(e) => {
            e.stopPropagation();
            onBrowseClick();
          }}
        >
          <UploadCloud size={16} />
          Browse Files
        </button>

        <span className="form-helper" style={{ marginTop: "var(--space-2)" }}>
          Supports JPG, PNG, WEBP · Max 10MB
        </span>
      </div>

      {error && (
        <div className="form-error" style={{ marginTop: "var(--space-3)", textAlign: "center" }}>
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={onFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
