import React, { useMemo, useState } from "react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import Sidebar from "../common components/sidebar.jsx";
import { Clock3, Edit3, Leaf, MapPinned, RotateCcw, X } from "lucide-react";
import BlockFormModal from "./block_form_modal.jsx";

const teaVarieties = [
	"Camellia sinensis var. assamica",
	"TRI 2025",
	"B.O.P. Hybrid",
	"High Yield Clonal",
	"UPASI-9",
	"TV-1",
];

const fallbackBlock = {
	id: "A-12",
	area: 12.4,
	totalHarvest: "1,420.5 kg",
	lastHarvestDate: "2023-09-28",
	lastMonthHarvest: "5,620.0 kg",
	variety: "Assamica Gold",
	yearPlanted: 2018,
};

const defaultHistory = [
	{ date: "Sep 28, 2023", teaVariety: "Assamica Gold", quantity: "1,420.5", efficiency: "94.2%", status: "VERIFIED" },
	{ date: "Sep 14, 2023", teaVariety: "Assamica Gold", quantity: "1,280.0", efficiency: "88.5%", status: "VERIFIED" },
	{ date: "Aug 30, 2023", teaVariety: "Assamica Gold", quantity: "910.2", efficiency: "62.1%", status: "FLAGGED" },
	{ date: "Aug 15, 2023", teaVariety: "Assamica Gold", quantity: "1,550.8", efficiency: "97.8%", status: "VERIFIED" },
	{ date: "Aug 12, 2023", teaVariety: "Assamica Gold", quantity: "1,420.5", efficiency: "91.4%", status: "VERIFIED" },
];

const activityLog = [
	{ title: "Soil Testing", meta: "Oct 24, 14:20  Operator: R.Chen" },
	{ title: "Irrigation Scheduled", meta: "Oct 22, 06:00  Automated System" },
	{ title: "Pesticide Application", meta: "Oct 19, 09:15  Operator: K.Patel" },
	{ title: "Pruning", meta: "Oct 15, 11:45  Team Beta (12 members)" },
];

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
	const isVerified = text === "VERIFIED" || text === "Stable";
	const badgeClass = isVerified ? "badge-success" : text === "FLAGGED" ? "badge-warning" : "badge-info";

	return (
		<span className={badgeClass}>
			{text}
		</span>
	);
}

export default function BlockDetail({ onNavigate = () => {} }) {
	const [block, setBlock] = useState(() => safeParseBlock());
	const [modalMode, setModalMode] = useState(null);
	const [formData, setFormData] = useState({
		id: block.id,
		area: String(block.area),
		totalHarvest: block.totalHarvest,
		lastHarvestDate: block.lastHarvestDate,
		lastMonthHarvest: block.lastMonthHarvest,
		variety: block.variety,
		yearPlanted: block.yearPlanted,
	});

	const history = useMemo(() => defaultHistory.map((entry) => ({ ...entry, teaVariety: block.variety || entry.teaVariety })), [block.variety]);

	const openEditModal = () => {
		setFormData({
			id: block.id,
			area: String(block.area),
			totalHarvest: block.totalHarvest,
			lastHarvestDate: block.lastHarvestDate,
			lastMonthHarvest: block.lastMonthHarvest,
			variety: block.variety,
			yearPlanted: block.yearPlanted,
		});
		setModalMode("edit");
	};

	const closeModal = () => {
		setModalMode(null);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const nextBlock = {
			id: formData.id.trim(),
			area: Number.parseFloat(formData.area) || 0,
			totalHarvest: formData.totalHarvest,
			lastHarvestDate: formData.lastHarvestDate,
			lastMonthHarvest: formData.lastMonthHarvest,
			variety: formData.variety,
			yearPlanted: Number.parseInt(formData.yearPlanted, 10) || new Date().getFullYear(),
		};

		setBlock(nextBlock);
		sessionStorage.setItem("tee-selected-block", JSON.stringify(nextBlock));
		setModalMode(null);
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header title={`Block Detail: Block ${block.id}`} crumbs={[{ label: "Home", href: "#" }, { label: "Dashboard", href: "#" }, { label: "Workers & Blocks", href: "#" }]} />
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<Sidebar activeItem="BlockManagement" role="manager" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					<section className="card" style={{ padding: "var(--space-6)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
							<div>
								<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)" }}>Block Detail: Block {block.id}</h1>
								<p className="text-muted" style={{ marginTop: "var(--space-2)" }}>Overview, harvesting history, and current operational status for the selected block.</p>
							</div>
							<button type="button" className="btn-secondary" onClick={openEditModal}>
								<Edit3 size={16} />
								<span>Edit Block Details</span>
							</button>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Block ID</div>
								<div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-primary)", marginTop: "var(--space-1)" }}>{block.id}</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Variety</div>
								<div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", marginTop: "var(--space-1)" }}>{block.variety}</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Area</div>
								<div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", marginTop: "var(--space-1)" }}>{block.area.toFixed(1)} Ha</div>
							</div>
							<div className="card" style={{ padding: "var(--space-4)" }}>
								<div className="label-text">Last Harvest</div>
								<div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", marginTop: "var(--space-1)" }}>{block.lastHarvestDate}</div>
							</div>
						</div>
					</section>

					<section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 1fr)", gap: "var(--space-6)" }}>
						<div className="card" style={{ padding: "var(--space-5)" }}>
							<div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
								<div>
									<h2 className="section-title" style={{ marginBottom: 0 }}>Current Status</h2>
									<p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Healthy, no active alerts</p>
								</div>
								<BlockBadge text="Stable" />
							</div>
							<div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
								<div style={{ flex: 1 }}>
									<div className="progress-bar" style={{ height: 10 }}>
										<div className="progress-bar-fill" style={{ width: "78%" }} />
									</div>
								</div>
								<div className="badge-info">Monitoring</div>
							</div>
							<div style={{ marginTop: "var(--space-4)" }} className="alert alert-info">
								<RotateCcw size={18} />
								<div>
									<div style={{ fontWeight: "var(--fw-semibold)" }}>Automatic block checks are up to date.</div>
									<div className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>This panel now follows the default app surface and spacing tokens.</div>
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
								{activityLog.map((item) => (
									<div key={item.title} className="card" style={{ padding: "var(--space-3)", boxShadow: "none" }}>
										<div style={{ fontWeight: "var(--fw-semibold)" }}>{item.title}</div>
										<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{item.meta}</div>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className="card" style={{ padding: "var(--space-5)" }}>
						<div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
							<div>
								<h2 className="section-title" style={{ marginBottom: 0 }}>Harvest History</h2>
								<p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Last 5 cycles for Block {block.id}</p>
							</div>
							<a href="#">View Full Archive →</a>
						</div>
						<div className="table-responsive">
							<table className="table-modern">
								<thead>
									<tr>
										{["Date", "Tea Variety", "Quantity (kg)", "Efficiency (%)", "Status"].map((heading) => (
											<th key={heading}>{heading}</th>
										))}
									</tr>
								</thead>
								<tbody>
									{history.map((entry) => (
										<tr key={`${entry.date}-${entry.quantity}`} className="hover-row">
											<td>{entry.date}</td>
											<td>{entry.teaVariety}</td>
											<td>{entry.quantity}</td>
											<td>{entry.efficiency}</td>
											<td><BlockBadge text={entry.status} /></td>
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
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.id}</div>
							</div>
							<div>
								<div className="label-text">Variety</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.variety}</div>
							</div>
							<div>
								<div className="label-text">Area</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.area.toFixed(1)} Ha</div>
							</div>
							<div>
								<div className="label-text">Year Planted</div>
								<div style={{ marginTop: "var(--space-1)", fontWeight: "var(--fw-semibold)" }}>{block.yearPlanted}</div>
							</div>
						</div>
					</section>
				</main>
			</div>
			<Footer />

			{modalMode && (
				<BlockFormModal
					mode={modalMode}
					formData={formData}
					setFormData={setFormData}
					onClose={closeModal}
					onSubmit={handleSubmit}
					teaVarieties={teaVarieties}
				/>
			)}
		</div>
	);
}