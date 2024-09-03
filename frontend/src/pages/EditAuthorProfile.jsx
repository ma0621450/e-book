import axios from "axios";
import React, { useRef, useState, useEffect } from "react";

const EditAuthorProfile = () => {
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const bioRef = useRef();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const fetchAuthorProfile = async () => {
            const response = await axios.get("/api/author-profile");
            setIsVerified(response.data.is_verified);
            bioRef.current.value = response.data.bio;
        };

        fetchAuthorProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess([]);
        setErrors([]);
        const bio = bioRef.current.value;
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        try {
            const response = await axios.post(
                "/api/editBio",
                { bio },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );
            setSuccess("Bio Updated");
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = Object.values(
                    error.response.data.errors
                ).flat();
                setErrors(errorMessages);
            } else {
                setErrors(["An unexpected error occurred."]);
            }
        }
    };

    return (
        <section className="edit-author-profile">
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
                    <label htmlFor="bio" className="form-label">
                        Your Biography
                    </label>
                    <textarea
                        rows="8"
                        type="bio"
                        className="form-control"
                        id="bio"
                        name="bio"
                        ref={bioRef}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isVerified ? "Edit" : "Verify"}
                </button>
            </form>
        </section>
    );
};

export default EditAuthorProfile;
