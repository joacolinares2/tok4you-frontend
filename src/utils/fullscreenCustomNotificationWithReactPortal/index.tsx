import React from "react";
import ReactDOM from "react-dom";

interface FullscreenCustomNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FullscreenCustomNotificationWithReactPortal: React.FC<
  FullscreenCustomNotificationProps
> = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white !text-black rounded-lg shadow-xl w-full max-w-md mx-4 relative ${className}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>,
    document.getElementById("loading-root")!
  );
};

export default FullscreenCustomNotificationWithReactPortal;
