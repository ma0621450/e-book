import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PurchaseModal = ({ isOpen, onClose, contentId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await axios.post(
                "/api/purchase",
                { content_id: contentId },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );
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
