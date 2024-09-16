import React from "react";
import ActionButton from "./ActionButton";

interface Post {
  id: number;
  title: string;
  cover_img: string;
  type: string;
  price: number;
  author?: {
    user?: {
      username?: string;
    };
  };
  hasPurchased?: boolean;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const authorName = post?.author?.user?.username;

  return (
    <div className="card shadow-sm">
      <img
        height={"250px"}
        className="card-img-top"
        src={`http://localhost:8000/storage/${post.cover_img}`}
        alt={post.title}
        onError={(e) => {
          e.currentTarget.src = "path/to/placeholder-image.jpg"; // Fallback image
        }}
      />
      <div className="card-body">
        <div className="card-text">
          <b>Title: </b>
          <span>{post.title}</span>
        </div>
        <div className="card-text">
          <b>Content Type: </b>
          <span>{post.type}</span>
        </div>

        {authorName && (
          <div className="card-text">
            <b>Author: </b>
            <span>{authorName}</span>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <ActionButton
              postId={post.id}
              hasPurchased={post.hasPurchased || false}
            />
          </div>
          <small className="text-body-secondary fw-bold">${post.price}</small>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
