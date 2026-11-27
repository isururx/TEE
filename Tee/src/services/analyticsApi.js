const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

async function analyticsRequest(endpoint, filters) {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Your login session is missing. Please log in again to view disease analytics.");
  }

  const query = buildQuery(filters);
  const response = await fetch(`${API_BASE_URL}/api/analytics/${endpoint}${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data.detail === "string"
      ? data.detail
      : response.status === 401
        ? "Your session has expired. Please log in again."
        : response.status === 403
          ? "Your account is not authorised to view this analytics data."
          : "Unable to load disease analytics. Please try again.";
    throw new Error(message);
  }
  return data;
}

export function getDiseaseFrequencyByBlock(filters) {
  return analyticsRequest("disease-frequency-by-block", filters);
}

export function getDiseaseDistribution(filters) {
  return analyticsRequest("disease-distribution", filters);
}

export function getBlockDiseaseSummary(filters) {
  return analyticsRequest("block-disease-summary", filters);
}

export async function getPlantationBlocks() {
  const response = await fetch(`${API_BASE_URL}/api/blocks`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Unable to load plantation blocks.");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
