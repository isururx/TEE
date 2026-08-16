import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

/* Reusable Modal Input Field Component matching index.css */
function ModalInput({ label, type = "text", value, onChange, placeholder = "", required = true }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="input-primary"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

/**
 * EditProfileModal
 * Reusable modal component for editing user profile details.
 * Used in both UserProfile.jsx and UserProfileForAdmin.jsx.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - initialData: { name, phone, address, email, ... }
 *  - onSave: (updatedData) => void
 *  - title: string (defaults to "Edit Profile")
 */
export default function EditProfileModal({
  isOpen = false,
  onClose = () => { },
  initialData = {},
  onSave = () => { },
  title = "Edit Profile",
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    ...initialData,
  });

  // Sync state whenever modal is opened or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        email: initialData.email || "",
        ...initialData,
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="section-title" style={{ margin: 0 }}>
            {title}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-col gap-sm">
          <ModalInput
            label="Full Name"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter full name"
          />
          <ModalInput
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Enter phone number"
          />
          <ModalInput
            label="Address"
            value={formData.address}
            onChange={handleChange("address")}
            placeholder="Enter address"
          />
          <ModalInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter email address"
          />

          {/* Modal Footer Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
