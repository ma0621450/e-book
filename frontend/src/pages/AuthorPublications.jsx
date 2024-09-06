import React, { useEffect, useState } from "react";
import AuthorPostCard from "../components/AuthorPostCard";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { routes } from "../api/endpoints";
import { fetchAuthorPublications } from "../api/api";

const AuthorPublications = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetchAuthorPublications();
      setContent(response);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handlePublishToggle = (id) => {
    setContent((prevContent) =>
      prevContent.map((item) =>
        item.id === id ? { ...item, is_published: !item.is_published } : item
      )
    );
  };

  return (
    <section className="author-publications">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container">
          <div className="row mt-2">
            {content.map((item) => (
              <div key={item.id} className="col-md-4 mt-2">
                <AuthorPostCard
                  content={item}
                  onPublish={handlePublishToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AuthorPublications;
