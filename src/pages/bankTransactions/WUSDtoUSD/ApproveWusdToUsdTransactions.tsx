import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import {
  getTransactionDataById,
  approveWUSDToUSDTransaction,
} from "@/controllers/bankTransactions.controller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LayoutBars from "@/components/LayoutBars";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import ReactDOM from "react-dom";

interface UserBankTransfer {
  id: number;
  walletId: string;
  bankTransferId: number;
  createdAt: string;
  updatedAt: string;
  approvedBy: string;
}

interface TransactionData {
  id?: number;
  userBankTransfers?: UserBankTransfer;
  tokensSentToTheUser?: string;
  transferredAmount?: number;
  bankTransactionId?: string;
  paymentSourceBank?: string;
  paymentDestinationBank?: string;
  paymentDate?: string;
  notes?: string;
  userBankAccountNumber?: string;
  userBankAccountType?: string;
  adminBankAccountNumber?: string;
  adminBankAccountType?: string;
  status?: string;
  adminPaymentReceipt?: string;
}

const ReceiptModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string;
}> = ({ isOpen, onClose, receiptUrl }) => {
  if (!isOpen) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "modal-overlay") {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">Receipt</h2>
        <img src={receiptUrl} alt="Receipt" className="max-w-full h-auto" />
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.getElementById("loading-root") as HTMLElement
  );
};

export const ApproveWUSDToUSDTransaction: React.FC = () => {
  const navigate = useNavigate();
  const activeWallet = useActiveAccount();
  const { id } = useParams<{ id: string }>();

  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [dbTransactionId, setDbTransactionId] = useState<number>(0);
  const [userWallet, setUserWallet] = useState<string>("");
  const [amountOfBurnedTokens, setAmountOfBurnedTokens] = useState<string>("");
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [idTransactionEmittedByTheBank, setIdTransactionEmittedByTheBank] =
    useState<string>("");
  const [bankThatEmittedTheTransaction, setBankThatEmittedTheTransaction] =
    useState<string>("");
  const [bankThatReceivedTheTransaction, setBankThatReceivedTheTransaction] =
    useState<string>("");
  const [dayInWhichTheTransactionWasDone, setDayInWhichTheTransactionWasDone] =
    useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [userBankAccountNumber, setUserBankAccountNumber] =
    useState<string>("");
  const [userBankAccountType, setUserBankAccountType] = useState<string>("");
  const [adminBankAccountNumber, setAdminBankAccountNumber] =
    useState<string>("");
  const [adminBankAccountType, setAdminBankAccountType] = useState<string>("");
  const [adminWallet, setAdminWallet] = useState<string>("");
  const [
    adminApprovalReceiptEmittedByTheBank,
    setAdminApprovalReceiptEmittedByTheBank,
  ] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        if (!id) {
          throw new Error("No se proporcionó ID de transacción");
        }

        const response = await getTransactionDataById(id);
        const transaction: TransactionData = response.data;

        setDbTransactionId(transaction.id || 0);
        setTransactionStatus(transaction?.status || "");
        setUserWallet(transaction.userBankTransfers?.walletId || "");
        setAmountOfBurnedTokens(transaction.tokensSentToTheUser || "");
        setUsdAmount(transaction.transferredAmount || 0);
        setIdTransactionEmittedByTheBank(transaction.bankTransactionId || "");
        setBankThatEmittedTheTransaction(transaction.paymentSourceBank || "");
        setBankThatReceivedTheTransaction(
          transaction.paymentDestinationBank || ""
        );
        setDayInWhichTheTransactionWasDone(
          transaction.paymentDate ? transaction.paymentDate.split("T")[0] : ""
        );
        setNotes(transaction.notes || "");
        setUserBankAccountNumber(transaction.userBankAccountNumber || "");
        setUserBankAccountType(transaction.userBankAccountType || "");
        setAdminBankAccountNumber(transaction.adminBankAccountNumber || "");
        setAdminBankAccountType(transaction.adminBankAccountType || "");
        setAdminWallet(activeWallet?.address || "");
        setReceiptUrl(transaction.adminPaymentReceipt || "");

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de la transacción", error);
        setError("Error al cargar los detalles de la transacción");
        setLoading(false);
        showErrorAlert("Error al cargar los detalles de la transacción");
      }
    };

    fetchTransactionData();
  }, [id, activeWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminApprovalReceiptEmittedByTheBank) {
      showErrorAlert("Please upload an approval receipt");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("dbTransactionId", dbTransactionId.toString());
      formData.append("userWallet", userWallet);
      formData.append("amountOfBurnedTokens", amountOfBurnedTokens);
      formData.append("usdAmount", usdAmount.toString());
      formData.append(
        "idTransactionEmittedByTheBank",
        idTransactionEmittedByTheBank
      );
      formData.append(
        "bankThatEmittedTheTransaction",
        bankThatEmittedTheTransaction
      );
      formData.append(
        "bankThatReceivedTheTransaction",
        bankThatReceivedTheTransaction
      );
      formData.append(
        "dayInWhichTheTransactionWasDone",
        dayInWhichTheTransactionWasDone
      );
      formData.append("notes", notes);
      formData.append("userBankAccountNumber", userBankAccountNumber);
      formData.append("userBankAccountType", userBankAccountType);
      formData.append("adminBankAccountNumber", adminBankAccountNumber);
      formData.append("adminBankAccountType", adminBankAccountType);
      formData.append("adminWallet", adminWallet);
      formData.append(
        "adminApprovalReceiptEmittedByTheBank",
        adminApprovalReceiptEmittedByTheBank
      );

      console.log("Submitting form data", formData);
      await approveWUSDToUSDTransaction(formData);

      showSuccessAlert("Transaction approved successfully!");

      navigate(
        `/admin/bank-transaction/WUSDtoUSD/approve-transaction/${dbTransactionId}`
      );
    } catch (error) {
      console.error("Failed to approve transaction", error);
      showErrorAlert("Failed to approve transaction");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdminApprovalReceiptEmittedByTheBank(e.target.files[0]);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <LayoutBars>
      {transactionStatus === "APPROVED" ? (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600">
              Transacción Aprobada
            </h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {transactionStatus}
            </span>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              Aprobar Transacción de WUSD a USD
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Wallet del Usuario</Label>
                <Input
                  type="text"
                  value={userWallet}
                  onChange={(e) => setUserWallet(e.target.value)}
                  readOnly
                />
              </div>

              <div>
                <Label>Cantidad de Tokens Quemados</Label>
                <Input
                  type="text"
                  value={amountOfBurnedTokens}
                  onChange={(e) => setAmountOfBurnedTokens(e.target.value)}
                />
              </div>

              <div>
                <Label>Cantidad en USD</Label>
                <Input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>ID de la Transacción</Label>
                <Input
                  type="text"
                  value={idTransactionEmittedByTheBank}
                  onChange={(e) =>
                    setIdTransactionEmittedByTheBank(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Banco de Origen</Label>
                <Input
                  type="text"
                  value={bankThatEmittedTheTransaction}
                  onChange={(e) =>
                    setBankThatEmittedTheTransaction(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Banco de Destino</Label>
                <Input
                  type="text"
                  value={bankThatReceivedTheTransaction}
                  onChange={(e) =>
                    setBankThatReceivedTheTransaction(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Fecha de la Transacción</Label>
                <Input
                  type="date"
                  value={dayInWhichTheTransactionWasDone}
                  onChange={(e) =>
                    setDayInWhichTheTransactionWasDone(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Número de Cuenta Bancaria del Usuario</Label>
                <Input
                  type="text"
                  value={userBankAccountNumber}
                  onChange={(e) => setUserBankAccountNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de Cuenta Bancaria del Usuario</Label>
                <Input
                  type="text"
                  value={userBankAccountType}
                  onChange={(e) => setUserBankAccountType(e.target.value)}
                />
              </div>

              <div>
                <Label>Número de Cuenta Bancaria del Administrador</Label>
                <Input
                  type="text"
                  value={adminBankAccountNumber}
                  onChange={(e) => setAdminBankAccountNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de Cuenta Bancaria del Administrador</Label>
                <Input
                  type="text"
                  value={adminBankAccountType}
                  onChange={(e) => setAdminBankAccountType(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label>Notas</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label>Subir Recibo de Aprobación</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/bank-transactions")}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="destructive">
                Aprobar Transacción
              </Button>
            </div>
          </form>
        </div>
      )}
    </LayoutBars>
  );
};
