import React from "react";

const GrantAccessModal = ({
    isOpen,
    onClose,
    emails,
    setEmails,
    handleSubmit,
    error,
    success,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Grant Free Access</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="emails">Enter Emails:</label>
                                <textarea
                                    id="emails"
                                    value={emails}
                                    onChange={(e) => setEmails(e.target.value)}
                                    placeholder="Enter emails separated by commas"
                                    rows="5"
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                            >
                                Submit
                            </button>
                        </form>
                        {error && <p className="text-danger mt-2">{error}</p>}
                        {success && (
                            <p className="text-success mt-2">{success}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrantAccessModal;
