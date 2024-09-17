import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthors, verifyAuthor, blockUnblockUser } from "../api/Api";
import SearchBar from "../components/SearchBar";
import { User, Author } from "../interfaces";

const AdminPanel: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const csrfToken =
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authorData = await fetchAuthors();
        setAuthors(authorData);
        setFilteredAuthors(authorData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch authors.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = authors.filter(
        (author) =>
          author.user.username.toLowerCase().includes(query.toLowerCase()) ||
          author.user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAuthors(filtered);
    } else {
      setFilteredAuthors(authors);
    }
  }, [query, authors]);

  const handleVerify = async (id: string) => {
    try {
      await verifyAuthor(id);
      setAuthors(
        authors.map((author) =>
          author.id === id ? { ...author, is_verified: true } : author
        )
      );
    } catch (error) {
      console.error("Error verifying author:", error);
      setError("Error verifying author.");
    }
  };

  const handleBlockUnblock = async (id: string, isBlocked: boolean) => {
    try {
      await blockUnblockUser(id, isBlocked);
      setAuthors(
        authors.map((author) =>
          author.user.id === id
            ? {
                ...author,
                user: {
                  ...author.user,
                  deleted_at: isBlocked ? null : new Date().toISOString(),
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
      setError(`Error ${isBlocked ? "unblocking" : "blocking"} user.`);
    }
  };

  const handleViewProfile = (id: string) => {
    navigate(`/author/profile/${id}`);
  };

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="admin-panel">
      <div className="container">
        <h2>Authors</h2>
        <SearchBar
          query={query}
          setQuery={setQuery}
          placeholder="Search by username or email..."
          onSearch={() => {}} // Provide a dummy function or handle search appropriately
        />
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
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
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
                <td colSpan={5}>No authors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPanel;
