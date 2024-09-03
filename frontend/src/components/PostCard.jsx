import React from "react";
import ActionButton from "./ActionButton";

const PostCard = ({ post }) => {
    const authorName = post?.author?.user?.username;

    return (
        <div className="card shadow-sm">
            <img
                className="card-img-top"
                src="https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=1356&h=668&fit=crop"
                alt="Thumbnail"
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
                        <ActionButton postId={post.id} />
                    </div>
                    <small className="text-body-secondary fw-bold">
                        ${post.price}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
