import React, { useEffect, useMemo, useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import { Clock3, Edit3, Plus, RotateCcw, Trash2, UserCheck, Calendar, MapPin, X } from "lucide-react";
import BlockFormModal from "./block_form_modal.jsx";

const teaVarieties = [
	"Camellia sinensis var. assamica",
	"TRI 2025",
	"B.O.P. Hybrid",
	"High Yield Clonal",
	"UPASI-9",
	"TV-1",
];

const BLOCKS_API_URL = "http://localhost:8000/api/blocks";
const USERS_API_URL = "http://localhost:8000/api/users";

const fallbackBlock = {
	id: "1",
	area: 12.4,
	totalHarvest: "0 kg",
	lastHarvestDate: "--",
	lastMonthHarvest: "0 kg",
	variety: "Assamica Gold",
	plantDate: "2018-05-10",
	yearPlanted: 2018,
	supervisorId: null,
	supervisorName: "Unassigned",
};

const defaultHistory = [
	{ date: "Sep 28, 2023", teaVariety: "Assamica Gold", quantity: "1,420.5", efficiency: "94.2%", status: "VERIFIED" },
	{ date: "Sep 14, 2023", teaVariety: "Assamica Gold", quantity: "1,280.0", efficiency: "88.5%", status: "VERIFIED" },
	{ date: "Aug 30, 2023", teaVariety: "Assamica Gold", quantity: "910.2", efficiency: "62.1%", status: "FLAGGED" },
	{ date: "Aug 15, 2023", teaVariety: "Assamica Gold", quantity: "1,550.8", efficiency: "97.8%", status: "VERIFIED" },
	{ date: "Aug 12, 2023", teaVariety: "Assamica Gold", quantity: "1,420.5", efficiency: "91.4%", status: "VERIFIED" },
];

const defaultActivityLog = [
	{ title: "Soil Testing", meta: "Oct 24, 14:20  Operator: R.Chen" },
	{ title: "Irrigation Scheduled", meta: "Oct 22, 06:00  Automated System" },
	{ title: "Pesticide Application", meta: "Oct 19, 09:15  Operator: K.Patel" },
	{ title: "Pruning", meta: "Oct 15, 11:45  Team Beta (12 members)" },
];

const emptyHarvestForm = {
	date: new Date().toISOString().slice(0, 10),
	teaVariety: "",
	quantityKg: "",
	efficiencyPct: "",
	status: "VERIFIED",
};

function safeParseBlock() {
	if (typeof sessionStorage === "undefined") {
		return fallbackBlock;
	}

	try {
		const raw = sessionStorage.getItem("tee-selected-block");
		if (!raw) {
			return fallbackBlock;
		}

		return { ...fallbackBlock, ...JSON.parse(raw) };
	} catch {
		return fallbackBlock;
	}
}

function BlockBadge({ text }) {
	const isVerified = text === "VERIFIED" || text === "Stable" || text === "Healthy";
	const badgeClass = isVerified ? "badge-success" : text === "FLAGGED" || text === "Disease Detected" ? "badge-warning" : "badge-info";

	return (
		<span className={badgeClass}>
			{text}
		</span>
	);
}

function formatKg(value) {
	const numeric = Number(value);
	return Number.isNaN(numeric) ? value : `${numeric.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`;
}

function normalizeBlock(block) {
	return {
		...block,
		id: block.id ?? block.block_id,
		area: block.area ?? block.area_ha ?? 0,
		totalHarvest: formatKg(block.totalHarvest ?? block.total_harvest_kg ?? 0),
		lastHarvestDate: block.lastHarvestDate ?? block.last_harvest_date ?? "--",
		lastMonthHarvest: formatKg(block.lastMonthHarvest ?? block.last_month_harvest_kg ?? 0),
		variety: block.variety ?? block.tea_variety ?? "--",
		plantDate: block.plantDate ?? block.plant_date ?? (block.year_planted ? `${block.year_planted}-01-01` : "--"),
		yearPlanted: block.yearPlanted ?? (block.plant_date ? new Date(block.plant_date).getFullYear() : block.year_planted ?? new Date().getFullYear()),
		supervisorId: block.supervisorId ?? block.supervisor_id ?? null,
		supervisorName: block.supervisorName ?? block.supervisor_name ?? block.supervisor?.name ?? (block.supervisor_id ? `Supervisor #${block.supervisor_id}` : "Unassigned"),
		healthStatus: block.healthStatus ?? block.health_status ?? "Healthy",
	};
}

function normalizeHarvestEntry(entry, fallbackVariety) {
	const efficiencyValue = entry.efficiency ?? entry.efficiency_pct;
	const quantityValue = entry.quantity ?? entry.quantity_kg;

	return {
		...entry,
		id: entry.id,
		date: entry.date ?? "--",
		teaVariety: entry.teaVariety ?? entry.tea_variety ?? fallbackVariety ?? "--",
		quantity: quantityValue === null || quantityValue === undefined || quantityValue === "" ? "--" : quantityValue,
		efficiency: efficiencyValue === null || efficiencyValue === undefined || efficiencyValue === "" ? "--" : efficiencyValue,
		status: entry.status ?? "--",
	};
}

export default function BlockDetail({ onNavigate = () => {} }) {
	const [block, setBlock] = useState(() => normalizeBlock(safeParseBlock()));
	const [supervisors, setSupervisors] = useState([]);
	const [history, setHistory] = useState([]);
	const [activityLog, setActivityLog] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [modalMode, setModalMode] = useState(null);
	const [harvestFormData, setHarvestFormData] = useState(() => ({ ...emptyHarvestForm, teaVariety: block.variety ?? teaVarieties[0] }));
	const [harvestError, setHarvestError] = useState("");
	const [isHarvestSubmitting, setIsHarvestSubmitting] = useState(false);
	const [deleteHarvestId, setDeleteHarvestId] = useState(null); // record id pending delete
	const [isDeletingHarvest, setIsDeletingHarvest] = useState(false);

	const [formData, setFormData] = useState({
		id: String(block.id),
		area: String(block.area),
		variety: block.variety,
		plantDate: block.plantDate !== "--" ? block.plantDate : new Date().toISOString().slice(0, 10),
		supervisorId: block.supervisorId ? String(block.supervisorId) : "",
	});

	// Load supervisors
	useEffect(() => {
		async function loadSupervisors() {
			try {
				const response = await fetch(`${USERS_API_URL}?role=Supervisor`);
				if (response.ok) {
					const data = await response.json();
					const list = Array.isArray(data) ? data : data.users ?? data.items ?? [];
					setSupervisors(list);
				}
			} catch {
				// Non-blocking fallback
			}
		}
		loadSupervisors();
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const blockId = encodeURIComponent(block.id);

		async function loadBlockDetails() {
			setIsLoading(true);
			setError("");
			try {
				const [blockResponse, historyResponse, activityResponse] = await Promise.all([
					fetch(`${BLOCKS_API_URL}/${blockId}`, { signal: controller.signal }),
					fetch(`${BLOCKS_API_URL}/${blockId}/harvest-history`, { signal: controller.signal }),
					fetch(`${BLOCKS_API_URL}/${blockId}/activities`, { signal: controller.signal }),
				]);

				if (!blockResponse.ok) throw new Error("Unable to load block details.");
				const blockData = await blockResponse.json();
				const historyData = historyResponse.ok ? await historyResponse.json() : [];
				const activityData = activityResponse.ok ? await activityResponse.json() : [];

				const nextBlock = normalizeBlock({ ...block, ...blockData });
				setBlock(nextBlock);
				sessionStorage.setItem("tee-selected-block", JSON.stringify(nextBlock));
				setHistory((Array.isArray(historyData) ? historyData : historyData.items ?? historyData.records ?? []).map((entry) => normalizeHarvestEntry(entry, block.variety)));
				setActivityLog(Array.isArray(activityData) ? activityData : activityData.items ?? activityData.records ?? []);
			} catch (loadError) {
				if (loadError.name !== "AbortError") {
					setError(loadError.message);
					setHistory(defaultHistory);
					setActivityLog(defaultActivityLog);
				}
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		}

		loadBlockDetails();
		return () => controller.abort();
	}, [block.id]);

	const openEditModal = () => {
		setFormData({
			id: String(block.id),
			area: String(block.area),
			variety: block.variety,
			plantDate: block.plantDate !== "--" ? block.plantDate : new Date().toISOString().slice(0, 10),
			supervisorId: block.supervisorId ? String(block.supervisorId) : "",
		});
		setModalMode("edit");
	};

	const openHarvestModal = () => {
		setHarvestError("");
		setHarvestFormData({ ...emptyHarvestForm, teaVariety: block.variety ?? teaVarieties[0] });
		setModalMode("harvest");
	};

	const closeModal = () => {
		setModalMode(null);
		setHarvestError("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const blockPayload = {
			area: Number.parseFloat(formData.area) || 0,
			tea_variety: formData.variety,
			plant_date: formData.plantDate || null,
			supervisor_id: formData.supervisorId ? Number(formData.supervisorId) : null,
		};

		try {
			const response = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(block.id)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(blockPayload),
			});
			if (!response.ok) throw new Error("Unable to save the block.");
			const savedBlock = normalizeBlock(await response.json());
			setBlock(savedBlock);
			sessionStorage.setItem("tee-selected-block", JSON.stringify(savedBlock));
			setModalMode(null);
		} catch (submitError) {
			setError(submitError.message);
		}
	};

	const handleHarvestSubmit = async (event) => {
		event.preventDefault();
		const quantity = Number.parseFloat(harvestFormData.quantityKg);
		const efficiency = Number.parseFloat(harvestFormData.efficiencyPct);

		if (!harvestFormData.date || Number.isNaN(quantity) || quantity <= 0) {
			setHarvestError("Harvest date and a positive quantity are required.");
			return;
		}

		if (harvestFormData.efficiencyPct !== "" && (Number.isNaN(efficiency) || efficiency < 0 || efficiency > 100)) {
			setHarvestError("Efficiency must be between 0 and 100.");
			return;
		}

		setIsHarvestSubmitting(true);
		setHarvestError("");
		try {
			const response = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(block.id)}/harvest-history`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date: harvestFormData.date,
					tea_variety: harvestFormData.teaVariety || block.variety || null,
					quantity_kg: quantity,
					efficiency_pct: harvestFormData.efficiencyPct === "" ? null : efficiency,
					status: harvestFormData.status,
				}),
			});
			if (!response.ok) throw new Error("Unable to save the harvest entry.");
			const savedRecord = normalizeHarvestEntry(await response.json(), harvestFormData.teaVariety || block.variety);
			setHistory((current) => [savedRecord, ...current.filter((entry) => entry.id !== savedRecord.id)]);

			// Refresh block totals (which are dynamically calculated by the backend)
			const blockResponse = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(block.id)}`);
			if (blockResponse.ok) {
				const refreshedBlock = normalizeBlock(await blockResponse.json());
				setBlock(refreshedBlock);
				sessionStorage.setItem("tee-selected-block", JSON.stringify(refreshedBlock));
			}
			setModalMode(null);
		} catch (submitError) {
			setHarvestError(submitError.message);
		} finally {
			setIsHarvestSubmitting(false);
		}
	};

	const handleHarvestDelete = async () => {
		if (!deleteHarvestId) return;
		setIsDeletingHarvest(true);
		try {
			const response = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(block.id)}/harvest-history/${deleteHarvestId}`, {
				method: "DELETE",
			});
			if (!response.ok && response.status !== 204) throw new Error("Unable to delete harvest record.");
			setHistory((current) => current.filter((entry) => entry.id !== deleteHarvestId));
			setDeleteHarvestId(null);

			// Refresh block totals
			const blockResponse = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(block.id)}`);
			if (blockResponse.ok) {
				const refreshedBlock = normalizeBlock(await blockResponse.json());
				setBlock(refreshedBlock);
				sessionStorage.setItem("tee-selected-block", JSON.stringify(refreshedBlock));
			}
		} catch (deleteError) {
			setError(deleteError.message);
		} finally {
			setIsDeletingHarvest(false);
		}
	};


	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>

			<Header title={`Block Detail: Block ${block.id}`} crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }, { label: "Workers & Blocks", href: "#" }]} />
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<RoleSidebar activeItem="BlockManagement" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					<section className="card" style={{ padding: "var(--space-6)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
							<div>
								<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)" }}>Block Detail: Block {block.id}</h1>
								<p className="text-muted" style={{ marginTop: "var(--space-2)" }}>Overview, supervisor assignment, harvesting history, and operational status for the selected block.</p>
							</div>
							<button type="button" className="btn-secondary" onClick={openEditModal}>
								<Edit3 size={16} />
								<span>Edit Block Details</span>
							</button>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Block ID</div>
								<div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-primary)", marginTop: "var(--space-1)" }}>Block {block.id}</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Supervisor</div>
								<div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "6px" }}>
									<UserCheck size={18} color="var(--color-primary)" />
									{block.supervisorName}
								</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Variety</div>
								<div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", marginTop: "var(--space-1)" }}>{block.variety}</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Area</div>
								<div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", marginTop: "var(--space-1)" }}>{Number(block.area).toFixed(1)} Ha</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Last Harvest</div>
								<div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", marginTop: "var(--space-1)" }}>{block.lastHarvestDate}</div>
							</div>
						</div>
					</section>

					<section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 1fr)", gap: "var(--space-6)" }}>
						<div className="card" style={{ padding: "var(--space-5)" }}>
							{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}
							<div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
								<div>
									<h2 className="section-title" style={{ marginBottom: 0 }}>Current Health Status</h2>
									<p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Real-time monitoring & AI detection summary</p>
								</div>
								<BlockBadge text={block.healthStatus || "Healthy"} />
							</div>
							<div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
								<div style={{ flex: 1 }}>
									<div className="progress-bar" style={{ height: 10 }}>
										<div className="progress-bar-fill" style={{ width: "85%" }} />
									</div>
								</div>
								<div className="badge-info">Active Monitoring</div>
							</div>
							<div style={{ marginTop: "var(--space-4)" }} className="alert alert-info">
								<RotateCcw size={18} />
								<div>
									<div style={{ fontWeight: "var(--fw-semibold)" }}>Block health is verified and up to date.</div>
									<div className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Calculated harvest outputs and inspection logs are dynamically synced with the database.</div>
								</div>
							</div>
						</div>

						<div className="card" style={{ padding: "var(--space-5)" }}>
							<div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
								<div>
									<h2 className="section-title" style={{ marginBottom: 0 }}>Activity Log</h2>
									<p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Recent field operations</p>
								</div>
								<Clock3 size={18} color="var(--color-primary)" />
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
								{isLoading && <div className="text-muted">Loading activity...</div>}
								{!isLoading && activityLog.length === 0 && <div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>No recent activity logs recorded.</div>}
								{!isLoading && activityLog.map((item, idx) => (
									<div key={item.id ?? idx} className="card" style={{ padding: "var(--space-3)", boxShadow: "none" }}>
										<div style={{ fontWeight: "var(--fw-semibold)" }}>{item.title ?? item.name ?? "Activity"}</div>
										<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
											{item.timestamp ? new Date(item.timestamp).toLocaleString() : item.meta ?? "--"} {item.operator ? `• Operator: ${item.operator}` : ""}
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)" }}>
						<div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
							<div>
								<h2 className="section-title" style={{ marginBottom: 0 }}>Harvest History</h2>
								<p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Harvest cycles recorded for Block {block.id} (Total: {block.totalHarvest})</p>
							</div>
							<button type="button" className="btn-primary" onClick={openHarvestModal}>
								<Plus size={16} />
								<span>New Harvest Entry</span>
							</button>
						</div>
						<div className="table-responsive">
							<table className="table-modern">
								<thead>
									<tr>
									{["Date", "Tea Variety", "Quantity (kg)", "Efficiency (%)", "Status", ""].map((heading) => (
										<th key={heading}>{heading}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{isLoading ? <tr><td colSpan={6} style={{ textAlign: "center" }}>Loading harvest history...</td></tr> : history.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center" }}>No harvest entries yet.</td></tr> : history.map((entry) => (
									<tr key={entry.id ?? `${entry.date}-${entry.quantity}`} className="hover-row">
										<td>{entry.date}</td>
										<td>{entry.teaVariety}</td>
										<td>{entry.quantity}</td>
										<td>{entry.efficiency ? `${entry.efficiency}%` : "--"}</td>
										<td><BlockBadge text={entry.status} /></td>
										<td>
											{entry.id && (
												<button
													type="button"
													title="Delete harvest record"
													onClick={() => setDeleteHarvestId(entry.id)}
													style={{ background: "none", border: "1px solid #FFCDD2", borderRadius: "var(--radius-sm)", padding: "3px 8px", cursor: "pointer", color: "#C62828", fontSize: "var(--fs-xs)", display: "inline-flex", alignItems: "center", gap: 4 }}
												>
													<Trash2 size={12} /> Delete
												</button>
											)}
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)" }}>
						<div className="grid-auto-fit" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
							<div>
								<div className="label-text">Block ID</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>Block {block.id}</div>
							</div>
							<div>
								<div className="label-text">Assigned Supervisor</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)", color: "var(--color-primary)" }}>{block.supervisorName}</div>
							</div>
							<div>
								<div className="label-text">Tea Variety</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.variety}</div>
							</div>
							<div>
								<div className="label-text">Total Cultivated Area</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{Number(block.area).toFixed(1)} Ha</div>
							</div>
							<div>
								<div className="label-text">Planting Date</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.plantDate}</div>
							</div>
						</div>
					</section>
				</main>
			</div>
			<Footer />

			{modalMode === "edit" && (
				<BlockFormModal
					mode={modalMode}
					formData={formData}
					setFormData={setFormData}
					onClose={closeModal}
					onSubmit={handleSubmit}
					teaVarieties={teaVarieties}
					supervisors={supervisors}
				/>
			)}
			{modalMode === "harvest" && (
				<div className="modal-backdrop">
					<div className="modal-card">
						{harvestError && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{harvestError}</div>}
						<div className="modal-header">
							<h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0 }}>New Harvest Entry</h3>
							<button type="button" className="btn-icon" onClick={closeModal}>
								<X size={18} />
							</button>
						</div>

						<form onSubmit={handleHarvestSubmit}>
							<div className="form-group">
								<label className="form-label">Harvest Date</label>
								<input
									className="input-primary"
									type="date"
									value={harvestFormData.date}
									onChange={(e) => setHarvestFormData((current) => ({ ...current, date: e.target.value }))}
									required
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Tea Variety</label>
								<select
									className="input-primary"
									value={harvestFormData.teaVariety}
									onChange={(e) => setHarvestFormData((current) => ({ ...current, teaVariety: e.target.value }))}
								>
									{teaVarieties.map((variety) => (
										<option key={variety} value={variety}>
											{variety}
										</option>
									))}
								</select>
							</div>

							<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-3)" }}>
								<div className="form-group">
									<label className="form-label">Quantity (kg)</label>
									<input
										className="input-primary"
										type="number"
										step="0.1"
										min="0.1"
										value={harvestFormData.quantityKg}
										onChange={(e) => setHarvestFormData((current) => ({ ...current, quantityKg: e.target.value }))}
										required
									/>
								</div>

								<div className="form-group">
									<label className="form-label">Efficiency (%)</label>
									<input
										className="input-primary"
										type="number"
										step="0.1"
										min="0"
										max="100"
										value={harvestFormData.efficiencyPct}
										onChange={(e) => setHarvestFormData((current) => ({ ...current, efficiencyPct: e.target.value }))}
									/>
								</div>
							</div>

							<div className="form-group">
								<label className="form-label">Status</label>
								<select
									className="input-primary"
									value={harvestFormData.status}
									onChange={(e) => setHarvestFormData((current) => ({ ...current, status: e.target.value }))}
								>
									<option value="VERIFIED">VERIFIED</option>
									<option value="FLAGGED">FLAGGED</option>
								</select>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn-secondary" onClick={closeModal}>
									Cancel
								</button>
								<button type="submit" className="btn-primary" disabled={isHarvestSubmitting}>
									{isHarvestSubmitting ? "Saving..." : "Add Harvest"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Harvest Delete Confirmation Modal */}
			{deleteHarvestId && (
				<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 9999, display: "grid", placeItems: "center" }}>
					<div className="modal-card" style={{ maxWidth: 400, width: "100%", padding: "var(--space-6)" }}>
						<h3 style={{ margin: "0 0 var(--space-3)", fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>Delete Harvest Record</h3>
						<p className="text-muted" style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--space-5)" }}>
							Are you sure you want to delete this harvest record? This will also recalculate the block totals.
						</p>
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
							<button type="button" className="btn-secondary" onClick={() => setDeleteHarvestId(null)} disabled={isDeletingHarvest}>Cancel</button>
							<button
								type="button"
								onClick={handleHarvestDelete}
								disabled={isDeletingHarvest}
								style={{ padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-md)", background: "#C62828", color: "#fff", border: "none", fontWeight: "var(--fw-semibold)", cursor: "pointer" }}
							>
								{isDeletingHarvest ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

