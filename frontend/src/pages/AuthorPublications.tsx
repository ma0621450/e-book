import React, { useEffect, useState } from "react";
import AuthorPostCard from "../components/AuthorPostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchAuthorPublications } from "../api/Api";

interface ContentItem {
  title: string;
  type: string;
  id: number;
  cover_img: string;
  is_published: boolean;
}

const AuthorPublications: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchAuthorPublications();
        setContent(response);
      } catch (err) {
        setError("Error fetching publications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePublishToggle = (id: number) => {
    setContent((prevContent) =>
      prevContent.map((item) =>
        item.id === id ? { ...item, is_published: !item.is_published } : item
      )
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h4 className="text-center">{error}</h4>;
  }

  if (content.length === 0) {
    return <h4 className="text-center">No content found.</h4>;
  }

  return (
    <section className="author-publications">
      <div className="container">
        <div className="row mt-2">
          {content.map((item) => (
            <div key={item.id} className="col-md-4 mt-2">
              <AuthorPostCard
                content={item}
                onPublish={() => handlePublishToggle(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorPublications;
