import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { purchaseContent } from "../api/api"; // Use the separated API logic

const PurchaseModal = ({ isOpen, onClose, contentId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await purchaseContent(contentId);
      navigate("/library");
    } catch (error) {
      console.error("Error making purchase:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show"
      style={{ display: "block" }}
      aria-labelledby="modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modal-label">
              Confirm Purchase
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to purchase this content?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Buy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
