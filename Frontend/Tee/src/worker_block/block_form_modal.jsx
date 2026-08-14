import React from "react";
import { X } from "lucide-react";

export default function BlockFormModal({
	mode,
	formData,
	setFormData,
	onClose,
	onSubmit,
	teaVarieties,
}) {
	return (
		<div className="modal-backdrop">
			<div className="modal-card">
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
						<button type="button" className="btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn-primary">
							{mode === "edit" ? "Save Changes" : "Add Block"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}