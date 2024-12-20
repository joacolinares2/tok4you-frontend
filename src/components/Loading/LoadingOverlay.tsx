import React from "react";
import ReactDOM from "react-dom";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = "Procesando...",
}) => {
  if (!isLoading) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <span className="text-white text-xl">{text}</span>
    </div>,
    document.getElementById("loading-root") as HTMLElement
  );
};

export default LoadingOverlay;
