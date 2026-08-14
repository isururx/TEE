import React, { useRef, useState, useCallback } from "react";
import ImageUploadPage from "./ImageUploadPage.jsx";
import DetectionResultPage from "./DetectionResultPage.jsx";

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Point this at the FastAPI backend's prediction endpoint.
const DETECTION_API_URL =
  "http://localhost:8000/api/detection/detect";

function formatBytes(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

/**
 * DiseaseDetection
 * Controller component: owns all state and switches between the two
 * screens — ImageUploadPage (select from local storage / drag & drop)
 * and DetectionResultPage (model output).
 */
export default function DiseaseDetection() {
  const fileInputRef = useRef(null);

  const [stage, setStage] = useState("upload"); // "upload" | "result"
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const validateAndSetFile = useCallback((candidate) => {
    if (!candidate) return;

    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (candidate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setError("");
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  }, []);

  // ---- Upload page handlers ----
  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e) => {
    const candidate = e.target.files?.[0];
    validateAndSetFile(candidate);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const candidate = e.dataTransfer.files?.[0];
    validateAndSetFile(candidate);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  // ---- Submit for analysis ----
  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError("");

    try {
      const detection = await runDetection(file);
      setResult(detection);
      setStage("result");
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---- Result page handlers ----
  const handleScanAnother = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setStage("upload");
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = [
      "TEE — Disease Detection Report",
      `File: ${file?.name ?? "n/a"}`,
      `Status: ${result.isHealthy ? "Healthy" : "Infected"}`,
      `Diagnosis: ${result.diseaseName}`,
      `Confidence: ${result.confidence}%`,
      `Severity: ${result.severity}`,
      "",
      "Recommended actions:",
      ...result.recommendations.map((r) => `- ${r}`),
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detection-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (stage === "result") {
    return (
      <DetectionResultPage
        preview={preview}
        fileName={file?.name}
        result={result}
        onScanAnother={handleScanAnother}
        onDownloadReport={handleDownloadReport}
      />
    );
  }

  return (
    <ImageUploadPage
      preview={preview}
      fileName={file?.name}
      fileSize={file ? formatBytes(file.size) : ""}
      isDragOver={isDragOver}
      error={error}
      fileInputRef={fileInputRef}
      isAnalyzing={isAnalyzing}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onBrowseClick={handleBrowseClick}
      onFileInputChange={handleFileInputChange}
      onRemove={handleRemove}
      onAnalyze={handleAnalyze}
    />
  );
}

/**
 * runDetection
 * Sends the image to the FastAPI backend's CNN model and returns the
 * parsed result. Falls back to a mock response if the backend isn't
 * reachable yet — remove the catch/mock once DETECTION_API_URL is live,
 * or shape the mapping below to match your actual API response.
 */
async function runDetection(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(DETECTION_API_URL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();
    // Adjust this mapping to match the FastAPI response schema.
    return {
      isHealthy: data.is_healthy,
      diseaseName: data.disease_name,
      confidence: Math.round(data.confidence * 100) / 1,
      severity: data.severity,
      description: data.description,
      recommendations: data.recommendations ?? [],
    };
  } catch (err) {
    // ---- Mock fallback so the UI is demoable without the backend ----
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const isHealthy = Math.random() > 0.5;
    return isHealthy
      ? {
        isHealthy: true,
        diseaseName: "Healthy Leaf",
        confidence: 96,
        severity: "Low",
        description:
          "No visible signs of disease. Leaf color, texture, and vein pattern are within normal range.",
        recommendations: [
          "Continue routine monitoring during the next inspection cycle.",
          "Maintain current fertilization and irrigation schedule.",
        ],
      }
      : {
        isHealthy: false,
        diseaseName: "Blister Blight",
        confidence: 89,
        severity: "Moderate",
        description:
          "Translucent, blister-like spots detected consistent with blister blight, common in high-humidity conditions.",
        recommendations: [
          "Isolate and prune affected shoots to limit spread.",
          "Apply a copper-based fungicide as per estate protocol.",
          "Improve field drainage and canopy airflow to reduce humidity.",
          "Re-scan the block in 7 days to track progression.",
        ],
      };
  }
}
