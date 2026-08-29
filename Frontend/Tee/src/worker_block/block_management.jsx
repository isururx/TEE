import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Leaf, MapPinned, Plus, Search, SquareActivity, Trash2, UserCheck } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import Sidebar from "../common components/sidebar.jsx";
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

const emptyForm = {
	id: "",
	area: "",
	variety: teaVarieties[0],
	plantDate: new Date().toISOString().slice(0, 10),
	supervisorId: "",
};

function formatArea(value) {
	const numeric = Number(value);
	return Number.isNaN(numeric) ? value : `${numeric.toFixed(1)} ha`;
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
	};
}

export default function BlockManagement({ onNavigate = () => {} }) {
	const [blocks, setBlocks] = useState([]);
	const [supervisors, setSupervisors] = useState([]);
	const [selectedBlockId, setSelectedBlockId] = useState("");
	const [search, setSearch] = useState("");
	const [modalMode, setModalMode] = useState(null);
	const [formData, setFormData] = useState(emptyForm);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Load supervisors for assignment dropdown
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
		const query = search.trim();

		async function loadBlocks() {
			setIsLoading(true);
			setError("");
			try {
				const url = query ? `${BLOCKS_API_URL}?search=${encodeURIComponent(query)}` : BLOCKS_API_URL;
				const response = await fetch(url, { signal: controller.signal });
				if (!response.ok) throw new Error("Unable to load plantation blocks.");
				const payload = await response.json();
				const records = Array.isArray(payload) ? payload : payload.items ?? payload.blocks ?? [];
				const loadedBlocks = records.map(normalizeBlock);
				setBlocks(loadedBlocks);
				setSelectedBlockId((currentId) => loadedBlocks.some((block) => block.id === currentId) ? currentId : loadedBlocks[0]?.id ?? "");
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		}

		loadBlocks();
		return () => controller.abort();
	}, [search]);

	const filteredBlocks = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return blocks;
		return blocks.filter((b) =>
			[b.id, b.variety, b.supervisorName, b.lastHarvestDate, String(b.area)]
				.join(" ")
				.toLowerCase()
				.includes(query)
		);
	}, [blocks, search]);

	const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;
	const totalArea = useMemo(() => blocks.reduce((sum, block) => sum + Number(block.area || 0), 0), [blocks]);

	const openAddModal = () => {
		setFormData({
			...emptyForm,
			id: String(blocks.length + 1),
			supervisorId: supervisors[0]?.id ? String(supervisors[0].id) : "",
		});
		setModalMode("add");
	};

	const openEditModal = () => {
		if (!selectedBlock) return;
		setFormData({
			id: String(selectedBlock.id),
			area: String(selectedBlock.area),
			variety: selectedBlock.variety,
			plantDate: selectedBlock.plantDate !== "--" ? selectedBlock.plantDate : new Date().toISOString().slice(0, 10),
			supervisorId: selectedBlock.supervisorId ? String(selectedBlock.supervisorId) : "",
		});
		setModalMode("edit");
	};

	const closeModal = () => {
		setModalMode(null);
		setFormData(emptyForm);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (Number.parseFloat(formData.area) <= 0) {
			setError("A positive area is required.");
			return;
		}

		const blockPayload = {
			area: Number.parseFloat(formData.area) || 0,
			tea_variety: formData.variety,
			plant_date: formData.plantDate || null,
			supervisor_id: formData.supervisorId ? Number(formData.supervisorId) : null,
		};

		setIsSubmitting(true);
		setError("");
		try {
			const endpoint = modalMode === "edit" ? `${BLOCKS_API_URL}/${encodeURIComponent(formData.id)}` : BLOCKS_API_URL;
			const response = await fetch(endpoint, {
				method: modalMode === "edit" ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(blockPayload),
			});
			if (!response.ok) throw new Error("Unable to save the block.");
			const savedBlock = normalizeBlock(await response.json());
			setBlocks((current) =>
				modalMode === "edit"
					? current.map((block) => (block.id === savedBlock.id ? savedBlock : block))
					: [savedBlock, ...current.filter((block) => block.id !== savedBlock.id)]
			);
			setSelectedBlockId(savedBlock.id);
			closeModal();
		} catch (submitError) {
			setError(submitError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveSelected = async () => {
		if (!selectedBlock) return;
		if (!window.confirm(`Are you sure you want to remove Block ${selectedBlock.id}?`)) return;

		setError("");
		try {
			const response = await fetch(`${BLOCKS_API_URL}/${encodeURIComponent(selectedBlock.id)}`, { method: "DELETE" });
			if (!response.ok) throw new Error("Unable to remove the selected block.");
			setBlocks((current) => current.filter((block) => block.id !== selectedBlock.id));
			setSelectedBlockId("");
		} catch (removeError) {
			setError(removeError.message);
		}
	};

	const navigateToDetail = (block) => {
		sessionStorage.setItem("tee-selected-block", JSON.stringify(block));
		onNavigate("BlockDetail");
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header title="Block Management" crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }, { label: "Workers & Blocks", href: "#" }]} />
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<Sidebar activeItem="BlockManagement" role="manager" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					<section className="card" style={{ padding: "var(--space-6)",  border: "1px solid var(--color-border)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
							<div>
								<div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
									<MapPinned size={22} color="var(--color-primary)" />
									<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em" }}>Block Management</h1>
								</div>
								<p className="text-muted" style={{ margin: 0, maxWidth: 720 }}>Track tea blocks, harvesting output, assigned supervisors, variety details, and seasonal status from a single management view.</p>
							</div>
							<div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
								<button type="button" className="btn-secondary" onClick={openEditModal} disabled={!selectedBlock}><Edit3 size={16} /><span>Edit Block Details</span></button>
								<button type="button" className="btn-secondary" onClick={handleRemoveSelected} disabled={!selectedBlock}><Trash2 size={16} /><span>Remove Block</span></button>
								<button type="button" className="btn-primary" onClick={openAddModal}><Plus size={16} /><span>Add new Block</span></button>
							</div>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
							<div className="card" style={{ background: "var(--color-hover-green)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", textAlign: "center" }}><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-secondary)" }}>Total blocks</div><div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", marginTop: 8 }}>{blocks.length}</div></div>
							<div className="card" style={{ background: "var(--color-hover-green)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", textAlign: "center" }}><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-secondary)" }}>Total Area</div><div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", marginTop: 8 }}>{totalArea.toFixed(1)} ha</div></div>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)" }}>
						{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}
						<div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-4)" }}>
							<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
								<div style={{ width: 40, height: 40, borderRadius: 999, background: "var(--color-hover-green)", display: "grid", placeItems: "center" }}><SquareActivity size={18} color="var(--color-primary)" /></div>
								<div><div style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-md)" }}>Block registry</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{filteredBlocks.length} visible records</div></div>
							</div>
							<div className="input-search" style={{ minWidth: 260, maxWidth: 360, width: "100%" }}><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blocks, supervisor, variety..." /></div>
						</div>
						<div className="table-responsive" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
							<table className="table-modern" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 920 }}>
								<thead>
									<tr>{["Block ID", "Area", "Total Harvest", "Last Harvest Date", "Last Month Total Harvest", "Tea variety", "Supervisor", "Actions"].map((heading) => <th key={heading} style={{ textAlign: "left", padding: "var(--space-3) var(--space-4)", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-secondary)", background: "var(--color-hover-green)", borderBottom: "1px solid var(--color-border)" }}>{heading}</th>)}</tr>
								</thead>
								<tbody>
									{isLoading ? <tr><td colSpan={8} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading blocks...</td></tr> : filteredBlocks.length === 0 ? <tr><td colSpan={8} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>No blocks match the current search.</td></tr> : filteredBlocks.map((block) => {
										const isSelected = block.id === selectedBlockId;
										return (
											<tr key={block.id} onClick={() => { setSelectedBlockId(block.id); navigateToDetail(block); }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") { setSelectedBlockId(block.id); navigateToDetail(block); } }} style={{ cursor: "pointer", background: isSelected ? "var(--color-hover-green)" : "var(--color-card)", transition: "background-color var(--transition-fast)" }}>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>{block.id}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{formatArea(block.area)}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.totalHarvest}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.lastHarvestDate}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.lastMonthHarvest}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.variety}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
													<span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-hover-green)", fontSize: "11px", fontWeight: "var(--fw-medium)", color: "var(--color-primary)" }}>
														<UserCheck size={12} />
														{block.supervisorName}
													</span>
												</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
													<button className="btn-ghost" style={{ padding: "4px 8px", fontSize: "11px", fontWeight: "var(--fw-bold)" }} onClick={(e) => { e.stopPropagation(); navigateToDetail(block); }}>View Details</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><Leaf size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Selected block</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.id ? `Block ${selectedBlock.id}` : "None selected"}</div></div></div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><UserCheck size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Supervisor</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.supervisorName ?? "Unassigned"}</div></div></div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><CalendarDays size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Latest harvest date</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.lastHarvestDate ?? "--"}</div></div></div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><MapPinned size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Tea variety</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.variety ?? "--"}</div></div></div>
					</section>
				</main>
			</div>
			<Footer />
			{modalMode && <BlockFormModal mode={modalMode} formData={formData} setFormData={setFormData} onClose={closeModal} onSubmit={handleSubmit} teaVarieties={teaVarieties} supervisors={supervisors} isSubmitting={isSubmitting} error={error} />}
		</div>
	);
}
