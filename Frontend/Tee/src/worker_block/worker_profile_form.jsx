import React, { useEffect, useMemo, useState } from "react";
import { UserPlus, Save, X } from "lucide-react";

const BLOCKS_API_URL = "http://localhost:8000/api/blocks";
const WORKERS_API_URL = "http://localhost:8000/api/workers";

const emptyForm = {
	fullName: "",
	nic: "",
	dob: "",
	address: "",
	contactNumber: "",
	email: "",
	password: "",
	assignedBlock: "",
};

function validateWorkerProfile(formData, isEdit) {
	const nicPattern = /^[A-Za-z0-9]{10,12}$/;
	const phonePattern = /^\+?[0-9]{9,15}$/;

	if (!formData.fullName.trim()) return "Worker name is required.";
	if (!nicPattern.test(formData.nic.trim())) return "NIC must be 10 to 12 letters or numbers.";
	if (!formData.dob) return "Date of birth is required.";
	if (!formData.address.trim()) return "Address is required.";
	if (!phonePattern.test(formData.contactNumber.trim())) return "Contact number must be 9 to 15 digits.";
	if (!formData.email.trim()) return "Email is required.";
	if (!isEdit && !formData.password.trim()) return "Password is required.";

	const selectedDate = new Date(formData.dob);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (selectedDate >= today) return "Date of birth must be in the past.";

	return "";
}

/**
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} [props.onCreated] - called after successful create with the new worker object
 * @param {Function} [props.onUpdated] - called after successful edit with the updated worker object
 * @param {Object|null} [props.workerToEdit] - when provided, form operates in edit mode
 */
export default function WorkerProfileForm({ onClose, onCreated, onUpdated, workerToEdit = null }) {
	const isEdit = Boolean(workerToEdit);

	const [formData, setFormData] = useState(() => {
		if (isEdit && workerToEdit) {
			return {
				fullName: workerToEdit.name ?? "",
				nic: String(workerToEdit.NIC ?? ""),
				dob: workerToEdit.dob ?? "",
				address: workerToEdit.address ?? "",
				contactNumber: String(workerToEdit.phone_num ?? ""),
				email: workerToEdit.email ?? "",
				password: "",
				assignedBlock: workerToEdit.assigned_block != null ? String(workerToEdit.assigned_block) : "",
			};
		}
		return emptyForm;
	});

	const [blocks, setBlocks] = useState([]);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const maxDob = useMemo(() => new Date().toISOString().slice(0, 10), []);

	// Load blocks for block assignment dropdown
	useEffect(() => {
		async function loadBlocks() {
			try {
				const response = await fetch(BLOCKS_API_URL);
				if (response.ok) {
					const data = await response.json();
					const list = Array.isArray(data) ? data : data.blocks ?? data.items ?? [];
					setBlocks(list);
				}
			} catch {
				// Non-blocking fallback
			}
		}
		loadBlocks();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const validationMessage = validateWorkerProfile(formData, isEdit);
		if (validationMessage) {
			setError(validationMessage);
			return;
		}

		setError("");
		setIsSubmitting(true);

		// Clean numeric NIC and phone_num for BigInt DB fields
		const cleanNic = formData.nic.replace(/\D/g, "") || "0";
		const cleanPhone = formData.contactNumber.replace(/\D/g, "") || "0";

		const payload = {
			name: formData.fullName.trim(),
			email: formData.email.trim(),
			phone_num: Number(cleanPhone) || formData.contactNumber.trim(),
			NIC: Number(cleanNic) || formData.nic.trim(),
			dob: formData.dob,
			address: formData.address.trim(),
			assigned_block: formData.assignedBlock ? Number(formData.assignedBlock) : null,
		};

		// Include password only if provided; in edit mode it's optional
		if (formData.password.trim()) {
			payload.password = formData.password;
		} else if (!isEdit) {
			payload.password = formData.password;
		}

		try {
			const url = isEdit ? `${WORKERS_API_URL}/${workerToEdit.id}` : WORKERS_API_URL;
			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				throw new Error(errData.detail || `Unable to ${isEdit ? "update" : "register"} worker profile.`);
			}

			const savedWorker = await response.json();
			if (isEdit) {
				onUpdated?.(savedWorker);
			} else {
				onCreated?.(savedWorker);
			}
			onClose();
		} catch (submitError) {
			setError(submitError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: "var(--z-modal-backdrop)", display: "grid", placeItems: "center", padding: "var(--space-4)" }}>
			<div className="modal-card" style={{ width: "100%", maxWidth: 560, maxHeight: "calc(100vh - 32px)", overflowY: "auto", padding: "var(--space-6)" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
					<div>
						<h3 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>
							{isEdit ? "Edit Worker Profile" : "Worker Profile Registration"}
						</h3>
						<p className="text-muted" style={{ margin: "var(--space-1) 0 0", fontSize: "var(--fs-sm)" }}>
							{isEdit ? "Update worker details & block assignment" : "Register field worker details & assign block"}
						</p>
					</div>
					<button type="button" className="btn-icon" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
						<X size={20} />
					</button>
				</div>

				{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}

				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
					<div>
						<label className="form-label">Worker ID</label>
						<input className="input-primary" value={isEdit ? `#${workerToEdit.id}` : "Auto-generated (Identity BigInt)"} disabled />
					</div>

					<div>
						<label className="form-label">Full Name</label>
						<input className="input-primary" placeholder="e.g. Sunil Perera" value={formData.fullName} onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))} required />
					</div>

					<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-3)" }}>
						<div>
							<label className="form-label">NIC Number</label>
							<input className="input-primary" value={formData.nic} onChange={(event) => setFormData((current) => ({ ...current, nic: event.target.value }))} placeholder="e.g. 199512345678" required />
						</div>
						<div>
							<label className="form-label">Date of Birth (DOB)</label>
							<input className="input-primary" type="date" max={maxDob} value={formData.dob} onChange={(event) => setFormData((current) => ({ ...current, dob: event.target.value }))} required />
						</div>
					</div>

					<div>
						<label className="form-label">Residential Address</label>
						<textarea className="input-primary" placeholder="Enter residential address" value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} rows={2} required style={{ resize: "vertical" }} />
					</div>

					<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-3)" }}>
						<div>
							<label className="form-label">Contact Number</label>
							<input className="input-primary" type="tel" value={formData.contactNumber} onChange={(event) => setFormData((current) => ({ ...current, contactNumber: event.target.value }))} placeholder="e.g. 0771234567" required />
						</div>
						<div>
							<label className="form-label">Email Address</label>
							<input className="input-primary" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder="e.g. sunil@estate.lk" required />
						</div>
					</div>

					<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-3)" }}>
						<div>
							<label className="form-label">Assigned Plantation Block</label>
							<select
								className="input-primary"
								value={formData.assignedBlock}
								onChange={(event) => setFormData((current) => ({ ...current, assignedBlock: event.target.value }))}
							>
								<option value="">-- Unassigned --</option>
								{blocks.map((blk) => (
									<option key={blk.id} value={blk.id}>
										Block {blk.id} ({blk.tea_variety || blk.variety || "Tea Block"})
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="form-label">
								Account Password{isEdit ? " (leave blank to keep current)" : ""}
							</label>
							<input
								className="input-primary"
								type="password"
								placeholder={isEdit ? "Leave blank = no change" : "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
								value={formData.password}
								onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
								required={!isEdit}
							/>
						</div>
					</div>

					<div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
						<button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
						<button type="submit" className="btn-primary" disabled={isSubmitting} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
							{isEdit ? <Save size={16} /> : <UserPlus size={16} />}
							{isSubmitting ? (isEdit ? "Saving..." : "Registering...") : (isEdit ? "Save Changes" : "Register Worker")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

