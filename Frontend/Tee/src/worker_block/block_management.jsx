import React, { useMemo, useState } from "react";
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

const initialBlocks = [
	{ id: "A-12", area: 12.4, totalHarvest: "1,420.5 kg", lastHarvestDate: "2023-09-28", lastMonthHarvest: "5,620.0 kg", variety: "Assamica Gold", yearPlanted: 2018 },
	{ id: "B-03", area: 9.8, totalHarvest: "980.0 kg", lastHarvestDate: "2023-09-14", lastMonthHarvest: "4,120.0 kg", variety: "TRI 2025", yearPlanted: 2020 },
	{ id: "C-07", area: 16.1, totalHarvest: "1,550.8 kg", lastHarvestDate: "2023-08-15", lastMonthHarvest: "6,008.2 kg", variety: "B.O.P. Hybrid", yearPlanted: 2016 },
	{ id: "D-02", area: 11.3, totalHarvest: "910.2 kg", lastHarvestDate: "2023-08-12", lastMonthHarvest: "3,840.4 kg", variety: "High Yield Clonal", yearPlanted: 2021 },
];

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

export default function BlockManagement({ onNavigate = () => {} }) {
	const [blocks, setBlocks] = useState(initialBlocks);
	const [selectedBlockId, setSelectedBlockId] = useState(initialBlocks[0]?.id ?? "");
	const [search, setSearch] = useState("");
	const [modalMode, setModalMode] = useState(null);
	const [formData, setFormData] = useState(emptyForm);

	const filteredBlocks = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return blocks;
		return blocks.filter((block) => [block.id, block.area, block.totalHarvest, block.lastHarvestDate, block.lastMonthHarvest, block.variety].join(" ").toLowerCase().includes(query));
	}, [blocks, search]);

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

	const handleSubmit = (event) => {
		event.preventDefault();
		const nextBlock = {
			id: formData.id.trim(),
			area: Number.parseFloat(formData.area) || 0,
			totalHarvest: formData.totalHarvest || "0.0 kg",
			lastHarvestDate: formData.lastHarvestDate,
			lastMonthHarvest: formData.lastMonthHarvest || "0.0 kg",
			variety: formData.variety,
			yearPlanted: Number.parseInt(formData.yearPlanted, 10) || new Date().getFullYear(),
		};

		setBlocks((current) => {
			if (modalMode === "edit") {
				return current.map((block) => (block.id === nextBlock.id ? nextBlock : block));
			}
			return [nextBlock, ...current.filter((block) => block.id !== nextBlock.id)];
		});
		setSelectedBlockId(nextBlock.id);
		closeModal();
	};

	const handleRemoveSelected = () => {
		if (!selectedBlock) return;
		setBlocks((current) => {
			const remaining = current.filter((block) => block.id !== selectedBlock.id);
			setSelectedBlockId(remaining[0]?.id ?? "");
			return remaining;
		});
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
									{filteredBlocks.length === 0 ? <tr><td colSpan={6} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>No blocks match the current search.</td></tr> : filteredBlocks.map((block) => {
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
			{modalMode && <BlockFormModal mode={modalMode} formData={formData} setFormData={setFormData} onClose={closeModal} onSubmit={handleSubmit} teaVarieties={teaVarieties} />}
		</div>
	);
}