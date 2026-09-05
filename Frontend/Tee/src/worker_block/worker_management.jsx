import React, { useEffect, useMemo, useState } from "react";
import { Users, Plus, Search, Pencil, Trash2, RefreshCw } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import WorkerProfileForm from "./worker_profile_form.jsx";

const WORKERS_API_URL = "http://localhost:8000/api/workers";

function normalizeWorker(w) {
	return {
		...w,
		id: w.id ?? w.worker_id,
		name: w.name ?? "Unknown",
		NIC: w.NIC ?? w.nic ?? "--",
		dob: w.dob ?? "--",
		address: w.address ?? "--",
		email: w.email ?? "--",
		phone_num: w.phone_num ?? "--",
		assigned_block: w.assigned_block ?? null,
		assigned_block_name: w.assigned_block_name ?? (w.assigned_block ? `Block ${w.assigned_block}` : "Unassigned"),
	};
}

export default function WorkerManagement({ onNavigate = () => {} }) {
	const [workers, setWorkers] = useState([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [modalMode, setModalMode] = useState(null); // "create" | "edit"
	const [workerToEdit, setWorkerToEdit] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(null); // worker id
	const [isDeleting, setIsDeleting] = useState(false);

	async function loadWorkers() {
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(WORKERS_API_URL);
			if (!response.ok) throw new Error("Unable to load workers.");
			const data = await response.json();
			const list = Array.isArray(data) ? data : data.workers ?? data.items ?? [];
			setWorkers(list.map(normalizeWorker));
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		loadWorkers();
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return workers;
		return workers.filter((w) =>
			[w.id, w.name, w.email, w.assigned_block_name].join(" ").toLowerCase().includes(q)
		);
	}, [workers, search]);

	const handleCreated = (newWorker) => {
		setWorkers((current) => [normalizeWorker(newWorker), ...current]);
	};

	const handleUpdated = (updatedWorker) => {
		setWorkers((current) =>
			current.map((w) => (w.id === updatedWorker.id ? normalizeWorker(updatedWorker) : w))
		);
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteConfirm) return;
		setIsDeleting(true);
		try {
			const response = await fetch(`${WORKERS_API_URL}/${deleteConfirm}`, { method: "DELETE" });
			if (!response.ok && response.status !== 204) throw new Error("Unable to delete worker.");
			setWorkers((current) => current.filter((w) => w.id !== deleteConfirm));
			setDeleteConfirm(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header
				title="Worker Management"
				crumbs={[
					{ label: "Home", href: "#" },
					{ label: "Dashboard", href: "#" },
					{ label: "Workers & Blocks", href: "#" },
				]}
			/>
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<RoleSidebar activeItem="workers" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					{error && <div role="alert" style={{ color: "var(--color-danger, #b42318)" }}>{error}</div>}

					{/* Header Row */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
						<div>
							<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em" }}>
								Worker Management
							</h1>
							<p className="text-muted" style={{ marginTop: "var(--space-1)" }}>
								{workers.length} worker{workers.length !== 1 ? "s" : ""} registered
							</p>
						</div>
						<div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
							<button
								type="button"
								className="btn-secondary"
								onClick={loadWorkers}
								style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
							>
								<RefreshCw size={15} />
								Refresh
							</button>
							<button
								type="button"
								onClick={() => { setWorkerToEdit(null); setModalMode("create"); }}
								style={{
									padding: "var(--space-3) var(--space-5)",
									borderRadius: "var(--radius-md)",
									background: "#000000",
									color: "#FFFFFF",
									border: "none",
									fontWeight: "var(--fw-semibold)",
									fontSize: "var(--fs-sm)",
									display: "inline-flex",
									alignItems: "center",
									gap: "var(--space-2)",
									cursor: "pointer",
									boxShadow: "var(--shadow-soft)",
								}}
							>
								<Plus size={16} />
								Add Worker
							</button>
						</div>
					</div>

					{/* Search */}
					<div style={{ position: "relative", maxWidth: 380 }}>
						<Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
						<input
							className="input-primary"
							placeholder="Search by name, email, block..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ paddingLeft: 38 }}
						/>
					</div>

					{/* Table */}
					<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
						<div className="table-responsive" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
							<table className="table-modern" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 800 }}>
								<thead>
									<tr>
										{["ID", "Name", "NIC", "DOB", "Phone", "Email", "Assigned Block", "Actions"].map((h) => (
											<th key={h} style={{ padding: "var(--space-3) var(--space-4)", fontSize: "11px", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", background: "var(--color-hover-green)", borderBottom: "1px solid var(--color-border)" }}>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<tr><td colSpan={8} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>Loading workers...</td></tr>
									) : filtered.length === 0 ? (
										<tr><td colSpan={8} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>No workers found.</td></tr>
									) : filtered.map((w) => (
										<tr key={w.id}>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-xs)" }}>#{w.id}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-medium)" }}>{w.name}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>{w.NIC}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>{w.dob}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>{w.phone_num}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}>{w.email}</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", fontSize: "var(--fs-xs)" }}>
												<span style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", background: w.assigned_block ? "#E8F5E9" : "#F5F5F5", color: w.assigned_block ? "#2E7D32" : "#757575", fontWeight: "var(--fw-semibold)" }}>
													{w.assigned_block_name}
												</span>
											</td>
											<td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
												<div style={{ display: "flex", gap: "var(--space-2)" }}>
													<button
														type="button"
														title="Edit worker"
														onClick={() => { setWorkerToEdit(w); setModalMode("edit"); }}
														style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)" }}
													>
														<Pencil size={13} /> Edit
													</button>
													<button
														type="button"
														title="Delete worker"
														onClick={() => setDeleteConfirm(w.id)}
														style={{ background: "none", border: "1px solid #FFCDD2", borderRadius: "var(--radius-sm)", padding: "4px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--fs-xs)", color: "#C62828" }}
													>
														<Trash2 size={13} /> Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				</main>
			</div>
			<Footer />

			{/* Create / Edit Modal */}
			{(modalMode === "create" || modalMode === "edit") && (
				<WorkerProfileForm
					workerToEdit={modalMode === "edit" ? workerToEdit : null}
					onClose={() => { setModalMode(null); setWorkerToEdit(null); }}
					onCreated={handleCreated}
					onUpdated={handleUpdated}
				/>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm && (
				<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 9999, display: "grid", placeItems: "center" }}>
					<div className="modal-card" style={{ maxWidth: 400, width: "100%", padding: "var(--space-6)" }}>
						<h3 style={{ margin: "0 0 var(--space-3)", fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>Confirm Delete</h3>
						<p className="text-muted" style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--space-5)" }}>
							Are you sure you want to delete worker #{deleteConfirm}? This action cannot be undone.
						</p>
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
							<button type="button" className="btn-secondary" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>Cancel</button>
							<button
								type="button"
								onClick={handleDeleteConfirmed}
								disabled={isDeleting}
								style={{ padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-md)", background: "#C62828", color: "#fff", border: "none", fontWeight: "var(--fw-semibold)", cursor: "pointer" }}
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
