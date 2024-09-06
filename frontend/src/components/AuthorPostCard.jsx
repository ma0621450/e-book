import React, { useState } from "react";
import { Link } from "react-router-dom";
import GrantAccessModal from "./GrantAcessModal";
import { togglePublish, getUserIds, grantAccess } from "../api/api";

const AuthorPostCard = ({ content, onPublish }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFreeAccessClick = () => setModalOpen(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setEmails("");
    setError("");
    setSuccess("");
  };

  const handleTogglePublish = async () => {
    setIsLoading(true);
    setIsPublishing(!content.is_published);
    try {
      await togglePublish(content.id);
      onPublish(content.id);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setIsLoading(false);
      setIsPublishing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailArray = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    if (emailArray.length > 5) {
      setError("You cannot enter more than 5 emails.");
      return;
    }

    try {
      const data = await getUserIds(emailArray);
      if (data.errors && data.errors.length > 0) {
        setError(data.errors.join(", "));
        return;
      }

      const accessResponse = await grantAccess(data.userIds, content.id);
      if (accessResponse.errors) {
        setError(accessResponse.errors.join(", "));
        return;
      }

      setSuccess("Access granted successfully!");
      handleModalClose();
    } catch (error) {
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <div className="card shadow-sm">
      <img
        className="card-img-top"
        src="https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=1356&h=668&fit=crop"
        alt="Thumbnail"
      />
      <div className="card-body">
        <div className="card-text">
          <b>Title: </b>
          {content.title}
        </div>
        <div className="card-text">
          <b>Content Type: </b>
          {content.type}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group mx-auto mt-3 gap-2">
            <Link
              type="button"
              className="btn btn-primary rounded"
              to={`/post/${content.id}`}
            >
              View More
            </Link>
            <button
              className="btn btn-secondary rounded"
              onClick={handleFreeAccessClick}
            >
              Free Access
            </button>
            <button
              className="btn btn-secondary rounded"
              onClick={handleTogglePublish}
              disabled={isLoading}
            >
              {isLoading
                ? isPublishing
                  ? "Publishing..."
                  : "Unpublishing..."
                : content.is_published
                ? "Unpublish"
                : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <GrantAccessModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        emails={emails}
        setEmails={setEmails}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
      />
    </div>
  );
};

export default AuthorPostCard;
