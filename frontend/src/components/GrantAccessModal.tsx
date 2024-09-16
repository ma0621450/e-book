import React from "react";

interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: string;
  setEmails: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  success?: string;
}

const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
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
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Grant Free Access</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
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
                  rows={5}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
            {error && <p className="text-danger mt-2">{error}</p>}
            {success && <p className="text-success mt-2">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantAccessModal;
