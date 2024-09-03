import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Library = () => {
    const [purchasedContent, setPurchasedContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedContent = async () => {
            try {
                const response = await axios.get("/api/purchased-content");
                setPurchasedContent(response.data);
            } catch (error) {
                console.error("Error fetching purchased content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedContent();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="library">
            <div className="container mt-4">
                <h1>My Library</h1>
                <div className="row">
                    {purchasedContent.length > 0 ? (
                        purchasedContent.map((post) => (
                            <div key={post.id} className="col-md-4 mb-4">
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <p>No content purchased yet.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Library;
