import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { fetchPostbyId } from "../api/Api";
import { LoadingSpinner } from "./LoadingSpinner";

interface PostAuthor {
  id: number;
  user: {
    username: string;
  };
  bio: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  author: PostAuthor;
}

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Post ID is missing.");
        return;
      }

      try {
        const response = await fetchPostbyId(id);
        setPost(response);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post.");
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <LoadingSpinner />;
  }

  return (
    <div className="post">
      <div className="container">
        <div className="row d-flex justify-content-between mt-5">
          <div className="col-8">
            <h1 className="text-decoration-underline text-center mb-5">
              {post.title}
            </h1>
            <div className="border border-1 shadow p-3 font-monospace">
              <p className="fs-5">{post.body}</p>
            </div>
          </div>
          <div
            style={{ marginTop: "97px" }}
            className="border border-1 col-3 p-3"
          >
            <div className="d-flex flex-column">
              <p>
                <b>Author: </b>
                <span>{post.author.user.username}</span>
              </p>
              <p>
                <b>Author Bio: </b>
                <span className="">{post.author.bio}</span>
              </p>
              <Link
                to={`/author/profile/${post.author.id}`}
                className="btn btn-primary mt-auto"
              >
                View Author's Profile
              </Link>
              {user && user.role_id === 2 && (
                <Link
                  to={`/author/publish/edit/${post.id}`}
                  className="btn btn-secondary mt-2"
                >
                  Edit Publication
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
