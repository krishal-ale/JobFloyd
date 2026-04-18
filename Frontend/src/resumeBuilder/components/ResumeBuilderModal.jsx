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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[96vh] sm:h-[92vh] overflow-hidden relative flex flex-col">
        <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4 gap-3 shrink-0">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
            {title}
          </h3>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showActionBtn && (
              <button
                className="bg-[#0066FF] hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2"
                onClick={onActionClick}
              >
                {actionBtnIcon}
                <span className="hidden sm:inline">{actionBtnText}</span>
                <span className="sm:hidden">Download</span>
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

        <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderModal;