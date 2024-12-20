// GetInformationToBurnTokens.tsx
import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import burnTokensThirdwebFunction from "@/blockchain/burnTokensThirdwebFunction";
import {
  showSuccessAlert,
  showErrorAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import ReactDOM from "react-dom";

enum BankAccountType {
  CORRIENTE = "CORRIENTE",
  AHORRO = "AHORRO",
}

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

  return (
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
    </div>
  );
};

interface GetInformationToBurnTokensProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetInformationToBurnTokens: React.FC<GetInformationToBurnTokensProps> = ({
  isOpen,
  onClose,
}) => {
  const address = useActiveAccount();

  const [amount, setAmount] = useState<number>(0);
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    amount: number;
    transactionHash: string;
  } | null>(null);

  const resetForm = () => {
    setAmount(0);
    setBankName("");
    setAccountNumber("");
    setAccountType("");
    setNotes("");
  };

  const handleBurnTokens = async () => {
    // Validate inputs
    if (!amount || amount <= 0) {
      showErrorAlert("Por favor, ingrese una cantidad válida.");
      return;
    }

    if (!bankName || !accountNumber || !accountType) {
      showErrorAlert("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (!address) {
      showErrorAlert("Por favor, conecte su billetera.");
      return;
    }

    setIsLoading(true);
    try {
      const res: { amount: number; transactionHash: string } =
        await burnTokensThirdwebFunction({
          address: address,
          amount: amount,
          bankThatReceivedTheTransaction: bankName,
          userBankAccountNumber: accountNumber,
          userBankAccountType: accountType.toUpperCase(),
          transactionHash: "",
          notes: notes,
        });

      // Store transaction details
      setTransactionDetails({
        amount: res.amount,
        transactionHash: res.transactionHash,
      });

      showSuccessAlert("WUSDT vendido exitosamente");

      // Close the form and reset
      //onClose();
      //resetForm();
    } catch (error) {
      console.error("Error burning tokens:", error);
      showErrorAlert("Hubo un problema al vender los tokens");
    } finally {
      setIsLoading(false);
      //resetForm();
    }
  };

  if (!isOpen) return null;

  const closeAllModals = () => {
    resetForm();
    onClose();
    setTransactionDetails(null);
  };

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-white text-2xl font-bold">
                Procesando venta...
              </div>
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Vender WUSDT</h2>
              <button
                onClick={() => onClose()}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cantidad de WUSDT a vender
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese cantidad"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del Banco
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre del banco"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Número de cuenta"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Cuenta
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Seleccione un tipo de cuenta</option>
                  <option value={BankAccountType.CORRIENTE}>
                    Cuenta Corriente
                  </option>
                  <option value={BankAccountType.AHORRO}>
                    Cuenta de Ahorros
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Notas adicionales"
                />
              </div>

              <button
                onClick={handleBurnTokens}
                className="bg-c-primaryColor hover:bg-c-secondaryColor text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Vender WUSDT
              </button>
            </div>
          </div>
        </div>
      </div>

      {transactionDetails && (
        <FullscreenCustomNotificationWithReactPortal
          isOpen={true}
          onClose={() => closeAllModals()}
          title="Transacción finalizada"
          className="bg-c-primaryColor text-white"
        >
          <div className="text-center space-y-4">
            <p>
              Transacción finalizada, usted acaba de quemar{" "}
              {transactionDetails.amount} WUSDT y el administrador le enviará su
              dinero próximamente.
            </p>
            <p>
              Normalmente las transacciones bancarias se realizan en el
              transcurso de algunos días. Cuando se realice la transacción se le
              avisará con una notificación.
            </p>
            {transactionDetails.transactionHash && (
              <a
                href={`https://polygonscan.com/tx/${transactionDetails.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline !text-black"
              >
                Ver transacción en Polygonscan
              </a>
            )}
          </div>
        </FullscreenCustomNotificationWithReactPortal>
      )}
    </>,
    document.getElementById("loading-root")!
  );
};

export default GetInformationToBurnTokens;
