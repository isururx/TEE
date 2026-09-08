import React from "react";
import { X } from "lucide-react";

export default function BlockFormModal({
	mode,
	formData,
	setFormData,
	onClose,
	onSubmit,
	teaVarieties,
	supervisors = [],
	isSubmitting,
	error,
}) {
	return (
		<div className="modal-backdrop">
			<div className="modal-card" style={{ maxWidth: 500 }}>
				{error && <div role="alert" style={{ marginBottom: "var(--space-4)", color: "var(--color-danger, #b42318)" }}>{error}</div>}
				<div className="modal-header">
					<h3 style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", margin: 0 }}>
						{mode === "edit" ? "Edit Block Details" : "Add New Block"}
					</h3>
					<button type="button" className="btn-icon" onClick={onClose}>
						<X size={18} />
					</button>
				</div>

				<form onSubmit={onSubmit}>
					<div className="form-group">
						<label className="form-label">Block ID / Code</label>
						<input
							className="input-primary"
							placeholder="e.g. 1 or B-01"
							value={formData.id}
							onChange={(e) => setFormData((current) => ({ ...current, id: e.target.value }))}
							required
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Tea Variety</label>
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
								min="0.1"
								value={formData.area}
								onChange={(e) => setFormData((current) => ({ ...current, area: e.target.value }))}
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Planting Date</label>
							<input
								className="input-primary"
								type="date"
								value={formData.plantDate || ""}
								onChange={(e) => setFormData((current) => ({ ...current, plantDate: e.target.value }))}
							/>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">Assigned Supervisor</label>
						<select
							className="input-primary"
							value={formData.supervisorId || ""}
							onChange={(e) => setFormData((current) => ({ ...current, supervisorId: e.target.value }))}
						>
							<option value="">-- Select Field Supervisor (Optional) --</option>
							{supervisors.map((sup) => (
								<option key={sup.id} value={sup.id}>
									{sup.name} ({sup.role || "Supervisor"})
								</option>
							))}
						</select>
					</div>

					<div className="modal-footer">
						<button type="button" className="btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn-primary" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Block"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
