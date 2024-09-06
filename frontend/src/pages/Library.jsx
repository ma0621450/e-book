import React, { useEffect, useState } from "react";
import { fetchPurchasedContent } from "../api/api";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Library = () => {
  const [purchasedContent, setPurchasedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await fetchPurchasedContent();
        setPurchasedContent(content);
      } catch (error) {
        setError("Error fetching purchased content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="library">
      <div className="container mt-4">
        <h1>My Library</h1>
        <div className="row">
          {purchasedContent.length > 0 ? (
            purchasedContent.map((post) => (
              <div key={post.id} className="col-md-4 mb-4">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p>No content purchased yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Library;
