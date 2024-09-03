import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthorProfile = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthorProfile = async () => {
            try {
                const authorResponse = await axios.get(`/api/author/${id}`);
                setAuthor(authorResponse.data);

                const postsResponse = await axios.get(
                    `/api/author/${id}/posts`
                );
                setPosts(postsResponse.data);
            } catch (error) {
                console.error(
                    "Error fetching author profile or publications:",
                    error
                );
                setError("Failed to load author data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorProfile();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <section className="author-profile">
            <div className="container mx-auto">
                <div className="border border-1 p-3 mt-5 d-flex flex-column align-items-center text-center">
                    <div>
                        <img
                            className="author-img"
                            height="300px"
                            width="300px"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/William_Shakespeare_by_John_Taylor%2C_edited.jpg/1200px-William_Shakespeare_by_John_Taylor%2C_edited.jpg"
                            alt={author.user.username}
                        />
                    </div>
                    <div>
                        <h6 className="mt-4 mb-4">{author.user.username}</h6>
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
                                <p className="text-center">
                                    No publications available.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthorProfile;
