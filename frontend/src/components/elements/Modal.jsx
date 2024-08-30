import React, { useState } from 'react';

const Modal = ({ title, onConfirm, onCancel }) => {
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        setShowModal(false);
        onConfirm();
    };

    const handleCancel = () => {
        setShowModal(false);
        onCancel();
    };

    return (
        <>
            {showModal && (
                <div className="absolute top-0 left-0 w-full h-[calc(100vh-20px)] flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="absolute bg-white border border-gray-300 p-4 rounded shadow">
                        <button
                            className="absolute top-0 right-0 m-1 text-gray-600 hover:text-gray-800"
                            onClick={handleCancel}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold my-2">{title}</h2>
                        <div className="flex justify-center mt-4">
                            <button
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 mr-2"
                                onClick={handleConfirm}
                            >
                                Da
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500 mr-2"
                                onClick={handleCancel}
                            >
                                Nu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
