import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Leaf, MapPinned, Plus, Search, SquareActivity, Trash2 } from "lucide-react";
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

const BLOCKS_API_URL = "http://localhost:8000/api/routes/blocks";

const emptyForm = {
	id: "",
	area: "",
	totalHarvest: "0.0 kg",
	lastHarvestDate: new Date().toISOString().slice(0, 10),
	lastMonthHarvest: "0.0 kg",
	variety: teaVarieties[0],
	yearPlanted: new Date().getFullYear(),
};

function formatArea(value) {
	const numeric = Number(value);
	return Number.isNaN(numeric) ? value : `${numeric.toFixed(1)} ha`;
}

function normalizeBlock(block) {
	return {
		...block,
		id: block.id ?? block.block_id,
		area: block.area ?? block.area_ha ?? 0,
		totalHarvest: block.totalHarvest ?? block.total_harvest_kg ?? "0.0 kg",
		lastHarvestDate: block.lastHarvestDate ?? block.last_harvest_date ?? "--",
		lastMonthHarvest: block.lastMonthHarvest ?? block.last_month_harvest_kg ?? "0.0 kg",
		variety: block.variety ?? block.tea_variety ?? "--",
		yearPlanted: block.yearPlanted ?? block.year_planted ?? new Date().getFullYear(),
	};
}

export default function BlockManagement({ onNavigate = () => {} }) {
	const [blocks, setBlocks] = useState([]);
	const [selectedBlockId, setSelectedBlockId] = useState("");
	const [search, setSearch] = useState("");
	const [modalMode, setModalMode] = useState(null);
	const [formData, setFormData] = useState(emptyForm);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const filteredBlocks = useMemo(() => blocks, [blocks]);

	const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;
	const totalArea = useMemo(() => blocks.reduce((sum, block) => sum + Number(block.area || 0), 0), [blocks]);

	const openAddModal = () => {
		setFormData({ ...emptyForm, id: `B-${String(blocks.length + 1).padStart(2, "0")}` });
		setModalMode("add");
	};

	const openEditModal = () => {
		if (!selectedBlock) return;
		setFormData({
			id: selectedBlock.id,
			area: String(selectedBlock.area),
			totalHarvest: selectedBlock.totalHarvest,
			lastHarvestDate: selectedBlock.lastHarvestDate,
			lastMonthHarvest: selectedBlock.lastMonthHarvest,
			variety: selectedBlock.variety,
			yearPlanted: selectedBlock.yearPlanted,
		});
		setModalMode("edit");
	};

	const closeModal = () => {
		setModalMode(null);
		setFormData(emptyForm);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!formData.id.trim() || Number.parseFloat(formData.area) <= 0) {
			setError("Block ID and a positive area are required.");
			return;
		}
		const nextBlock = {
			id: formData.id.trim(),
			area: Number.parseFloat(formData.area) || 0,
			totalHarvest: formData.totalHarvest || "0.0 kg",
			lastHarvestDate: formData.lastHarvestDate,
			lastMonthHarvest: formData.lastMonthHarvest || "0.0 kg",
			variety: formData.variety,
			yearPlanted: Number.parseInt(formData.yearPlanted, 10) || new Date().getFullYear(),
		};
		setIsSubmitting(true);
		setError("");
		try {
			const endpoint = modalMode === "edit" ? `${BLOCKS_API_URL}/${encodeURIComponent(nextBlock.id)}` : BLOCKS_API_URL;
			const response = await fetch(endpoint, {
				method: modalMode === "edit" ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: nextBlock.id,
					area: nextBlock.area,
					tea_variety: nextBlock.variety,
					year_planted: nextBlock.yearPlanted,
					total_harvest_kg: nextBlock.totalHarvest,
					last_harvest_date: nextBlock.lastHarvestDate,
					last_month_harvest_kg: nextBlock.lastMonthHarvest,
				}),
			});
			if (!response.ok) throw new Error("Unable to save the block.");
			const savedBlock = response.status === 204 ? nextBlock : normalizeBlock(await response.json());
			setBlocks((current) => modalMode === "edit" ? current.map((block) => (block.id === savedBlock.id ? savedBlock : block)) : [savedBlock, ...current.filter((block) => block.id !== savedBlock.id)]);
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
								<p className="text-muted" style={{ margin: 0, maxWidth: 720 }}>Track tea blocks, harvesting output, variety details, and seasonal status from a single management view.</p>
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
							<div className="input-search" style={{ minWidth: 260, maxWidth: 360, width: "100%" }}><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blocks, variety, harvest date..." /></div>
						</div>
						<div className="table-responsive" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
							<table className="table-modern" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 860 }}>
								<thead>
									<tr>{["Block ID", "Area", "Total Harvest", "Last Harvest Date", "Last Month Total Harvest", "Tea variety"].map((heading) => <th key={heading} style={{ textAlign: "left", padding: "var(--space-3) var(--space-4)", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-secondary)", background: "var(--color-hover-green)", borderBottom: "1px solid var(--color-border)" }}>{heading}</th>)}</tr>
								</thead>
								<tbody>
									{isLoading ? <tr><td colSpan={6} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading blocks...</td></tr> : filteredBlocks.length === 0 ? <tr><td colSpan={6} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>No blocks match the current search.</td></tr> : filteredBlocks.map((block) => {
										const isSelected = block.id === selectedBlockId;
										return (
											<tr key={block.id} onClick={() => { setSelectedBlockId(block.id); navigateToDetail(block); }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") { setSelectedBlockId(block.id); navigateToDetail(block); } }} style={{ cursor: "pointer", background: isSelected ? "var(--color-hover-green)" : "var(--color-card)", transition: "background-color var(--transition-fast)" }}>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>{block.id}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{formatArea(block.area)}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.totalHarvest}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.lastHarvestDate}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.lastMonthHarvest}</td>
												<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>{block.variety}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><Leaf size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Selected block</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.id ?? "None selected"}</div></div></div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><CalendarDays size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Latest harvest date</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.lastHarvestDate ?? "--"}</div></div></div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}><MapPinned size={18} color="var(--color-primary)" /><div><div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Tea variety</div><div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.variety ?? "--"}</div></div></div>
					</section>
				</main>
			</div>
			<Footer />
			{modalMode && <BlockFormModal mode={modalMode} formData={formData} setFormData={setFormData} onClose={closeModal} onSubmit={handleSubmit} teaVarieties={teaVarieties} isSubmitting={isSubmitting} error={error} />}
		</div>
	);
}