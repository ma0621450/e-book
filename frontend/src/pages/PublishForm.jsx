import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PublishForm = () => {
    const { id } = useParams(); // Get the id from the URL if editing
    const [contentId, setContentId] = useState(null);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const [post, setPost] = useState(null); // For editing content

    const titleRef = useRef();
    const bodyRef = useRef();
    const contentTypeRef = useRef();
    const priceRef = useRef();

    useEffect(() => {
        if (id) {
            // Fetch content data if id is present (for editing)
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`/api/post/${id}`);
                    setPost(response.data);
                    titleRef.current.value = response.data.title;
                    bodyRef.current.value = response.data.body;
                    contentTypeRef.current.value = response.data.type;
                    priceRef.current.value = response.data.price;
                } catch (error) {
                    console.error("Error fetching post for editing:", error);
                }
            };

            fetchPost();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        const body = bodyRef.current.value;
        const contentType = contentTypeRef.current.value;
        const price = priceRef.current.value;

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        try {
            if (id) {
                // Edit existing content
                const response = await axios.put(
                    `/api/updateContent/${id}`,
                    {
                        title,
                        body,
                        type: contentType,
                        price,
                    },
                    {
                        headers: { "X-CSRF-TOKEN": csrfToken },
                    }
                );
                setSuccess("Content updated successfully!");
            } else {
                // Create new content
                const response = await axios.post(
                    "/api/createContent",
                    {
                        title,
                        body,
                        type: contentType,
                        price,
                    },
                    {
                        headers: { "X-CSRF-TOKEN": csrfToken },
                    }
                );
                setContentId(response.data.content.id);
                setSuccess("Content created successfully!");
            }
            setErrors([]);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = Object.values(
                    error.response.data.errors
                ).flat();
                setErrors(errorMessages);
            } else if (error.response && error.response.status === 403) {
                setErrors(["Author is not Verified."]);
            } else {
                setErrors(["An unexpected error occurred."]);
            }
        }
    };

    return (
        <section className="publishForm">
            <form
                className="border border-1 w-50 mx-auto p-3 m-4"
                onSubmit={handleSubmit}
            >
                {success && (
                    <div className="alert alert-success mx-auto mt-4">
                        {success}
                    </div>
                )}
                {errors.length > 0 && (
                    <div className="alert alert-danger mx-auto mt-4">
                        <ul className="mb-0">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        ref={titleRef}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">
                        Content
                    </label>
                    <textarea
                        rows={15}
                        className="form-control"
                        id="body"
                        name="body"
                        ref={bodyRef}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="contentType" className="form-label">
                        Select Content Type
                    </label>
                    <select
                        className="form-select"
                        id="contentType"
                        name="contentType"
                        ref={contentTypeRef}
                    >
                        <option value="">Choose a Content Type...</option>
                        <option value="Article">Article</option>
                        <option value="Digest">Digest</option>
                        <option value="Novel">Novel</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        Price
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        step="0.01"
                        name="price"
                        ref={priceRef}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                </button>
            </form>
        </section>
    );
};

export default PublishForm;
