import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Adjust the path as necessary

const Post = () => {
    const { id } = useParams();
    const { user } = useUser(); // Get user context
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/post/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <p>Loading...</p>;

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
                        <div className="d-flex flex-column ">
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
