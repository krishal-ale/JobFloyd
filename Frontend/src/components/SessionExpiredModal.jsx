import React from "react";

const SessionExpiredModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Session Expired
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Your login session expired. Please login again.
        </p>

        <button
          onClick={onClose}
          className="bg-[#0066FF] hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;