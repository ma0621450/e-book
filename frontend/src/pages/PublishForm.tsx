import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById, saveContent } from "../api/Api";
import { Post } from "../interfaces";

const PublishForm = () => {
  const { id } = useParams<string>();
  const [contentId, setContentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);

  const refs = {
    title: useRef<HTMLInputElement>(null),
    body: useRef<HTMLTextAreaElement>(null),
    contentType: useRef<HTMLSelectElement>(null),
    price: useRef<HTMLInputElement>(null),
    coverImage: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        try {
          const post = await fetchPostById(id);
          setPost(post);
          if (refs.title.current) refs.title.current.value = post.title;
          if (refs.body.current) refs.body.current.value = post.body || "";
          if (refs.contentType.current)
            refs.contentType.current.value = post.type;
          if (refs.price.current)
            refs.price.current.value = post.price.toString();
        } catch (error) {
          console.error("Error fetching post for editing:", error);
        }
      };

      fetchPostData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !refs.title.current ||
      !refs.body.current ||
      !refs.contentType.current ||
      !refs.price.current ||
      !refs.coverImage.current
    ) {
      setErrors(["All form fields are required."]);
      return;
    }

    const content = {
      title: refs.title.current.value,
      body: refs.body.current.value,
      type: refs.contentType.current.value,
      price: refs.price.current.value,
    };

    const formData = new FormData();
    formData.append("title", content.title);
    formData.append("body", content.body);
    formData.append("type", content.type);
    formData.append("price", content.price);
    if (refs.coverImage.current.files && refs.coverImage.current.files[0]) {
      const file = refs.coverImage.current.files[0];
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setErrors(["Please upload a valid image (JPEG or PNG)."]);
        return;
      }
      formData.append("cover_img", file);
    }

    try {
      await saveContent(id || null, formData);
      setSuccess(
        id ? "Content updated successfully!" : "Content created successfully!"
      );
      setErrors([]);
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message]);
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
        encType="multipart/form-data"
      >
        {success && (
          <div className="alert alert-success mx-auto mt-4">{success}</div>
        )}
        {errors.length > 0 && (
          <div className="alert alert-danger mx-auto mt-4">
            {errors.map((error, index) => (
              <p style={{ whiteSpace: "pre-line" }} key={index}>
                {error}
              </p>
            ))}
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
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image
          </label>
          <input
            type="file"
            className="form-control"
            id="coverImage"
            name="cover_img"
            ref={refs.coverImage}
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
