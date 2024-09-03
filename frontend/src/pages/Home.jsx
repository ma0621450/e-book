import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/content");
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <main className="hero">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="container">
                    <div className="row mt-2">
                        {posts.map((post) => (
                            <div key={post.id} className="col-md-4 mt-3">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
