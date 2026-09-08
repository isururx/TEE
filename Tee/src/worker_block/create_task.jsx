import React, { useEffect, useState } from "react";
import { X, Play, Save } from "lucide-react";

const fallbackBlocks = [];
const fallbackWorkers = [];

export default function CreateTaskModal({ onClose, onSubmit, taskToEdit = null }) {
	const isEdit = Boolean(taskToEdit);

	const [description, setDescription] = useState(taskToEdit?.description ?? "");
	const [blocks, setBlocks] = useState(fallbackBlocks);
	const [blockId, setBlockId] = useState(taskToEdit?.plantation_block_id ? String(taskToEdit.plantation_block_id) : "");
	const [priority, setPriority] = useState(taskToEdit?.priority ?? "MEDIUM");
	const [workers, setWorkers] = useState(fallbackWorkers);
	const [assignedWorkers, setAssignedWorkers] = useState(taskToEdit?.worker_ids ?? []);
	const [workerInput, setWorkerInput] = useState("");
	const [deadline, setDeadline] = useState(() => {
		if (taskToEdit?.deadline && taskToEdit.deadline !== "--") {
			// deadline from backend is "Sep 14, 2023", try to parse it
			const parsed = new Date(taskToEdit.deadline);
			return isNaN(parsed.getTime()) ? new Date().toISOString().slice(0, 10) : parsed.toISOString().slice(0, 10);
		}
		return new Date().toISOString().slice(0, 10);
	});
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
				const loadedBlocks = (Array.isArray(blockPayload) ? blockPayload : blockPayload.items ?? blockPayload.blocks ?? []).map((block) => ({
					id: block.id ?? block.block_id,
					label: `Block ${block.id ?? block.block_id}`,
				}));
				if (loadedWorkers.length) setWorkers(loadedWorkers);
				if (loadedBlocks.length) {
					setBlocks(loadedBlocks);
					setBlockId(String(loadedBlocks[0].id));
				}
			} catch (loadError) {
				if (loadError.name !== "AbortError") setError(loadError.message);
			}
		}
		loadOptions();
		return () => controller.abort();
	}, []);

	const handleAddWorker = (workerId) => {
		const numericId = Number(workerId);
		if (numericId && !assignedWorkers.includes(numericId)) {
			setAssignedWorkers([...assignedWorkers, numericId]);
		}
		setWorkerInput("");
	};

	const handleRemoveWorker = (workerId) => {
		setAssignedWorkers(assignedWorkers.filter((id) => id !== workerId));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		try {
			const numericBlockId = Number(blockId);
			const url = isEdit
				? `http://localhost:8000/api/tasks/${taskToEdit.id}`
				: "http://localhost:8000/api/tasks";
			const method = isEdit ? "PUT" : "POST";
			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					description: description.trim(),
					block_id: numericBlockId || null,
					worker_ids: assignedWorkers,
					priority: priority,
					deadline: deadline ? `${deadline}T23:59:00` : null,
				}),
			});
			if (!response.ok) throw new Error(`Unable to ${isEdit ? "update" : "create"} the task.`);
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
			<div className="modal-card" style={{ background: "var(--color-card)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "550px", padding: "var(--space-6)", boxShadow: "var(--shadow-modal)" }}>
				{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
					<h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.01em" }}>
						{isEdit ? "Edit Task" : "Create New Field Task"}
					</h3>
					<button type="button" className="btn-icon" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
						<X size={20} />
					</button>
				</div>


				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
					<div>
						<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
							TASK DESCRIPTION
						</label>
						<textarea
							className="input-primary"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							required
							placeholder="Describe the field task"
							style={{ width: "100%", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-card)", color: "var(--color-text-primary)", resize: "vertical" }}
						/>
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
									<option key={blk.id} value={blk.id}>{blk.label}</option>
								))}
							</select>
						</div>

						<div>
							<label style={{ display: "block", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
								PRIORITY
							</label>
							<div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
								{["CRITICAL", "MEDIUM", "LOW"].map((p) => (
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
											background: priority === p ? (p === "CRITICAL" ? "#E53935" : p === "MEDIUM" ? "#F9A825" : "var(--color-success)") : "transparent",
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
								{assignedWorkers.map((workerId) => {
									const worker = workers.find((item) => item.id === workerId);
									const workerName = worker?.name ?? `Worker ${workerId}`;
									return (
									<span
										key={workerId}
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
										{workerName}
										<X
											size={14}
											style={{ cursor: "pointer" }}
											onClick={() => handleRemoveWorker(workerId)}
										/>
									</span>
								);
								})}
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
										.filter((w) => !assignedWorkers.includes(w.id))
										.map((w) => (
											<option key={w.id} value={w.id}>{w.name}</option>
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
					<div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
						<button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-primary)", cursor: "pointer" }}>Cancel</button>
						<button
							type="submit"
							disabled={isSubmitting}
							style={{
								flex: 2,
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
							{isEdit ? <Save size={14} /> : <Play size={14} fill="#FFFFFF" />}
							{isSubmitting ? (isEdit ? "SAVING..." : "ASSIGNING...") : (isEdit ? "SAVE CHANGES" : "ASSIGN TASK")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
