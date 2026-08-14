import React, { useMemo, useState } from "react";
import { CalendarDays, Edit3, Leaf, MapPinned, Plus, Search, SquareActivity, Trash2, X } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import Sidebar from "../common components/sidebar.jsx";

const teaVarieties = [
	"Camellia sinensis var. assamica",
	"TRI 2025",
	"B.O.P. Hybrid",
	"High Yield Clonal",
	"UPASI-9",
	"TV-1",
];

const initialBlocks = [
	{
		id: "BLK-01",
		area: 22.4,
		totalHarvest: "1,240 kg",
		lastHarvestDate: "2026-08-03",
		lastMonthHarvest: "4,860 kg",
		variety: teaVarieties[0],
		yearPlanted: 2018,
	},
	{
		id: "BLK-02",
		area: 18.9,
		totalHarvest: "980 kg",
		lastHarvestDate: "2026-08-01",
		lastMonthHarvest: "3,940 kg",
		variety: teaVarieties[1],
		yearPlanted: 2020,
	},
	{
		id: "BLK-03",
		area: 31.2,
		totalHarvest: "1,670 kg",
		lastHarvestDate: "2026-07-30",
		lastMonthHarvest: "5,220 kg",
		variety: teaVarieties[2],
		yearPlanted: 2016,
	},
	{
		id: "BLK-04",
		area: 14.6,
		totalHarvest: "730 kg",
		lastHarvestDate: "2026-07-29",
		lastMonthHarvest: "2,860 kg",
		variety: teaVarieties[3],
		yearPlanted: 2021,
	},
];

const emptyForm = {
	id: "",
	area: "",
	totalHarvest: "0 kg",
	lastHarvestDate: new Date().toISOString().slice(0, 10),
	lastMonthHarvest: "0 kg",
	variety: teaVarieties[0],
	yearPlanted: new Date().getFullYear(),
};

function formatArea(value) {
	const numeric = Number(value);
	if (Number.isNaN(numeric)) {
		return value;
	}

	return `${numeric.toFixed(1)} ha`;
}

export default function BlockManagement({ onNavigate = () => {} }) {
	const [blocks, setBlocks] = useState(initialBlocks);
	const [search, setSearch] = useState("");
	const [selectedBlockId, setSelectedBlockId] = useState(initialBlocks[0]?.id ?? "");
	const [modalMode, setModalMode] = useState(null);
	const [formData, setFormData] = useState(emptyForm);

	const filteredBlocks = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) {
			return blocks;
		}

		return blocks.filter((block) => {
			return [
				block.id,
				block.area,
				block.totalHarvest,
				block.lastHarvestDate,
				block.lastMonthHarvest,
				block.variety,
				block.yearPlanted,
			]
				.join(" ")
				.toLowerCase()
				.includes(query);
		});
	}, [blocks, search]);

	const totalArea = useMemo(() => {
		return blocks.reduce((sum, block) => sum + Number(block.area || 0), 0);
	}, [blocks]);

	const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;

	const closeModal = () => {
		setModalMode(null);
		setFormData(emptyForm);
	};

	const openAddModal = () => {
		const nextId = `BLK-${String(blocks.length + 1).padStart(2, "0")}`;
		setFormData({
			...emptyForm,
			id: nextId,
		});
		setModalMode("add");
	};

	const openEditModal = () => {
		if (!selectedBlock) {
			return;
		}

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

	const handleSubmit = (event) => {
		event.preventDefault();

		const nextBlock = {
			id: formData.id.trim(),
			area: Number.parseFloat(formData.area) || 0,
			totalHarvest: formData.totalHarvest || "0 kg",
			lastHarvestDate: formData.lastHarvestDate,
			lastMonthHarvest: formData.lastMonthHarvest || "0 kg",
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
		if (!selectedBlock) {
			return;
		}

		setBlocks((current) => {
			const remaining = current.filter((block) => block.id !== selectedBlock.id);
			setSelectedBlockId(remaining[0]?.id ?? "");
			return remaining;
		});
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header
				title="Block Management"
				crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }, { label: "Workers & Blocks", href: "#" }]}
			/>

			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<Sidebar activeItem="blocks" role="manager" onNavigate={onNavigate} />

				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					<section
						className="card"
						style={{
							padding: "var(--space-6)",
							background: "linear-gradient(135deg, #FFFFFF 0%, #F2F8F0 100%)",
							border: "1px solid var(--color-border)",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
							<div>
								<div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
									<MapPinned size={22} color="var(--color-primary)" />
									<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em" }}>
										Block Management
									</h1>
								</div>
								<p className="text-muted" style={{ margin: 0, maxWidth: 720 }}>
									Track tea blocks, harvesting output, variety details, and seasonal status from a single management view.
								</p>
							</div>

							<div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
								<button type="button" className="btn-secondary" onClick={openEditModal} disabled={!selectedBlock}>
									<Edit3 size={16} />
									<span>Edit Block Details</span>
								</button>
								<button type="button" className="btn-secondary" onClick={handleRemoveSelected} disabled={!selectedBlock}>
									<Trash2 size={16} />
									<span>Remove Block</span>
								</button>
								<button type="button" className="btn-primary" onClick={openAddModal}>
									<Plus size={16} />
									<span>Add new Block</span>
								</button>
							</div>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
							<div className="card" style={{ background: "#070707", color: "#fff", border: "none", boxShadow: "none", textAlign: "center" }}>
								<div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", opacity: 0.95 }}>Total blocks</div>
								<div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", marginTop: 8 }}>{blocks.length}</div>
							</div>
							<div className="card" style={{ background: "#070707", color: "#fff", border: "none", boxShadow: "none", textAlign: "center" }}>
								<div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", opacity: 0.95 }}>Total Area</div>
								<div style={{ fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", marginTop: 8 }}>{totalArea.toFixed(1)} m2</div>
							</div>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-4)" }}>
							<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
								<div
									style={{
										width: 40,
										height: 40,
										borderRadius: 999,
										background: "var(--color-hover-green)",
										display: "grid",
										placeItems: "center",
									}}
								>
									<SquareActivity size={18} color="var(--color-primary)" />
								</div>
								<div>
									<div style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-md)" }}>Block registry</div>
									<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
										{filteredBlocks.length} visible records
									</div>
								</div>
							</div>

							<div className="input-search" style={{ minWidth: 260, maxWidth: 360, width: "100%" }}>
								<Search size={16} />
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search blocks, variety, harvest date..."
								/>
							</div>
						</div>

						<div style={{ overflowX: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "#F4F4F4" }}>
							<table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 860 }}>
								<thead>
									<tr>
										{[
											"Block ID",
											"Area",
											"Total Harvest",
											"Last Harvest Date",
											"Last Month Total Harvest",
											"Tea variety",
										].map((heading) => (
											<th
												key={heading}
												style={{
													textAlign: "left",
													padding: "var(--space-3) var(--space-4)",
													fontSize: "var(--fs-xs)",
													fontWeight: "var(--fw-semibold)",
													color: "var(--color-text-secondary)",
													background: "#F8F8F8",
													borderBottom: "1px solid var(--color-border)",
												}}
											>
												{heading}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredBlocks.length === 0 ? (
										<tr>
											<td colSpan={6} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>
												No blocks match the current search.
											</td>
										</tr>
									) : (
										filteredBlocks.map((block) => {
											const isSelected = block.id === selectedBlockId;
											return (
												<tr
													key={block.id}
													onClick={() => setSelectedBlockId(block.id)}
													style={{
														cursor: "pointer",
														background: isSelected ? "#EAF5E8" : "#FFFFFF",
													}}
												>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-semibold)" }}>
														{block.id}
													</td>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>{formatArea(block.area)}</td>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>{block.totalHarvest}</td>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>{block.lastHarvestDate}</td>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>{block.lastMonthHarvest}</td>
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>{block.variety}</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					</section>

					<section
						className="card"
						style={{
							padding: "var(--space-5)",
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
							gap: "var(--space-4)",
							alignItems: "stretch",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
							<Leaf size={18} color="var(--color-primary)" />
							<div>
								<div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Selected block</div>
								<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.id ?? "None selected"}</div>
							</div>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
							<CalendarDays size={18} color="var(--color-primary)" />
							<div>
								<div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Latest harvest date</div>
								<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.lastHarvestDate ?? "--"}</div>
							</div>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
							<MapPinned size={18} color="var(--color-primary)" />
							<div>
								<div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Tea variety</div>
								<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{selectedBlock?.variety ?? "--"}</div>
							</div>
						</div>
					</section>
				</main>
			</div>

			<Footer />

			{modalMode && (
				<div className="modal-backdrop">
					<div className="modal-card">
						<div className="modal-header">
							<h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0 }}>
								{modalMode === "edit" ? "Edit Block Details" : "Add New Block"}
							</h3>
							<button type="button" className="btn-icon" onClick={closeModal}>
								<X size={18} />
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label className="form-label">Block ID</label>
								<input
									className="input-primary"
									value={formData.id}
									onChange={(e) => setFormData((current) => ({ ...current, id: e.target.value }))}
									required
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Tea variety</label>
								<select
									className="input-primary"
									value={formData.variety}
									onChange={(e) => setFormData((current) => ({ ...current, variety: e.target.value }))}
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
									<label className="form-label">Area (ha)</label>
									<input
										className="input-primary"
										type="number"
										step="0.1"
										min="0"
										value={formData.area}
										onChange={(e) => setFormData((current) => ({ ...current, area: e.target.value }))}
										required
									/>
								</div>

								<div className="form-group">
									<label className="form-label">Year Planted</label>
									<input
										className="input-primary"
										type="number"
										min="1900"
										max={new Date().getFullYear()}
										value={formData.yearPlanted}
										onChange={(e) => setFormData((current) => ({ ...current, yearPlanted: e.target.value }))}
										required
									/>
								</div>
							</div>

							<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-3)" }}>
								<div className="form-group">
									<label className="form-label">Total Harvest</label>
									<input
										className="input-primary"
										value={formData.totalHarvest}
										onChange={(e) => setFormData((current) => ({ ...current, totalHarvest: e.target.value }))}
										placeholder="e.g. 1200 kg"
									/>
								</div>

								<div className="form-group">
									<label className="form-label">Last Harvest Date</label>
									<input
										className="input-primary"
										type="date"
										value={formData.lastHarvestDate}
										onChange={(e) => setFormData((current) => ({ ...current, lastHarvestDate: e.target.value }))}
									/>
								</div>
							</div>

							<div className="form-group">
								<label className="form-label">Last Month Total Harvest</label>
								<input
									className="input-primary"
									value={formData.lastMonthHarvest}
									onChange={(e) => setFormData((current) => ({ ...current, lastMonthHarvest: e.target.value }))}
									placeholder="e.g. 5000 kg"
								/>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn-secondary" onClick={closeModal}>
									Cancel
								</button>
								<button type="submit" className="btn-primary">
									{modalMode === "edit" ? "Save Changes" : "Add Block"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
