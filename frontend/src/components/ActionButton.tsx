import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PurchaseModal from "./PurchaseModal";
import { ActionButtonProps } from "../interfaces";

const ActionButton: React.FC<ActionButtonProps> = ({
  postId,
  hasPurchased,
}) => {
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleBuyClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      {location.pathname === "/" || hasPurchased ? (
        <button
          type="button"
          className="btn mt-2 px-5"
          style={{ backgroundColor: "var(--secondary-color)", color: "white" }}
          onClick={handleBuyClick}
        >
          Buy
        </button>
      ) : (
        <div className="d-flex gap-4">
          <Link
            type="button"
            className="btn btn-primary"
            to={`/post/${postId}`}
          >
            View More
          </Link>
        </div>
      )}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        contentId={String(postId)}
      />
    </>
  );
};

export default ActionButton;
