import React, { useEffect, useMemo, useState } from "react";
import { ClipboardList, RefreshCw, Plus, Filter, Users, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import Sidebar from "../common components/sidebar.jsx";
import CreateTaskModal from "./create_task.jsx";

const TASKS_API_URL = "http://localhost:8000/api/tasks";

function normalizeTask(task) {
	return {
		...task,
		id: task.id ?? task.task_id,
		description: task.description ?? "Untitled task",
		assignedWorker: task.assignedWorker ?? task.assigned_worker ?? task.worker_name ?? task.assigned_worker_names?.join(", ") ?? "Unassigned",
		plantationBlock: task.plantationBlock ?? task.plantation_block ?? task.block_name ?? (task.block_id ? `Block ${task.block_id}` : "Unassigned"),
		deadline: task.deadline ?? "--",
		priority: task.priority ?? "LOW",
		status: task.status ?? "QUEUED",
	};
}

function normalizeAllocation(allocation) {
	const colors = ["#1B5E20", "#4CAF50", "#81C784", "#C8E6C9"];
	if (Array.isArray(allocation)) return allocation;
	return Object.entries(allocation ?? {}).map(([label, percent], index) => ({
		label,
		percent,
		color: colors[index % colors.length],
	}));
}

export default function TaskManagement({ onNavigate = () => {} }) {
	const [tasks, setTasks] = useState([]);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [metrics, setMetrics] = useState({ pending: 0, critical: 0, inProgress: 0, workforce: 0, allocation: [] });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		const query = new URLSearchParams();
		if (search.trim()) query.set("search", search.trim());
		if (filterStatus !== "ALL") query.set("status", filterStatus);

		async function loadTasks() {
			setIsLoading(true);
			setError("");
			try {
				const taskQuery = query.toString() ? `?${query.toString()}` : "";
				const [tasksResponse, metricsResponse] = await Promise.all([
					fetch(`${TASKS_API_URL}${taskQuery}`, { signal: controller.signal }),
					fetch(`${TASKS_API_URL}/metrics`, { signal: controller.signal }),
				]);
				if (!tasksResponse.ok || !metricsResponse.ok) throw new Error("Unable to load task management data.");
				const taskPayload = await tasksResponse.json();
				const metricsPayload = await metricsResponse.json();
				const records = Array.isArray(taskPayload) ? taskPayload : taskPayload.items ?? taskPayload.tasks ?? [];
				setTasks(records.map(normalizeTask));
				setMetrics({
					pending: metricsPayload.pending ?? metricsPayload.pending_count ?? 0,
					critical: metricsPayload.critical ?? metricsPayload.critical_count ?? 0,
					inProgress: metricsPayload.inProgress ?? metricsPayload.in_progress_count ?? 0,
					workforce: metricsPayload.workforce ?? metricsPayload.active_workers ?? 0,
					allocation: normalizeAllocation(metricsPayload.allocation ?? metricsPayload.labor_allocation ?? {}),
				});
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		}

		loadTasks();
		return () => controller.abort();
	}, [search, filterStatus]);

	const handleCreateTask = (newTask) => {
		setTasks((current) => [normalizeTask(newTask), ...current]);
	};

	const filteredTasks = useMemo(() => {
		const query = search.trim().toLowerCase();
		return tasks.filter((t) => {
			const matchesSearch =
				!query ||
				[t.id, t.description, t.assignedWorker, t.plantationBlock, t.priority, t.status]
					.join(" ")
					.toLowerCase()
					.includes(query);
			const matchesFilter = filterStatus === "ALL" || t.status === filterStatus;
			return matchesSearch && matchesFilter;
		});
	}, [tasks, search, filterStatus]);

	const pendingCount = metrics.pending;
	const inProgressCount = metrics.inProgress;

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header
				title="Task Management"
				crumbs={[
					{ label: "Home", href: "#" },
					{ label: "Dashboard", href: "#" },
					{ label: "Workers & Blocks", href: "#" },
				]}
			/>
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<Sidebar activeItem="tasks" role="manager" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					{error && <div role="alert" style={{ color: "var(--color-danger, #b42318)" }}>{error}</div>}
					{/* Top Header Row */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
						<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em" }}>
							Task Management
						</h1>
					</div>

					{/* Top Stats Cards & Action Row */}
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)", alignItems: "center" }}>
						{/* Card 1: Pending Tasks */}
						<div className="card" style={{ padding: "var(--space-5)", background: "var(--color-card)", border: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
							<div>
								<div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
									PENDING TASKS
								</div>
								<div style={{ fontSize: "var(--fs-3xl)", fontWeight: "var(--fw-bold)", margin: "var(--space-2) 0", color: "var(--color-text-primary)" }}>
									{pendingCount}
								</div>
								<div style={{ fontSize: "var(--fs-xs)", color: "#E53935", fontWeight: "var(--fw-medium)" }}>
									{metrics.critical} tasks flagged as critical
								</div>
							</div>
							<div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "#FFF3E0", display: "grid", placeItems: "center", color: "#E65100" }}>
								<ClipboardList size={20} />
							</div>
						</div>

						{/* Card 2: In Progress */}
						<div className="card" style={{ padding: "var(--space-5)", background: "var(--color-card)", border: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
							<div>
								<div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
									IN PROGRESS
								</div>
								<div style={{ fontSize: "var(--fs-3xl)", fontWeight: "var(--fw-bold)", margin: "var(--space-2) 0", color: "var(--color-text-primary)" }}>
									{inProgressCount}
								</div>
								<div className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>
									Across active zones
								</div>
							</div>
							<div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "#E8F5E9", display: "grid", placeItems: "center", color: "#2E7D32" }}>
								<RefreshCw size={20} />
							</div>
						</div>

						{/* Create New Task Action Button */}
						<div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
							<button
								type="button"
								onClick={() => setIsModalOpen(true)}
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
								Create New Task
							</button>
						</div>
					</div>

					{/* Main Grid: Live Queue & Labor Allocation */}
					<div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "var(--space-6)" }}>
						{/* Main Section: Live Operational Queue */}
						<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
								<h2 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>
									Live Operational Queue
								</h2>
								<div style={{ display: "flex", gap: "var(--space-2)" }}>
									<button
										type="button"
										className="btn-secondary"
										onClick={() => setIsModalOpen(true)}
										style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--fs-xs)", padding: "var(--space-2) var(--space-3)" }}
									>
										<Users size={14} />
										Assign Workers
									</button>
									<button
										type="button"
										className="btn-secondary"
										onClick={() => setFilterStatus(filterStatus === "ALL" ? "IN PROGRESS" : "ALL")}
										style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--fs-xs)", padding: "var(--space-2) var(--space-3)" }}
									>
										<Filter size={14} />
										Filter
									</button>
								</div>
							</div>

							{/* Queue Table */}
							<div className="table-responsive" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
								<table className="table-modern" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 700 }}>
									<thead>
										<tr>
											{["TASK ID", "DESCRIPTION", "ASSIGNED WORKER", "PLANTATION BLOCK", "DEADLINE", "PRIORITY", "STATUS"].map((h) => (
												<th key={h} style={{ padding: "var(--space-3) var(--space-4)", fontSize: "11px", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", background: "var(--color-hover-green)", borderBottom: "1px solid var(--color-border)" }}>
													{h}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{isLoading ? (
											<tr><td colSpan={7} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>Loading operational tasks...</td></tr>
										) : filteredTasks.length === 0 ? (
											<tr>
												<td colSpan={7} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>
													No operational tasks in queue.
												</td>
											</tr>
										) : (
											filteredTasks.map((t) => {
												let priorityBg = "#F5F5F5";
												let priorityColor = "#616161";
												if (t.priority === "CRITICAL") {
													priorityBg = "#FFEBEE";
													priorityColor = "#D32F2F";
												} else if (t.priority === "MEDIUM") {
													priorityBg = "#FFF8E1";
													priorityColor = "#F57F17";
												} else if (t.priority === "LOW") {
													priorityBg = "#F1F8E9";
													priorityColor = "#33691E";
												}

												let statusBg = "#E8EAF6";
												let statusColor = "#3F51B5";
												if (t.status === "IN PROGRESS") {
													statusBg = "#E8F5E9";
													statusColor = "#2E7D32";
												} else if (t.status === "QUEUED") {
													statusBg = "#E1F5FE";
													statusColor = "#0288D1";
												} else if (t.status === "PENDING") {
													statusBg = "#FCE4EC";
													statusColor = "#C2185B";
												} else if (t.status === "ARCHIVED") {
													statusBg = "#ECEFF1";
													statusColor = "#546E7A";
												}

												return (
													<tr key={t.id} style={{ transition: "background var(--transition-fast)" }}>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-xs)" }}>
															{t.id}
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", fontWeight: "var(--fw-medium)" }}>
															{t.description}
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--fs-xs)" }}>
															{t.assignedWorker}
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--fs-xs)" }}>
															{t.plantationBlock}
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--fs-xs)" }}>
															{t.deadline}
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
															<span style={{ padding: "3px 8px", borderRadius: "var(--radius-full)", background: priorityBg, color: priorityColor, fontSize: "10px", fontWeight: "var(--fw-bold)", letterSpacing: "0.03em" }}>
																{t.priority}
															</span>
														</td>
														<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
															<span style={{ padding: "3px 8px", borderRadius: "var(--radius-full)", background: statusBg, color: statusColor, fontSize: "10px", fontWeight: "var(--fw-bold)", letterSpacing: "0.03em" }}>
																{t.status}
															</span>
														</td>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</section>

						{/* Side Card: Labor Allocation */}
						<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", background: "var(--color-card)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<div>
								<h3 style={{ margin: 0, fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>
									Labor Allocation
								</h3>
								<div style={{ fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "2px", marginBottom: "var(--space-5)" }}>
									CROSS-FUNCTIONAL DISTRIBUTION
								</div>

								{/* Distribution Progress Bars */}
								<div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
									{(metrics.allocation.length ? metrics.allocation : [
										{ label: "Harvesting", percent: 0, color: "#1B5E20" },
										{ label: "Maintenance", percent: 0, color: "#4CAF50" },
										{ label: "Quality Check", percent: 0, color: "#81C784" },
										{ label: "Rest", percent: 0, color: "#C8E6C9" },
									]).map((item) => (
										<div key={item.label}>
											<div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-medium)", marginBottom: "4px" }}>
												<span>{item.label}</span>
												<span style={{ fontWeight: "var(--fw-bold)" }}>{item.percent}%</span>
											</div>
											<div style={{ height: "6px", width: "100%", borderRadius: "var(--radius-full)", background: "var(--color-hover-green)", overflow: "hidden" }}>
												<div style={{ height: "100%", width: `${item.percent}%`, background: item.color, borderRadius: "var(--radius-full)" }} />
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Bottom Info Box */}
							<div style={{ marginTop: "var(--space-6)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-hover-green)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
								<Users size={18} color="var(--color-primary)" />
								<div>
									<div style={{ fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
										TOTAL WORKFORCE
									</div>
									<div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>
										{metrics.workforce} Workers Active
									</div>
								</div>
							</div>
						</section>
					</div>
				</main>
			</div>

			<Footer />

			{/* Popup Modal */}
			{isModalOpen && (
				<CreateTaskModal
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleCreateTask}
				/>
			)}
		</div>
	);
}
