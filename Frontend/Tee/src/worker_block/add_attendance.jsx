import React, { useEffect, useState } from "react";
import { X, Clock, CheckCircle } from "lucide-react";

export const availableWorkers = [
	{ id: "TEE-0482", name: "Amara Nwosu", initials: "AN", role: "Worker", defaultBlock: "Sector A-4" },
	{ id: "TEE-0912", name: "Rohan Prasad", initials: "RP", role: "Manager", defaultBlock: "Processing Plant" },
	{ id: "TEE-0125", name: "Lila Jensen", initials: "LJ", role: "Supervisor", defaultBlock: "Sector A-1" },
	{ id: "TEE-0774", name: "Kenji Watanabe", initials: "KW", role: "Worker", defaultBlock: "Sector A-4" },
	{ id: "TEE-0341", name: "Sunil Silva", initials: "SS", role: "Worker", defaultBlock: "Sector B-2" },
	{ id: "TEE-0568", name: "Mahesh Perera", initials: "MP", role: "Worker", defaultBlock: "Sector A-3" },
	{ id: "TEE-0812", name: "K. Bandara", initials: "KB", role: "Worker", defaultBlock: "Sector C-1" },
];

export const blockOptions = [
	"Sector A-4",
	"Sector A-1",
	"Sector B-2",
	"Sector A-3",
	"Sector C-1",
	"Processing Plant",
];

function formatCurrentTime() {
	const now = new Date();
	let hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12;
	return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

export default function AddAttendanceModal({ onClose, onSubmit, selectedDate }) {
	const [workers, setWorkers] = useState(availableWorkers);
	const [selectedWorkerId, setSelectedWorkerId] = useState(availableWorkers[0].id);
	const [timeOption, setTimeOption] = useState("now"); // "now" | "custom"
	const [customTime, setCustomTime] = useState("06:00");
	const [assignedBlock, setAssignedBlock] = useState(availableWorkers[0].defaultBlock);
	const [status, setStatus] = useState("On-time");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		async function loadWorkers() {
			try {
				const response = await fetch("http://localhost:8000/api/workers", { signal: controller.signal });
				if (!response.ok) throw new Error("Unable to load workers.");
				const payload = await response.json();
				const loadedWorkers = (Array.isArray(payload) ? payload : payload.items ?? payload.workers ?? []).map((worker) => ({
					...worker,
					id: worker.id ?? worker.worker_id,
					name: worker.name ?? worker.full_name,
					initials: worker.initials ?? (worker.name ?? "?").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
					role: worker.role ?? worker.role_type ?? "Worker",
					defaultBlock: worker.defaultBlock ?? worker.default_block_id ?? "",
				}));
				if (loadedWorkers.length) {
					setWorkers(loadedWorkers);
					setSelectedWorkerId(loadedWorkers[0].id);
					setAssignedBlock(loadedWorkers[0].defaultBlock);
				}
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			}
		}
		loadWorkers();
		return () => controller.abort();
	}, []);

	const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];

	const handleWorkerChange = (e) => {
		const id = e.target.value;
		setSelectedWorkerId(id);
		const found = workers.find((w) => w.id === id);
		if (found) {
			setAssignedBlock(found.defaultBlock);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let checkInTime = "-- : --";

		if (status !== "Absent") {
			if (timeOption === "now") {
				checkInTime = formatCurrentTime();
			} else {
				// Convert HH:MM 24h format to 12h format
				if (customTime) {
					const [h, m] = customTime.split(":");
					let hours = parseInt(h, 10);
					const ampm = hours >= 12 ? "PM" : "AM";
					hours = hours % 12 || 12;
					checkInTime = `${String(hours).padStart(2, "0")}:${m} ${ampm}`;
				}
			}
		}

		setIsSubmitting(true);
		setError("");
		try {
			const response = await fetch("http://localhost:8000/api/attendance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					worker_id: selectedWorker.id,
					date: selectedDate ?? new Date().toISOString().slice(0, 10),
					check_in_time: status === "Absent" ? null : checkInTime,
					assigned_block_id: assignedBlock,
					status,
				}),
			});
			if (!response.ok) throw new Error("Unable to save attendance record.");
			onSubmit(await response.json());
			onClose();
		} catch (submitError) {
			setError(submitError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: "var(--z-modal-backdrop)", display: "grid", placeItems: "center", padding: "var(--space-4)" }}>
			<div className="modal-card" style={{ background: "var(--color-card)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "440px", padding: "var(--space-6)", boxShadow: "var(--shadow-modal)" }}>
				{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
					<h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>Add Attendance Record</h3>
					<button type="button" className="btn-icon" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
					{/* Worker ID & Name */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							SELECT WORKER ID
						</label>
						<select
							className="input-primary"
							value={selectedWorkerId}
							onChange={handleWorkerChange}
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
						>
							{workers.map((w) => (
								<option key={w.id} value={w.id}>
									{w.id} - {w.name} ({w.role})
								</option>
							))}
						</select>
					</div>

					{/* Check-in Time Option */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							CHECK-IN TIME
						</label>
						<div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
							<button
								type="button"
								onClick={() => setTimeOption("now")}
								style={{
									flex: 1,
									padding: "var(--space-2) var(--space-3)",
									borderRadius: "var(--radius-md)",
									border: "1px solid var(--color-border)",
									background: timeOption === "now" ? "var(--color-hover-green)" : "transparent",
									color: timeOption === "now" ? "var(--color-primary)" : "var(--color-text-secondary)",
									fontWeight: timeOption === "now" ? "var(--fw-bold)" : "var(--fw-medium)",
									fontSize: "var(--fs-xs)",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "6px",
								}}
							>
								<Clock size={14} />
								Current Time (Now)
							</button>
							<button
								type="button"
								onClick={() => setTimeOption("custom")}
								style={{
									flex: 1,
									padding: "var(--space-2) var(--space-3)",
									borderRadius: "var(--radius-md)",
									border: "1px solid var(--color-border)",
									background: timeOption === "custom" ? "var(--color-hover-green)" : "transparent",
									color: timeOption === "custom" ? "var(--color-primary)" : "var(--color-text-secondary)",
									fontWeight: timeOption === "custom" ? "var(--fw-bold)" : "var(--fw-medium)",
									fontSize: "var(--fs-xs)",
									cursor: "pointer",
								}}
							>
								Customize Time
							</button>
						</div>

						{timeOption === "now" ? (
							<div style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-secondary)", padding: "var(--space-2) 0" }}>
								Will log check-in at: <strong style={{ color: "var(--color-text-primary)" }}>{formatCurrentTime()}</strong>
							</div>
						) : (
							<input
								type="time"
								className="input-primary"
								value={customTime}
								onChange={(e) => setCustomTime(e.target.value)}
								style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
							/>
						)}
					</div>

					{/* Assigned Block */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							ASSIGNED BLOCK
						</label>
						<select
							className="input-primary"
							value={assignedBlock}
							onChange={(e) => setAssignedBlock(e.target.value)}
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
						>
							{blockOptions.map((blk) => (
								<option key={blk} value={blk}>{blk}</option>
							))}
						</select>
					</div>

					{/* Status */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							STATUS
						</label>
						<select
							className="input-primary"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
						>
							<option value="On-time">On-time</option>
							<option value="Late">Late</option>
							<option value="Absent">Absent</option>
						</select>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						style={{
							marginTop: "var(--space-3)",
							width: "100%",
							padding: "var(--space-3)",
							borderRadius: "var(--radius-md)",
							background: "#000000",
							color: "#FFFFFF",
							border: "none",
							fontWeight: "var(--fw-bold)",
							fontSize: "var(--fs-sm)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "var(--space-2)",
							cursor: "pointer",
						}}
					>
						<CheckCircle size={16} />
						{isSubmitting ? "SAVING..." : "Save Attendance"}
					</button>
				</form>
			</div>
		</div>
	);
}
