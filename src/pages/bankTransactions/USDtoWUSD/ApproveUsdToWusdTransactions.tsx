import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import {
  approveTransaction,
  getTransactionDataById,
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
  paymentReceipt: string;
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
        <h2 className="text-lg font-bold mb-2">Recibo</h2>
        <img src={receiptUrl} alt="Recibo" className="max-w-full h-auto" />
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>,
    document.getElementById("loading-root") as HTMLElement // Asegúrate de que esto coincida con la estructura de tu aplicación
  );
};

export const ApproveUsdToWusdTransactions: React.FC = () => {
  const navigate = useNavigate();
  const activeWallet = useActiveAccount();
  const { id } = useParams<{ id: string }>();

  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [idTransactionEmittedByTheBank, setIdTransactionEmittedByTheBank] =
    useState<string>("");
  const [bankThatEmittedTheTransaction, setBankThatEmittedTheTransaction] =
    useState<string>("");
  const [bankThatReceivedTheTransaction, setBankThatReceivedTheTransaction] =
    useState<string>("");
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [userBankAccountNumber, setUserBankAccountNumber] =
    useState<string>("");
  const [userBankAccountType, setUserBankAccountType] = useState<string>("");
  const [adminBankAccountNumber, setAdminBankAccountNumber] =
    useState<string>("");
  const [adminBankAccountType, setAdminBankAccountType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [userWallet, setUserWallet] = useState<string>("");
  const [adminTransactionReceipt, setAdminTransactionReceipt] =
    useState<File | null>(null);

  const [formData, setFormData] = useState({
    dbTransactionId: 0,
    userWallet: "",
    tokenAmount: "",
    usdAmount: 0,
    idTransactionEmittedByTheBank: "",
    bankThatEmittedTheTransaction: "",
    bankThatReceivedTheTransaction: "",
    dayInWhichTheTransactionWasDone: "",
    notes: "",
    userBankAccountNumber: "",
    userBankAccountType: "",
    adminBankAccountNumber: "",
    adminBankAccountType: "",
    adminWallet: "",
  });

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

        setTransactionStatus(transaction?.status || "");
        setIdTransactionEmittedByTheBank(transaction.bankTransactionId || "");
        setBankThatEmittedTheTransaction(transaction.paymentSourceBank || "");
        setBankThatReceivedTheTransaction(
          transaction.paymentDestinationBank || ""
        );
        setUsdAmount(transaction.transferredAmount || 0);
        setTokenAmount(transaction.tokensSentToTheUser || "");
        setTransactionDate(
          transaction.paymentDate ? transaction.paymentDate.split("T")[0] : ""
        );
        setUserBankAccountNumber(transaction.userBankAccountNumber || "");
        setUserBankAccountType(transaction.userBankAccountType || "");
        setAdminBankAccountNumber(transaction.adminBankAccountNumber || "");
        setAdminBankAccountType(transaction.adminBankAccountType || "");
        setNotes(transaction.notes || "");
        setUserWallet(transaction.userBankTransfers?.walletId || "");
        setReceiptUrl(transaction.paymentReceipt || ""); // Establecer la URL del recibo

        setFormData({
          dbTransactionId: transaction.id || 0,
          userWallet: transaction.userBankTransfers?.walletId || "",
          tokenAmount: transaction.tokensSentToTheUser || "",
          usdAmount: transaction.transferredAmount || 0,
          idTransactionEmittedByTheBank: transaction.bankTransactionId || "",
          bankThatEmittedTheTransaction: transaction.paymentSourceBank || "",
          bankThatReceivedTheTransaction:
            transaction.paymentDestinationBank || "",
          dayInWhichTheTransactionWasDone: transaction.paymentDate
            ? transaction.paymentDate.split("T")[0]
            : "",
          notes: transaction.notes || "",
          userBankAccountNumber: transaction.userBankAccountNumber || "",
          userBankAccountType: transaction.userBankAccountType || "",
          adminBankAccountNumber: transaction.adminBankAccountNumber || "",
          adminBankAccountType: transaction.adminBankAccountType || "",
          adminWallet: activeWallet?.address || "",
        });

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      idTransactionEmittedByTheBank,
      bankThatEmittedTheTransaction,
      bankThatReceivedTheTransaction,
      usdAmount,
      tokenAmount,
      dayInWhichTheTransactionWasDone: transactionDate,
      userBankAccountNumber,
      userBankAccountType,
      adminBankAccountNumber,
      adminBankAccountType,
      notes,
      userWallet,
      adminTransactionReceipt: adminTransactionReceipt || undefined,
    }));
  }, [
    idTransactionEmittedByTheBank,
    bankThatEmittedTheTransaction,
    bankThatReceivedTheTransaction,
    usdAmount,
    tokenAmount,
    transactionDate,
    userBankAccountNumber,
    userBankAccountType,
    adminBankAccountNumber,
    adminBankAccountType,
    notes,
    userWallet,
    adminTransactionReceipt,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        adminWallet:
          activeWallet?.address || "0x0000000000000000000000000000000000000000",
        adminTransactionReceipt: adminTransactionReceipt,
      };

      await approveTransaction(submissionData);

      showSuccessAlert("¡Transacción aprobada con éxito!");

      navigate(
        `/admin/bank-transaction/USDtoWUSD/approve-transaction/${formData.dbTransactionId}`
      );
    } catch (error) {
      console.error("Error al aprobar la transacción", error);
      showErrorAlert("Error al aprobar la transacción");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <LayoutBars>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        Ver Recibo
      </Button>

      <ReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptUrl={receiptUrl}
      />

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
            <h2 className="text-2xl font-bold mb-4">Aprobar Transacción</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Wallet del Usuario</Label>
                <Input
                  type="text"
                  name="userWallet"
                  value={userWallet}
                  onChange={(e) => setUserWallet(e.target.value)}
                />
              </div>

              <div>
                <Label>ID de la Transacción</Label>
                <Input
                  type="text"
                  name="idTransactionEmittedByTheBank"
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
                  name="bankThatEmittedTheTransaction"
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
                  name="bankThatReceivedTheTransaction"
                  value={bankThatReceivedTheTransaction}
                  onChange={(e) =>
                    setBankThatReceivedTheTransaction(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Cantidad Transferida (USD)</Label>
                <Input
                  type="number"
                  name="usdAmount"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Tokens a Transferir</Label>
                <Input
                  type="text"
                  name="tokenAmount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
              </div>

              <div>
                <Label>Fecha de la Transacción</Label>
                <Input
                  type="date"
                  name="transactionDate"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Número de Cuenta Bancaria del Usuario</Label>
                <Input
                  type="text"
                  name="userBankAccountNumber"
                  value={userBankAccountNumber}
                  onChange={(e) => setUserBankAccountNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de Cuenta Bancaria del Usuario</Label>
                <Input
                  type="text"
                  name="userBankAccountType"
                  value={userBankAccountType}
                  onChange={(e) => setUserBankAccountType(e.target.value)}
                />
              </div>

              <div>
                <Label>Número de Cuenta Bancaria del Administrador</Label>
                <Input
                  type="text"
                  name="adminBankAccountNumber"
                  value={adminBankAccountNumber}
                  onChange={(e) => setAdminBankAccountNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de Cuenta Bancaria del Administrador</Label>
                <Input
                  type="text"
                  name="adminBankAccountType"
                  value={adminBankAccountType}
                  onChange={(e) => setAdminBankAccountType(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label>Notas</Label>
                <Textarea
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Subir Recibo de Transacción del Administrador</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAdminTransactionReceipt(file);
                  }
                }}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin-dashboard")}
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
