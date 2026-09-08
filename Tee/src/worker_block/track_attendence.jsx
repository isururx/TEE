import React, { useEffect, useMemo, useState } from "react";
import { Filter, Calendar, Search, Clock, Users, UserCheck, AlertTriangle, Plus } from "lucide-react";
import Header from "../common components/header.jsx";
import Footer from "../common components/footer.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import AddAttendanceModal from "./add_attendance.jsx";
import WorkerProfileForm from "./worker_profile_form.jsx";

function getInitials(name) {
	return (name ?? "?").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatCheckInTime(value) {
	if (!value) return "-- : --";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeAttendanceRecord(record) {
	const name = record.worker_name ?? record.name ?? record.worker?.name ?? "Unknown worker";
	return {
		...record,
		id: record.id,
		workerId: record.worker_id,
		name,
		initials: record.initials ?? getInitials(name),
		role: record.worker_role_type ?? record.role ?? record.role_type ?? "Worker",
		assignedBlock: record.assignedBlock ?? (record.assigned_block_id ? `Block ${record.assigned_block_id}` : "--"),
		checkInTime: record.checkInTime ?? formatCheckInTime(record.check_in_time),
		status: record.status ?? "Absent",
	};
}

export default function TrackAttendance({ onNavigate = () => {} }) {
	const [attendance, setAttendance] = useState([]);
	const [search, setSearch] = useState("");
	const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
	const [metrics, setMetrics] = useState({ active: 0, total: 0, late: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		const query = new URLSearchParams({ target_date: selectedDate });
		if (search.trim()) query.set("search", search.trim());
		if (filterStatus !== "ALL") query.set("status", filterStatus);

		async function loadAttendance() {
			setIsLoading(true);
			setError("");
			try {
				const [attendanceResponse, metricsResponse] = await Promise.all([
					fetch(`http://localhost:8000/api/attendance?${query.toString()}`, { signal: controller.signal }),
					fetch(`http://localhost:8000/api/attendance/metrics?target_date=${encodeURIComponent(selectedDate)}`, { signal: controller.signal }),
				]);
				if (!attendanceResponse.ok || !metricsResponse.ok) throw new Error("Unable to load attendance data.");
				const attendancePayload = await attendanceResponse.json();
				const metricsPayload = await metricsResponse.json();
				const records = Array.isArray(attendancePayload) ? attendancePayload : attendancePayload.items ?? attendancePayload.records ?? [];
				setAttendance(records.map(normalizeAttendanceRecord));
				setMetrics({
					active: metricsPayload.active ?? metricsPayload.active_count ?? 0,
					total: metricsPayload.total ?? metricsPayload.total_workers ?? 0,
					late: metricsPayload.late ?? metricsPayload.late_count ?? 0,
				});
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		}

		loadAttendance();
		return () => controller.abort();
	}, [selectedDate, search, filterStatus]);

	const handleAddAttendance = (newRecord) => {
		const normalizedRecord = normalizeAttendanceRecord(newRecord);
		setAttendance((current) => {
			// Replace existing record for the same worker if present, otherwise prepend
			const filtered = current.filter((item) => item.id !== normalizedRecord.id);
			return [normalizedRecord, ...filtered];
		});
	};

	const handleWorkerCreated = (newWorker) => {
		const workerName = newWorker?.name ?? newWorker?.full_name ?? "Worker";
		setSuccessMessage(`${workerName} profile registered successfully.`);
	};

	const filteredLog = useMemo(() => {
		const query = search.trim().toLowerCase();
		return attendance.filter((item) => {
			const matchesSearch =
				!query ||
				[item.name, item.id, item.role, item.assignedBlock, item.status]
					.join(" ")
					.toLowerCase()
					.includes(query);
			const matchesFilter = filterStatus === "ALL" || item.status === filterStatus;
			return matchesSearch && matchesFilter;
		});
	}, [attendance, search, filterStatus]);

	const onTimeCount = useMemo(() => attendance.filter((i) => i.status === "On-time").length, [attendance]);
	const lateCount = metrics.late;

	return (
		<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
			<Header
				title="Attendance Tracking"
				crumbs={[
					{ label: "Home", href: "#" },
					{ label: "Dashboard", href: "#" },
					{ label: "Workers & Blocks", href: "#" },
				]}
			/>
			<div style={{ display: "flex", flex: 1, minHeight: 0 }}>
				<RoleSidebar activeItem="attendance" onNavigate={onNavigate} />
				<main style={{ flex: 1, minWidth: 0, padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
					{error && <div role="alert" style={{ color: "var(--color-danger, #b42318)" }}>{error}</div>}
					{successMessage && <div role="status" style={{ color: "var(--color-success, #1b5e20)" }}>{successMessage}</div>}
					{/* Title */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
						<h1 style={{ margin: 0, fontSize: "var(--fs-2xl)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em" }}>
							Attendance Tracking
						</h1>

						<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
							<button type="button" className="btn-secondary" onClick={() => setIsWorkerModalOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
								Register Worker
							</button>
							<button
								type="button"
								onClick={() => setIsAddModalOpen(true)}
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
								Add Attendance
							</button>
						</div>
					</div>

					{/* Top Metric Cards */}
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 280px))", gap: "var(--space-4)" }}>
						{/* Current Workforce Card */}
						<div className="card" style={{ padding: "var(--space-5)", background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
							<div style={{ fontSize: "11px", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
								CURRENT WORKFORCE
							</div>
							<div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "var(--space-3)" }}>
								<span style={{ fontSize: "var(--fs-3xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>
									{metrics.active}
								</span>
								<span style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-muted)" }}>
									/ {metrics.total}
								</span>
							</div>
						</div>

						{/* Late Check-ins Card */}
						<div className="card" style={{ padding: "var(--space-5)", background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
							<div style={{ fontSize: "11px", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
								LATE CHECK-INS
							</div>
							<div style={{ fontSize: "var(--fs-3xl)", fontWeight: "var(--fw-bold)", marginTop: "var(--space-3)", color: "var(--color-text-primary)" }}>
								{lateCount}
							</div>
						</div>
					</div>

					{/* Attendance Log Section */}
					<section className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", background: "var(--color-card)" }}>
						{/* Header row */}
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
							<h2 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>
								Attendance log
							</h2>

							<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
								<div className="input-search" style={{ minWidth: 220 }}>
									<Search size={16} />
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search name, ID, role..."
									/>
								</div>

								<button
									type="button"
									className="btn-secondary"
									onClick={() => setFilterStatus(filterStatus === "ALL" ? "Late" : filterStatus === "Late" ? "Absent" : "ALL")}
									style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--fs-xs)", padding: "var(--space-2) var(--space-3)" }}
								>
									<Filter size={14} />
									Filter ({filterStatus})
								</button>

								<div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", background: "var(--color-hover-green)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", color: "var(--color-text-primary)" }}>
									<Calendar size={14} color="var(--color-primary)" />
									<input
										type="date"
										value={selectedDate}
										onChange={(e) => setSelectedDate(e.target.value)}
										style={{ background: "transparent", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit", cursor: "pointer" }}
									/>
								</div>
							</div>
						</div>

						{/* Log Table */}
						<div className="table-responsive" style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
							<table className="table-modern" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 720 }}>
								<thead>
									<tr>
										{["EMPLOYEE NAME / ID", "ROLE", "ASSIGNED BLOCK", "CHECK-IN TIME", "STATUS"].map((heading) => (
											<th
												key={heading}
												style={{
													padding: "var(--space-3) var(--space-4)",
													fontSize: "11px",
													fontWeight: "var(--fw-bold)",
													color: "var(--color-text-secondary)",
													background: "var(--color-hover-green)",
													borderBottom: "1px solid var(--color-border)",
												}}
											>
												{heading}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<tr><td colSpan={5} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>Loading attendance records...</td></tr>
									) : filteredLog.length === 0 ? (
										<tr>
											<td colSpan={5} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>
												No attendance records match the search.
											</td>
										</tr>
									) : (
										filteredLog.map((row) => {
											let statusBg = "#E8F5E9";
											let statusColor = "#2E7D32";
											if (row.status === "Late") {
												statusBg = "#FFEBEE";
												statusColor = "#D32F2F";
											} else if (row.status === "Absent") {
												statusBg = "#ECEFF1";
												statusColor = "#546E7A";
											}

											let blockBg = "#E1F5FE";
											let blockColor = "#0288D1";
											if (row.assignedBlock === "Processing Plant") {
												blockBg = "#ECEFF1";
												blockColor = "#455A64";
											}

											return (
												<tr key={row.id} style={{ transition: "background var(--transition-fast)" }}>
													{/* Employee Name / ID */}
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
														<div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
															<div
																style={{
																	width: 36,
																	height: 36,
																	borderRadius: "999px",
																	background: "var(--color-hover-green)",
																	color: "var(--color-primary)",
																	display: "grid",
																	placeItems: "center",
																	fontWeight: "var(--fw-bold)",
																	fontSize: "var(--fs-xs)",
																	border: "1px solid var(--color-border)",
																}}
															>
																{row.initials}
															</div>
															<div>
																<div style={{ fontWeight: "var(--fw-bold)", fontSize: "var(--fs-sm)", color: "var(--color-text-primary)" }}>
																	{row.name}
																</div>
																<div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
																	ID: {row.id}
																</div>
															</div>
														</div>
													</td>

													{/* Role */}
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)" }}>
														{row.role}
													</td>

													{/* Assigned Block */}
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
														<span style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", background: blockBg, color: blockColor, fontSize: "11px", fontWeight: "var(--fw-semibold)" }}>
															{row.assignedBlock}
														</span>
													</td>

													{/* Check-in Time */}
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)" }}>
														{row.checkInTime}
													</td>

													{/* Status */}
													<td style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
														<span style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: statusBg, color: statusColor, fontSize: "11px", fontWeight: "var(--fw-bold)" }}>
															{row.status}
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
				</main>
			</div>

			<Footer />

			{isAddModalOpen && (
				<AddAttendanceModal
					selectedDate={selectedDate}
					onClose={() => setIsAddModalOpen(false)}
					onSubmit={handleAddAttendance}
				/>
			)}

			{isWorkerModalOpen && (
				<WorkerProfileForm
					onClose={() => setIsWorkerModalOpen(false)}
					onCreated={handleWorkerCreated}
				/>
			)}
		</div>
	);
}
