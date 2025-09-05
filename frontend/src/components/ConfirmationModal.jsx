import React from "react";
import "../ConfirmationModal.css";

const ConfirmationModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">{title || "Confirm Action"}</h3>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="modal-btn modal-confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal-btn modal-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
