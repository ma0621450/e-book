import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthors, verifyAuthor, blockUnblockUser } from "../api/api";

const AdminPanel = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authorData = await fetchAuthors();
        setAuthors(authorData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch authors.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyAuthor(id, csrfToken);
      setAuthors(
        authors.map((author) =>
          author.id === id ? { ...author, is_verified: true } : author
        )
      );
    } catch (error) {
      console.error("Error verifying author:", error);
    }
  };

  const handleBlockUnblock = async (id, isBlocked) => {
    try {
      await blockUnblockUser(id, isBlocked, csrfToken);
      setAuthors(
        authors.map((author) =>
          author.user.id === id
            ? {
                ...author,
                user: {
                  ...author.user,
                  deleted_at: isBlocked ? null : new Date(),
                },
              }
            : author
        )
      );
    } catch (error) {
      console.error(
        `Error ${isBlocked ? "unblocking" : "blocking"} user:`,
        error
      );
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/author/profile/${id}`);
  };

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="admin-panel">
      <div className="container">
        <h2>Authors</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Blocked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {authors.length > 0 ? (
              authors.map((author) => (
                <tr key={author.user.id}>
                  <td>{author.user.username}</td>
                  <td>{author.user.email}</td>
                  <td>{author.is_verified ? "Yes" : "No"}</td>
                  <td>{author.user.deleted_at ? "Yes" : "No"}</td>
                  <td>
                    {!author.is_verified && (
                      <button
                        onClick={() => handleVerify(author.id)}
                        className="btn btn-primary me-2"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleViewProfile(author.id)}
                      className="btn btn-secondary me-2"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        handleBlockUnblock(
                          author.user.id,
                          !!author.user.deleted_at
                        )
                      }
                      className={`btn ${
                        author.user.deleted_at ? "btn-success" : "btn-danger"
                      }`}
                    >
                      {author.user.deleted_at ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No authors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPanel;
