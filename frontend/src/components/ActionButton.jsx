import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PurchaseModal from "./PurchaseModal";

const ActionButton = ({ postId }) => {
    const location = useLocation();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleBuyClick = () => {
        setModalOpen(true);
    };

    const isProfileRoute = () => {
        return /^\/author\/profile\/\d+$/.test(location.pathname);
    };

    return (
        <>
            {location.pathname === "/library" || isProfileRoute() ? (
                <div className="d-flex gap-4">
                    <Link
                        type="button"
                        className="btn btn-primary"
                        to={`/post/${postId}`}
                    >
                        View More
                    </Link>
                </div>
            ) : (
                <button
                    type="button"
                    className="btn btn-primary mt-2 px-5"
                    onClick={handleBuyClick}
                >
                    Buy
                </button>
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
