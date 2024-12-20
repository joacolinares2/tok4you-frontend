import { wusdtToken } from "@/utils/contracts";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";

import { client } from "@/client";
import { defineChain } from "thirdweb";
import {
  showSuccessAlert,
  showErrorAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import { startWithdrawalWUSDtoUsd } from "@/controllers/bankTransactions.controller";

type BurnTokensData = {
  address: any;
  amount: number; // se toma como número, pero se convierte a string antes de enviar al backend en el controller
  bankThatReceivedTheTransaction: string;
  userBankAccountNumber: string;
  userBankAccountType: string;
  transactionHash: string;
  notes?: string;
};

const burnTokensThirdwebFunction: any = async (data: BurnTokensData) => {
  const chain = defineChain(137);

  if (!data.amount || Number(data.amount) <= 0) {
    showErrorAlert("Por favor, ingrese una cantidad válida.");
    return;
  }

  try {
    //DIEGO Inicia quema de tokens
    if (data.address == undefined) {
      throw new Error("No se encontró la dirección del usuario.");
    }

    const approvalUsdt = prepareContractCall({
      contract: wusdtToken,
      method: "burn",
      params: [BigInt(Number(data.amount) * 10 ** 6)],
      gasPrice: BigInt(150000000000),
    });

    const { transactionHash: approveHashUsdt } = await sendTransaction({
      transaction: approvalUsdt,
      account: data.address,
    });

    const { transactionHash, status } = await waitForReceipt({
      client: client,
      chain: chain,
      transactionHash: approveHashUsdt,
    });

    //ENVÍO DE DATOS DE LA TRANSACCIÓN A LA BASE DE DATOS

    console.log("transactionHash", transactionHash);
    console.log("status", status);

    if (status === "success") {
      const startResponse = await startWithdrawalWUSDtoUsd({
        userWallet: data.address.address as string,
        tokenAmount: data.amount,
        usdAmount: data.amount,
        dayInWhichTheTransactionWasDone: new Date().toISOString(),
        bankThatReceivedTheTransaction: data.bankThatReceivedTheTransaction,
        userBankAccountNumber: data.userBankAccountNumber,
        userBankAccountType: data.userBankAccountType,
        transactionHash: transactionHash,
        notes: data.notes,
      });

      console.log("startResponse", startResponse);

      showSuccessAlert(
        `Transacción finalizada, usted acaba de quemar ${data.amount} Wusdt y el administrador le enviara su dinero en los próximos días`,
        { autoClose: false }
      );

      return {
        success: true,
        amount: data.amount,
        transactionHash: transactionHash,
      };
    }

    return showErrorAlert("Transacción fallida");

    //ZEUS DESPUES DE ESTO YA SE QUEMARON DE FORMA EXITOSA LOS TOKENS, DEBE APARECERLE LA INFORMACION A FRANCISCO EN EL PANDEL DE ADMINSTRDOR. FALTAIA
    //QUE USTEDES AGREGUEN 2 O 3 INPUNTS PARA QUE LA PERSONA RELLENE SU INFORMACION DEBANCO
  } catch (error) {
    console.error("Error durante la quema de tokens:", error);
    showErrorAlert(
      `Hubo un problema al realizar la transacción de quema de tokens. ${error}`,
      { autoClose: false }
    );
    //DIEGO Error al quemar tokens
  } finally {
    // Ocultar pantalla gris
    //DIEGO Finaliza quema tokens
  }
};

export default burnTokensThirdwebFunction;
