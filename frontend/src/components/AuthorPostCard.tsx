import React, { useState } from "react";
import { Link } from "react-router-dom";
import GrantAccessModal from "./GrantAccessModal";
import { togglePublish, getUserIds, grantAccess } from "../api/Api";

interface Content {
  id: number;
  cover_img: string;
  title: string;
  type: string;
  is_published: boolean;
}

interface AuthorPostCardProps {
  content: Content;
  onPublish: (id: number) => void;
}

const AuthorPostCard: React.FC<AuthorPostCardProps> = ({
  content,
  onPublish,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFreeAccessClick = () => setModalOpen(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setEmails("");
    setError(undefined);
    setSuccess(undefined);
  };

  const handleTogglePublish = async () => {
    setIsLoading(true);
    setIsPublishing(!content.is_published);
    try {
      await togglePublish(content.id);
      onPublish(content.id);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError("Failed to toggle publish status.");
    } finally {
      setIsLoading(false);
      setIsPublishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

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
      await grantAccess(data.userIds, content.id);
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
        height="250px"
        src={`http://localhost:8000/storage/${content.cover_img}`}
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
