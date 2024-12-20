import React from "react";
import { Copy } from "lucide-react";
import {
  showSuccessAlert,
  showErrorAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";

interface CopyValueWrapperProps {
  valueToCopy: string;
  children: React.ReactNode;
}

const CopyValueWrapper: React.FC<CopyValueWrapperProps> = ({
  valueToCopy,
  children,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      showSuccessAlert("Valor copiado al portapapeles");
    } catch (error) {
      showErrorAlert("Error al copiar el valor");
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="flex items-center space-x-2 max-w-[70%] cursor-pointer"
    >
      {children}
    </div>
  );
};

export default CopyValueWrapper;
