import React from "react";

import TokenUs from "@/assets/icons/TokenUs.png";
import Token4You from "@/assets/icons/TOK4YOU.png";

interface SignTransactionModalProps {
  projectId: string;
  selectedAmountOfTokens: number;
  onClose: () => void;
  onAccept: () => void;
}

const SignTransactionModal: React.FC<SignTransactionModalProps> = ({
  projectId,
  selectedAmountOfTokens,
  onClose,
  onAccept,
}) => {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <img src={Token4You} alt="Company Logo" className="h-14  mb-4" />
        <h2 className="text-lg font-bold mb-2">Solicitud de firma</h2>
        <p>Project ID: {projectId}</p>
        <p>Amount of Tokens: {selectedAmountOfTokens}</p>
        <div className="flex mt-4 space-x-4">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="bg-c-primaryColor text-white py-2 px-4 rounded"
            onClick={onAccept}
          >
            Firmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignTransactionModal;
