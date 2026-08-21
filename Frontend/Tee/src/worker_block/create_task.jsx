import React, { useEffect, useState } from "react";
import { X, Play, Plus, UserPlus } from "lucide-react";

const taskTypes = [
	"First Flush Harvesting",
	"Irrigation Sensor Calibration",
	"Soil Acidity Sampling",
	"Pruning Quality Audit",
	"Weed Control & Fertilizer",
	"Harvest Inspection",
];

const fallbackBlocks = [
	"Block 4A - South",
	"Block 2B - West",
	"Block 7C - Central",
	"Block 1A - North",
	"Block 3B - East",
];

const fallbackWorkers = [
	"R. Silva",
	"M. Perera",
	"Arjun M.",
	"Elena R.",
	"David K.",
	"Sara L.",
	"K. Bandara",
];

export default function CreateTaskModal({ onClose, onSubmit }) {
	const [taskType, setTaskType] = useState(taskTypes[0]);
	const [blocks, setBlocks] = useState(fallbackBlocks);
	const [blockId, setBlockId] = useState(fallbackBlocks[0]);
	const [priority, setPriority] = useState("MED");
	const [workers, setWorkers] = useState(fallbackWorkers.map((name) => ({ name })));
	const [assignedWorkers, setAssignedWorkers] = useState(["R. Silva", "M. Perera"]);
	const [workerInput, setWorkerInput] = useState("");
	const [deadline, setDeadline] = useState(new Date().toISOString().slice(0, 10));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		async function loadOptions() {
			try {
				const [workersResponse, blocksResponse] = await Promise.all([
					fetch("http://localhost:8000/api/workers", { signal: controller.signal }),
					fetch("http://localhost:8000/api/blocks", { signal: controller.signal }),
				]);
				if (!workersResponse.ok || !blocksResponse.ok) throw new Error("Unable to load task assignment options.");
				const workerPayload = await workersResponse.json();
				const blockPayload = await blocksResponse.json();
				const loadedWorkers = (Array.isArray(workerPayload) ? workerPayload : workerPayload.items ?? workerPayload.workers ?? []).map((worker) => ({
					...worker,
					id: worker.id ?? worker.worker_id,
					name: worker.name ?? worker.full_name,
				}));
				const loadedBlocks = (Array.isArray(blockPayload) ? blockPayload : blockPayload.items ?? blockPayload.blocks ?? []).map((block) => block.name ?? block.block_name ?? block.id ?? block.block_id);
				if (loadedWorkers.length) setWorkers(loadedWorkers);
				if (loadedBlocks.length) {
					setBlocks(loadedBlocks);
					setBlockId(loadedBlocks[0]);
				}
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			}
		}
		loadOptions();
		return () => controller.abort();
	}, []);

	const handleAddWorker = (workerName) => {
		const trimmed = workerName.trim();
		if (trimmed && !assignedWorkers.includes(trimmed)) {
			setAssignedWorkers([...assignedWorkers, trimmed]);
		}
		setWorkerInput("");
	};

	const handleRemoveWorker = (workerName) => {
		setAssignedWorkers(assignedWorkers.filter((w) => w !== workerName));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		try {
			const response = await fetch("http://localhost:8000/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					task_type: taskType,
					plantation_block_id: blockId,
					worker_ids: assignedWorkers.map((workerName) => workers.find((worker) => worker.name === workerName)?.id).filter(Boolean),
					priority: priority === "HIGH" ? "CRITICAL" : priority === "MED" ? "MEDIUM" : "LOW",
					deadline,
				}),
			});
			if (!response.ok) throw new Error("Unable to create the task.");
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
					<h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.01em" }}>Create New Field Task</h3>
					<button type="button" className="btn-icon" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
					{/* Task Type */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							TASK TYPE
						</label>
						<select
							className="input-primary"
							value={taskType}
							onChange={(e) => setTaskType(e.target.value)}
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
						>
							{taskTypes.map((type) => (
								<option key={type} value={type}>{type}</option>
							))}
						</select>
					</div>

					{/* Grid Row: Block ID & Priority */}
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
						<div>
							<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
								BLOCK ID
							</label>
							<select
								className="input-primary"
								value={blockId}
								onChange={(e) => setBlockId(e.target.value)}
								style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
							>
								{blocks.map((blk) => (
									<option key={blk} value={blk}>{blk}</option>
								))}
							</select>
						</div>

						<div>
							<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
								PRIORITY
							</label>
							<div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
								{["HIGH", "MED", "LOW"].map((p) => (
									<button
										key={p}
										type="button"
										onClick={() => setPriority(p)}
										style={{
											flex: 1,
											padding: "var(--space-2) 0",
											fontSize: "11px",
											fontWeight: "var(--fw-bold)",
											border: "none",
											background: priority === p ? (p === "HIGH" ? "#E53935" : p === "MED" ? "#F9A825" : "var(--color-success)") : "transparent",
											color: priority === p ? "#FFFFFF" : "var(--color-text-secondary)",
											cursor: "pointer",
											transition: "background var(--transition-fast)",
										}}
									>
										{p}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Assigned Worker(s) */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							ASSIGNED WORKER(S)
						</label>
						<div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3)", minHeight: "80px", background: "var(--color-card)" }}>
							<div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
								{assignedWorkers.map((w) => (
									<span
										key={w}
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: "6px",
											padding: "4px 10px",
											borderRadius: "var(--radius-full)",
											background: "var(--color-hover-green)",
											color: "var(--color-primary)",
											fontSize: "var(--fs-xs)",
											fontWeight: "var(--fw-semibold)",
										}}
									>
										{w}
										<X
											size={14}
											style={{ cursor: "pointer" }}
											onClick={() => handleRemoveWorker(w)}
										/>
									</span>
								))}
							</div>
							<div style={{ display: "flex", gap: "var(--space-2)" }}>
								<select
									value={workerInput}
									onChange={(e) => {
										if (e.target.value) handleAddWorker(e.target.value);
									}}
									style={{ flex: 1, padding: "var(--space-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-primary)", fontSize: "var(--fs-xs)" }}
								>
									<option value="">Add worker...</option>
									{workers
										.filter((w) => !assignedWorkers.includes(w.name))
										.map((w) => (
											<option key={w.id ?? w.name} value={w.name}>{w.name}</option>
										))}
								</select>
							</div>
						</div>
					</div>

					{/* Deadline */}
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							DEADLINE
						</label>
						<input
							type="date"
							className="input-primary"
							value={deadline}
							onChange={(e) => setDeadline(e.target.value)}
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)" }}
						/>
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
							letterSpacing: "0.05em",
						}}
					>
										<Play size={14} fill="#FFFFFF" />
										{isSubmitting ? "ASSIGNING..." : "ASSIGN TASK"}
					</button>
				</form>
			</div>
		</div>
	);
}
