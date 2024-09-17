import React, { useEffect, useState } from "react";
import { fetchPurchasedContent } from "../api/Api";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import { Post } from "../interfaces";

const Library = () => {
  const [purchasedContent, setPurchasedContent] = useState<Post[]>([]);
  const [filteredContent, setFilteredContent] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await fetchPurchasedContent();
        setPurchasedContent(content);
        setFilteredContent(content);
      } catch (error) {
        if (error instanceof Error) {
          setError("Error fetching purchased content: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  useEffect(() => {
    if (query) {
      const filtered = purchasedContent.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.type.toLowerCase().includes(query.toLowerCase()) ||
          post.author?.user?.username
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      setFilteredContent(filtered);
    } else {
      setFilteredContent(purchasedContent);
    }
  }, [query, purchasedContent]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section className="library">
      <div className="container mt-4">
        <h1>My Library</h1>
        <div className="row">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            placeholder="Search by title, type, or author..."
          />
          {filteredContent.length > 0 ? (
            filteredContent.map((post) => (
              <div key={post.id} className="col-md-4 mb-4">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p>Buy content first to view.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Library;
