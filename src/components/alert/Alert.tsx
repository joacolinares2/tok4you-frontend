import React from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  message: string;
  type: AlertType;
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const alertStyles = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div
      className={`flex items-center p-4 border-l-4 rounded-md ${alertStyles[type]} my-4 h-auto`}
    >
      <span>{message}</span>
    </div>
  );
};

export default Alert;
