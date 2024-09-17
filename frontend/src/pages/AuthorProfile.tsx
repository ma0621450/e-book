import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/UserContext";
import { AuthorProfile, Post } from "../interfaces";
import {
  fetchAuthorPosts,
  fetchAuthorProfileById,
  checkPostPurchased,
} from "../api/Api";

const AuthorProfilePage: React.FC = () => {
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const authorData = await fetchAuthorProfileById(id);
          setAuthor(authorData);

          const postsData = await fetchAuthorPosts(id);

          const postsWithPurchaseStatus = await Promise.all(
            postsData.map(async (post: Post) => {
              const hasPurchased = await checkPostPurchased(post.id);
              return { ...post, hasPurchased };
            })
          );

          setPosts(postsWithPurchaseStatus);
        }
      } catch (error) {
        setError("Failed to load author data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!author) {
    return <div className="alert alert-danger">Author not found.</div>;
  }

  const isAdmin = user?.role_id === 3;

  return (
    <section className="author-profile">
      <div className="container mx-auto">
        <div className="border border-1 p-3 mt-5 d-flex flex-column align-items-center text-center">
          <div>
            <img
              className="author-img"
              height="300px"
              width="300px"
              src={`http://localhost:8000/storage/${author.pfp}`}
              alt="Author profile"
            />
          </div>
          <div>
            <h6 className="mt-4 mb-4">Author</h6>
            <p>{author.bio}</p>
          </div>
        </div>
        <div className="mt-5">
          <h4 className="text-center">Author Publications</h4>
          <div className="row mt-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="col-md-4 mb-4">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">No publications available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorProfilePage;
