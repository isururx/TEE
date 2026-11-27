import { useEffect, useMemo, useState } from "react";
import Header from "../common components/header.jsx";
import RoleSidebar, { getStoredRole } from "../common components/sidebars/RoleSidebar.jsx";
import Footer from "../common components/footer.jsx";
import {
  getDiseaseFrequencyByBlock,
  getDiseaseDistribution,
  getPlantationBlocks,
} from "../services/analyticsApi.js";
import "./diseaseAnalytics.css";

const DAY_MS = 24 * 60 * 60 * 1000;
const COLORS = ["#2e7d32", "#81a96b", "#d6a84f", "#7b9bb8", "#9b83b5", "#d17c63"];

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initialDates() {
  const today = new Date();
  return {
    startDate: toDateInput(new Date(today.getTime() - 29 * DAY_MS)),
    endDate: toDateInput(today),
  };
}

function formatNumber(value) {
  return value === "—" ? "—" : new Intl.NumberFormat().format(Number(value) || 0);
}

function KpiCard({ label, value, description }) {
  return (
    <article className="disease-analytics-kpi">
      <div className="disease-analytics-kpi-label">{label}</div>
      <div className="disease-analytics-kpi-value">{formatNumber(value)}</div>
      {description && <div className="disease-analytics-muted">{description}</div>}
    </article>
  );
}

function LoadingPanel() {
  return (
    <div className="disease-analytics-panel" aria-label="Loading disease analytics" aria-busy="true">
      <div className="disease-analytics-skeleton" style={{ width: "42%" }} />
      <div className="disease-analytics-skeleton" style={{ width: "78%" }} />
      <div className="disease-analytics-skeleton" style={{ width: "64%" }} />
      <div className="disease-analytics-skeleton" style={{ width: "88%" }} />
    </div>
  );
}

function DistributionChart({ items, total }) {
  const safeItems = items.filter((item) => item.frequency > 0);
  const sum = safeItems.reduce((value, item) => value + item.frequency, 0);
  const segments = safeItems.reduce((result, item, index) => {
    const end = result.cursor + (item.frequency / (sum || 1)) * 100;
    return {
      cursor: end,
      values: [...result.values, `${COLORS[index % COLORS.length]} ${result.cursor}% ${end}%`],
    };
  }, { cursor: 0, values: [] }).values;
  const background = segments.length
    ? `conic-gradient(${segments.join(", ")})`
    : "var(--color-border)";

  if (!total || !safeItems.length) {
    return <div className="disease-analytics-state">No disease detections are available for this period.</div>;
  }

  return (
    <div className="disease-analytics-donut-wrap">
      <div className="disease-analytics-donut" style={{ background }} role="img" aria-label="Disease distribution chart">
        <div className="disease-analytics-donut-hole">
          <strong style={{ fontSize: 25 }}>{formatNumber(total)}</strong>
          <span className="disease-analytics-muted">Diseased</span>
        </div>
      </div>
      <div className="disease-analytics-legend">
        {safeItems.map((item, index) => (
          <div className="disease-analytics-legend-item" key={item.disease_id ?? item.disease_name}>
            <span className="disease-analytics-dot" style={{ background: COLORS[index % COLORS.length] }} />
            <span>{item.disease_name}</span>
            <strong style={{ marginLeft: "auto", color: "var(--color-text-primary)" }}>{formatNumber(item.frequency)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockFrequencyChart({ blocks }) {
  const sorted = [...blocks].sort((a, b) => b.total_detections - a.total_detections);
  const maximum = Math.max(1, ...sorted.map((block) => block.total_detections));

  if (!sorted.length) {
    return <div className="disease-analytics-state">No plantation block records are available.</div>;
  }

  return (
    <div className="disease-analytics-bars">
      {sorted.map((block) => (
        <div key={block.block_id}>
          <div className="disease-analytics-bar-row">
            <span className="disease-analytics-bar-label" title={block.block_name}>{block.block_name}</span>
            <div className="disease-analytics-track" title={`${block.total_detections} detection events`}>
              <div className="disease-analytics-fill" style={{ width: `${(block.total_detections / maximum) * 100}%` }} />
            </div>
            <span className="disease-analytics-count">{formatNumber(block.total_detections)}</span>
          </div>
          {block.diseases?.length > 0 && (
            <div className="disease-analytics-muted" style={{ margin: "5px 0 0 130px" }}>
              {block.diseases.map((disease) => `${disease.disease_name}: ${formatNumber(disease.frequency)}`).join(" · ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


function BlockComparison({ blocks }) {
  const sorted = [...blocks].sort((a, b) => b.total_detections - a.total_detections);
  if (!sorted.length) {
    return <div className="disease-analytics-state">No block comparison data is available for the selected period.</div>;
  }

  return (
    <div style={{ overflowX: "auto", marginTop: 16 }}>
      <table className="disease-analytics-table">
        <thead>
          <tr><th>Plantation block</th><th>Total detections</th><th>Most detected disease</th><th>Frequency</th></tr>
        </thead>
        <tbody>
          {sorted.map((block) => {
            const topDisease = [...(block.diseases ?? [])].sort((a, b) => b.frequency - a.frequency)[0];
            return (
              <tr key={block.block_id}>
                <td>{block.block_name}</td>
                <td>{formatNumber(block.total_detections)}</td>
                <td>{topDisease?.disease_name ?? "No disease records"}</td>
                <td>{topDisease ? formatNumber(topDisease.frequency) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function StateAnalytics({ onNavigate = () => {} }) {
  const [dates, setDates] = useState(initialDates);
  const [appliedDates, setAppliedDates] = useState(initialDates);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ blockId: "", diseaseId: "" });
  const [plantationBlocks, setPlantationBlocks] = useState([]);
  const [frequencyData, setFrequencyData] = useState(null);
  const [distributionData, setDistributionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const role = getStoredRole();
  const isSupervisor = role.includes("supervisor");


  useEffect(() => {
    let active = true;
    getPlantationBlocks()
      .then((records) => {
        if (!active) return;
        const userId = localStorage.getItem("user_id");
        const visibleBlocks = isSupervisor
          ? records.filter((block) => String(block.supervisor_id) === String(userId))
          : records;
        setPlantationBlocks(visibleBlocks);
        if (isSupervisor && visibleBlocks.length === 1) {
          const onlyBlockId = String(visibleBlocks[0].id);
          setSelectedBlock(onlyBlockId);
          setAppliedFilters((current) => ({ ...current, blockId: onlyBlockId }));
        }
      })
      .catch(() => {
        if (active) setPlantationBlocks([]);
      });
    return () => { active = false; };
  }, [isSupervisor]);

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      // Yield before updating loading state to avoid a synchronous state update
      // during the effect's initial execution.
      await Promise.resolve();
      if (!active) return;

      if (isSupervisor && !appliedFilters.blockId) {
        setLoading(false);
        setError("");
        setFrequencyData(null);
        setDistributionData(null);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const filters = {
          start_date: appliedDates.startDate,
          end_date: appliedDates.endDate,
          ...(appliedFilters.blockId ? { block_id: appliedFilters.blockId } : {}),
          ...(appliedFilters.diseaseId ? { disease_id: appliedFilters.diseaseId } : {}),
        };
        const [frequency, distribution] = await Promise.all([
          getDiseaseFrequencyByBlock(filters),
          getDiseaseDistribution(filters),
        ]);
        if (!active) return;
        setFrequencyData(frequency);
        setDistributionData(distribution);
      } catch (requestError) {
        if (!active) return;
        setFrequencyData(null);
        setDistributionData(null);
        setError(requestError.message || "Unable to load disease analytics.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      active = false;
    };
  }, [appliedDates, appliedFilters, reloadKey, isSupervisor]);

  const blocks = frequencyData?.blocks ?? [];
  const diseaseOptions = useMemo(() => {
    const byId = new Map();
    (distributionData?.disease_distribution ?? []).forEach((item) => {
      const key = item.disease_id ?? item.disease_name;
      byId.set(key, item);
    });
    return [...byId.values()];
  }, [distributionData]);

  const summary = frequencyData?.summary;
  const affectedBlocks = blocks.filter((block) => block.total_detections > 0).length;
  const selectedBlockName = plantationBlocks.find((block) => String(block.id) === appliedFilters.blockId)?.id;

  const applyFilters = (event) => {
    event.preventDefault();
    if (isSupervisor && !selectedBlock) {
      setError("Please select one of your authorised plantation blocks.");
      return;
    }
    if (dates.startDate && dates.endDate && dates.startDate > dates.endDate) {
      setError("Start date must be on or before end date.");
      return;
    }
    setAppliedDates(dates);
    setAppliedFilters({ blockId: selectedBlock, diseaseId: selectedDisease });
  };

  const clearFilters = () => {
    const defaults = initialDates();
    if (isSupervisor && plantationBlocks.length === 1) {
      const onlyBlockId = String(plantationBlocks[0].id);
      setSelectedBlock(onlyBlockId);
      setAppliedFilters({ blockId: onlyBlockId, diseaseId: "" });
      setSelectedDisease("");
      setDates(defaults);
      setAppliedDates(defaults);
      return;
    }
    setDates(defaults);
    setAppliedDates(defaults);
    setSelectedBlock("");
    setSelectedDisease("");
    setAppliedFilters({ blockId: "", diseaseId: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
        <RoleSidebar activeItem="analytics" onNavigate={onNavigate} />
        <main className="p-card disease-analytics-page" style={{ flex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <h1 className="page-title" style={{ fontSize: "var(--fs-3xl)", marginBottom: 5 }}>Disease Analytics</h1>
            <p className="disease-analytics-muted">Understand recorded tea leaf disease detection events across plantation blocks.</p>
          </div>

          <form className="disease-analytics-toolbar" onSubmit={applyFilters}>
            <div className="disease-analytics-field">
              <label htmlFor="disease-start-date">Start date</label>
              <input id="disease-start-date" type="date" value={dates.startDate} max={dates.endDate || undefined} onChange={(event) => setDates((current) => ({ ...current, startDate: event.target.value }))} />
            </div>
            <div className="disease-analytics-field">
              <label htmlFor="disease-end-date">End date</label>
              <input id="disease-end-date" type="date" value={dates.endDate} min={dates.startDate || undefined} max={toDateInput(new Date())} onChange={(event) => setDates((current) => ({ ...current, endDate: event.target.value }))} />
            </div>
            <div className="disease-analytics-field">
              <label htmlFor="disease-block-filter">Plantation block</label>
              <select id="disease-block-filter" value={selectedBlock} onChange={(event) => setSelectedBlock(event.target.value)}>
                <option value="">All available blocks</option>
                {plantationBlocks.map((block) => <option key={block.id} value={block.id}>Block {block.id}</option>)}
              </select>
            </div>
            <div className="disease-analytics-field">
              <label htmlFor="disease-type-filter">Disease type</label>
              <select id="disease-type-filter" value={selectedDisease} onChange={(event) => setSelectedDisease(event.target.value)}>
                <option value="">All diseases</option>
                {diseaseOptions.map((disease) => (
                  <option key={disease.disease_id ?? disease.disease_name} value={disease.disease_id ?? ""}>{disease.disease_name}</option>
                ))}
              </select>
            </div>
            <button className="disease-analytics-button" type="submit">Apply filters</button>
            <button className="disease-analytics-button secondary" type="button" onClick={clearFilters}>Clear</button>
          </form>

          {error && (
            <div className="disease-analytics-alert" role="alert">
              {error}
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} style={{ marginLeft: 12, border: 0, background: "transparent", color: "inherit", fontWeight: 700, cursor: "pointer" }}>Retry</button>
            </div>
          )}

          {isSupervisor && !appliedFilters.blockId && !loading && (
            <div className="disease-analytics-alert" role="status">
              Supervisors must select an authorised plantation block before viewing analytics. If no blocks are listed, contact your estate manager.
            </div>
          )}

          <section className="disease-analytics-kpis" aria-label="Disease detection summary">
            <KpiCard label="Total detections" value={summary?.total_detections ?? "—"} description="Recorded detection events" />
            <KpiCard label="Diseased detections" value={summary?.diseased_detections ?? "—"} description="Disease classifications" />
            <KpiCard label="Healthy detections" value={summary?.healthy_detections ?? "—"} description="Healthy leaf results" />
            <KpiCard label="Affected blocks" value={loading ? "—" : affectedBlocks} description="Blocks with detections in this period" />
          </section>

          {loading ? (
            <div className="disease-analytics-grid"><LoadingPanel /><LoadingPanel /></div>
          ) : error ? null : (
            <>
              <section className="disease-analytics-grid">
                <article className="disease-analytics-panel">
                  <h2>Disease frequency by block</h2>
                  <p className="disease-analytics-muted">Number of recorded detection events per plantation block</p>
                  <BlockFrequencyChart blocks={blocks} />
                </article>
                <article className="disease-analytics-panel">
                  <h2>Overall disease distribution</h2>
                  <p className="disease-analytics-muted">Share of diseased detection events by disease type</p>
                  <DistributionChart items={distributionData?.disease_distribution ?? []} total={distributionData?.diseased_detections ?? 0} />
                </article>
              </section>

              <section className="disease-analytics-panel" style={{ marginBottom: 18 }}>
                <h2>Block comparison</h2>
                <p className="disease-analytics-muted">Compare total recorded events and the most frequently detected disease in each block{selectedBlockName ? ` · Filtered to Block ${selectedBlockName}` : ""}</p>
                <BlockComparison blocks={blocks} />
              </section>

              <section className="disease-analytics-panel">
                <h2>Most detected diseases</h2>
                <p className="disease-analytics-muted">Disease frequency is the number of recorded detection events, not confirmed infected plants.</p>
                {(distributionData?.disease_distribution ?? []).length === 0 ? (
                  <div className="disease-analytics-state" style={{ marginTop: 16 }}>No disease detections were recorded for the selected filters and dates.</div>
                ) : (
                  <div className="disease-analytics-disease-list">
                    {[...(distributionData?.disease_distribution ?? [])].sort((a, b) => b.frequency - a.frequency).map((disease) => (
                      <div className="disease-analytics-disease-row" key={disease.disease_id ?? disease.disease_name}>
                        <span>{disease.disease_name}</span>
                        <strong>{formatNumber(disease.frequency)} detections</strong>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
          <p className="disease-analytics-muted" style={{ marginTop: 16 }}>
            Reporting period: {appliedDates.startDate} to {appliedDates.endDate}. Unassigned detections are counted in the summary and are not attributed to a plantation block.
          </p>
        </main>
      </div>
      <Footer />
    </div>
  );
}
