import { useState, useEffect } from "react";
import { getBankTransactionsInformation } from "@/controllers/bankTransactions.controller";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirectToPath } from "@/lib/changePath";
import { useNavigate } from "react-router-dom";
import { shortenAddress } from "@/utils/stringTransformations/stringTransformations";

interface BankTransaction {
  id: number;
  userBankTransfers: UserBankTransfer; // Adjusted to specify the structure
  paymentDate: string;
  bankTransactionId: string; // Added this field
  transferredAmount: number;
  transactionHash?: string;
}

interface UserBankTransfer {
  id: number;
  walletId: string;
  bankTransferId: number;
  createdAt: string;
  updatedAt: string;
  approvedBy: string;
}

export const ListUsdToWusdPendingTransactions = () => {
  const [buyWusdtTransactions, setBuyWusdtTransactions] = useState<
    BankTransaction[]
  >([]);
  const [withdrawWusdtTransactions, setWithdrawWusdtTransactions] = useState<
    BankTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const responseBuyWusdtPendingTransactions =
          await getBankTransactionsInformation(
            "PENDING",
            "SEND_WUSD_TO_USER_WALLET"
          );

        const responseWusdtWithdrawalPendingTransactions =
          await getBankTransactionsInformation(
            "PENDING",
            "WITHDRAWAL_USD_TO_USER"
          );

        setBuyWusdtTransactions(responseBuyWusdtPendingTransactions.data);
        setWithdrawWusdtTransactions(
          responseWusdtWithdrawalPendingTransactions.data
        );
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Cargando...</div>;

  const redirectToApproveWusdtToUsdTransaction = (id: any) => {
    console.log("redirectToPath");
    redirectToPath(
      navigate,
      `/admin/bank-transaction/USDtoWUSD/approve-transaction/${id}`
    );
  };

  const redirectToApproveWusdWithdrawalTransaction = (id: any) => {
    console.log("redirectToPath");
    redirectToPath(
      navigate,
      `/admin/bank-transaction/WUSDtoUSD/approve-transaction/${id}`
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Transacciones de compra de WUSDT pendientes
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet del Usuario</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>ID de la Transacción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buyWusdtTransactions?.map((transaction) => (
            <TableRow key={transaction?.id}>
              <TableCell>
                {shortenAddress(transaction?.userBankTransfers?.walletId) ||
                  "N/A"}
              </TableCell>
              <TableCell>{transaction?.transferredAmount} USD</TableCell>
              <TableCell>
                {shortenAddress(transaction?.bankTransactionId)}
              </TableCell>
              <TableCell>
                {new Date(transaction?.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <button
                  className="text-c-primaryColor hover:underline"
                  onClick={() =>
                    redirectToApproveWusdtToUsdTransaction(transaction?.id)
                  }
                >
                  Ver detalles
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-xl mt-4 font-bold mb-4">
        Transacciones de venta de WUSDT pendientes
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet del Usuario</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>ID de la Transacción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawWusdtTransactions?.map((transaction) => (
            <TableRow key={transaction?.id}>
              <TableCell>
                {shortenAddress(transaction?.userBankTransfers?.walletId) ||
                  "N/A"}
              </TableCell>
              <TableCell>{transaction?.transferredAmount} USD</TableCell>
              <TableCell>
                {shortenAddress(transaction?.transactionHash as string)}
              </TableCell>
              <TableCell>
                {new Date(transaction?.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <button
                  className="text-c-primaryColor hover:underline"
                  onClick={() =>
                    redirectToApproveWusdWithdrawalTransaction(transaction?.id)
                  }
                >
                  Aprobar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
