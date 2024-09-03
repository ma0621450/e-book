import React, { useEffect, useState } from "react";
import AuthorPostCard from "../components/AuthorPostCard";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthorPublications = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/publications");
                setContent(response.data);
            } catch (error) {
                console.error("Error fetching publications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePublishToggle = (id) => {
        setContent((prevContent) =>
            prevContent.map((item) =>
                item.id === id
                    ? { ...item, is_published: !item.is_published }
                    : item
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
