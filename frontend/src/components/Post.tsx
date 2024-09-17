import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { fetchPostById } from "../api/Api";
import { LoadingSpinner } from "./LoadingSpinner";
import { Post as PostType } from "../interfaces";

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [post, setPost] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Post ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const postData = await fetchPostById(id);
        setPost(postData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>;
  }

  if (!post) {
    return <p className="alert alert-warning">No post found.</p>;
  }

  const author = post.author;
  const authorUsername = author?.user?.username || "Unknown";
  const authorBio = author?.bio || "No bio available";
  const authorId = author?.id;

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
                <span>{authorUsername}</span>
              </p>
              <p>
                <b>Author Bio: </b>
                <span>{authorBio}</span>
              </p>
              {authorId && (
                <Link
                  to={`/author/profile/${authorId}`}
                  className="btn btn-primary mt-auto"
                >
                  View Author's Profile
                </Link>
              )}
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
