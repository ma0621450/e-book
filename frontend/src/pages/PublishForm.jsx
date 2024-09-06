import React, { useRef, useState, useEffect } from "react";
import { fetchPost, saveContent } from "../api/api";

const PublishForm = () => {
  const { id } = useParams();
  const [contentId, setContentId] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [post, setPost] = useState(null);

  const refs = {
    title: useRef(),
    body: useRef(),
    contentType: useRef(),
    price: useRef(),
  };

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        try {
          const post = await fetchPost(id);
          setPost(post);
          refs.title.current.value = post.title;
          refs.body.current.value = post.body;
          refs.contentType.current.value = post.type;
          refs.price.current.value = post.price;
        } catch (error) {
          console.error("Error fetching post for editing:", error);
        }
      };

      fetchPostData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = {
      title: refs.title.current.value,
      body: refs.body.current.value,
      type: refs.contentType.current.value,
      price: refs.price.current.value,
    };

    try {
      const response = await saveContent(id, content);
      setContentId(response.data.content.id);
      setSuccess(
        id ? "Content updated successfully!" : "Content created successfully!"
      );
      setErrors([]);
    } catch (error) {
      setErrors([error.message || "An unexpected error occurred."]);
    }
  };

  return (
    <section className="publishForm">
      <form
        className="border border-1 w-50 mx-auto p-3 m-4"
        onSubmit={handleSubmit}
      >
        {success && (
          <div className="alert alert-success mx-auto mt-4">{success}</div>
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
            ref={refs.title}
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
            ref={refs.body}
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
            ref={refs.contentType}
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
            ref={refs.price}
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
