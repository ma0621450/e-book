import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchContent } from "../api/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetchContent();
      setPosts(response);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="hero">
      (
      <div className="container">
        <div className="row mt-2">
          <h1>Home</h1>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="col-md-4 mt-3">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
      )
    </main>
  );
};

export default Home;
