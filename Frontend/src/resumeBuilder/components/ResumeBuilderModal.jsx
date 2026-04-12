import React from "react";
import { X } from "lucide-react";

const ResumeBuilderModal = ({
  children,
  isOpen,
  onClose,
  title,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden relative flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4 pr-20">
          <h3 className="font-bold text-lg text-gray-900 truncate">{title}</h3>

          <div className="flex items-center gap-3">
            {showActionBtn && (
              <button
                className="bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                onClick={onActionClick}
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}

            <button
              type="button"
              className="text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default ResumeBuilderModal;