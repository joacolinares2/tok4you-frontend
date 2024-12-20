import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyValueWrapper from "./CopyValueWrapper";
import { shortenAddress } from "@/utils/stringTransformations/stringTransformations";
import { ExchangeUsdtToTokenus, USDT, wusdtToken } from "@/utils/contracts";
import { exchangeUsdtToTokenus } from "@/utils/contracts";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/client";
import { defineChain } from "thirdweb";
import { BuyTokenusTokenPaymentViaStripe } from "./buyTokenusTokenPaymentViaStripe/BuyTokenusTokenPaymentViaStripe";
import {
  showSuccessAlert,
  showErrorAlert,
  showDownloadAlert,
  showConfirmAlert,
  showAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import { redirectToPath } from "@/lib/changePath";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./Loading/LoadingOverlay";
import GetInformationToBurnTokens from "./burnTokens/GetInformationToBurnTokens";
interface TokenSidebarProps {
  isOpen: boolean;
  wallet: string;
  network: string;
  contract: string;
  setIsProcessing: any;
}

const TokenSidebar: React.FC<TokenSidebarProps> = ({
  isOpen,
  wallet,
  network,
  contract,
  setIsProcessing
}) => {
  const address = useActiveAccount();
  const chain = defineChain(137);

  //console.log(setIsProcessing)

  const [amount, setAmount] = useState<any>(0);
  const [burnAmount, setBurnAmount] = useState<any>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGetInformationModalOpen, setIsGetInformationModalOpen] =
    useState(false);

  const navigate = useNavigate();

  const handleSwap = async (amount: any) => {
    if (!amount || Number(amount) <= 0) {
      showErrorAlert("Por favor, ingrese una cantidad válida.");
      return;
    }

    setIsProcessing(true); // Mostrar pantalla gris
    try {
      //DIEGO Inicia swap de tokens de USDT a WUSDTs
      console.log(amount);

      if (address == undefined) {
        throw new Error("No se encontró la dirección del usuario.");
      }

      const approvalUsdt = prepareContractCall({
        contract: USDT,
        method: "approve",
        params: [ExchangeUsdtToTokenus, BigInt(Number(amount) * 10 ** 6)],
        gasPrice: BigInt(150000000000),
      });

      const { transactionHash: approveHashUsdt } = await sendTransaction({
        transaction: approvalUsdt,
        account: address,
      });

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: approveHashUsdt,
      });
      console.log("Aprovado");

      console.log("Swap USDT-Tokenus");
      const valueUSDT = BigInt(Number(amount) * 10 ** 6);
      const swapToken = prepareContractCall({
        contract: exchangeUsdtToTokenus,
        method: "swap",
        params: [valueUSDT],
        gasPrice: BigInt(150000000000),
      });

      const { transactionHash: swapHash } = await sendTransaction({
        transaction: swapToken,
        account: address,
      });

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: swapHash,
      });

      console.log("Swap realizado");
      showSuccessAlert(
        `Transacción finalizada, usted acaba de comprar ${amount} Wusdt.`,
        { autoClose: false }
      );
    } catch (error) {
      console.error("Error durante el swap:", error);
      showErrorAlert("Hubo un problema al realizar la transacción.");
      //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
    } finally {
      setIsProcessing(false); // Ocultar pantalla gris
      //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
    }
  };

  const redirectToStartBankTransferTransaction = () => {
    console.log("redirecting to start bank transfer transaction");
    redirectToPath(navigate, `/user-bank-transfer`);
  };

  const burnTokens = async (amount: any) => {
    if (!amount || Number(amount) <= 0) {
      showErrorAlert("Por favor, ingrese una cantidad válida.");
      return;
    }

    setIsProcessing(true); // Mostrar pantalla gris
    try {
      if (address == undefined) {
        throw new Error("No se encontró la dirección del usuario.");
      }
      const approvalUsdt = prepareContractCall({
        contract: wusdtToken,
        method: "burn",
        params: [BigInt(Number(amount) * 10 ** 6)],
        gasPrice: BigInt(150000000000),
      });

      const { transactionHash: approveHashUsdt } = await sendTransaction({
        transaction: approvalUsdt,
        account: address,
      });

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: approveHashUsdt,
      });

      showSuccessAlert(
        `Transacción finalizada, usted acaba de quemar ${amount} Wusdt y el administrador le enviara su dinero en los próximos días`,
        { autoClose: false }
      );

      //ZEUS DESPUES DE ESTO YA SE QUEMARON DE FORMA EXITOSA LOS TOKENS, DEBE APARECERLE LA INFORMACION A FRANCISCO EN EL PANDEL DE ADMINSTRDOR. FALTAIA
      //QUE USTEDES AGREGUEN 2 O 3 INPUNTS PARA QUE LA PERSONA RELLENE SU INFORMACION DEBANCO
    } catch (error) {
      console.error("Error durante la quema de tokens:", error);
      showErrorAlert(
        `Hubo un problema al realizar la transacción de quema de tokens. ${error}`,
        { autoClose: false }
      );
    } finally {
      setIsProcessing(false); // Ocultar pantalla gris
    }
  };

  /*   const handleBurn = async () => {
    const res = await burnTokensThirdwebFunction({
      address: address,
      amount: 23,
      bankThatReceivedTheTransaction: "Banco de Test",
      userBankAccountNumber: "123456789",
      userBankAccountType: "CHECKING",
      transactionHash: "0x1234567890",
      notes: "Notas de prueba",
    });

    console.log("res", res);
  };
 */
  return (
    <>
      {isLoading && (
        <LoadingOverlay isLoading={isLoading} text="Realizando compra..." />
      )}
      <div
        className={`w-auto h-full my-15 bg-white shadow-xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col items-start ">
          <h2 className="text-lg font-bold mb-4">Recargar WUSDT</h2>

          <Tabs defaultValue="USDT" className="w-full">
            <TabsList className="flex ">
              <TabsTrigger
                className="flex-1 p-4 h-12 flex items-center justify-start"
                value="USDT"
              >
                USDT
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 p-4 h-12 flex items-center justify-start"
                value="Transferencia"
              >
                Transferencia
              </TabsTrigger>
            </TabsList>
            <br />

            <TabsContent
              value="USDT"
              className="w-full flex flex-col justify-start"
            >
              <p className="text-center text-gray-700 mb-2 text-xs my-4">
                Ingrese la cantidad de USDTT que desea intercambiar por Wusdt.
              </p>
              <div className="mb-4 flex justify-center items-center">
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  value={amount}
                  type="number"
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm my-2"
                />
              </div>
              <button
                className="bg-c-primaryColor py-2 px-6 text-white  rounded-md hover:bg-c-secondaryColor my-2"
                onClick={() => {
                  handleSwap(amount);
                }}
              >
                Intercambiar
              </button>

              {/* {
                <div className="text-left text-orange-600 bg-orange-100 border border-orange-600 p-2 rounded-md mt-4">
                  Si hace envíos por una red que no sea Polygon, va a perder su
                  dinero.
                </div>
              } */}
            </TabsContent>

            <TabsContent
              value="Transferencia"
              className="w-full flex flex-col justify-start"
            >
              <div className="flex flex-col text-left text-gray-700 justify-center gap-2">
                <p className="text-sm text-gray-700 ">
                  Para realizar el pago, debe enviar la cantidad de dinero
                  equivalente a los tokens que quiere tener. 1 WUSDT equivale a
                  1 USDT. Es decir que si realiza una transferencia de 10 WUSDT,
                  tendrás 10 USDT en su cuenta de Tok4You.
                </p>

                <p className="text-sm text-gray-700 font-semibold">
                  Banco: nombre de banco
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  Número de cuenta bancaria: 54321
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  Tipo de cuenta: Corriente
                </p>

                <p className="text-sm text-gray-700 font-semibold">
                  Información adicional: ...
                </p>

                <button
                  onClick={() => redirectToStartBankTransferTransaction()}
                  className="bg-c-primaryColor text-white p-2 rounded hover:bg-c-secondaryColor transition-colors"
                >
                  ¡Ya hice el pago!
                </button>
              </div>
            </TabsContent>

            <TabsContent
              value="Tarjeta"
              className="w-full flex flex-col justify-start"
            >
              <div className="text-left text-gray-700">
                <BuyTokenusTokenPaymentViaStripe />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="p-6 flex flex-col justify-start ">
          <h2 className="text-lg font-bold mb-4">Vender WUSDT</h2>

          <div className="p-6 flex flex-col justify-start ">
            <button
              className="bg-c-primaryColor py-2 px-4 text-white rounded-md hover:bg-c-secondaryColor my-2"
              onClick={() => setIsGetInformationModalOpen(true)}
            >
              Vender Wusdt
            </button>
          </div>

          <GetInformationToBurnTokens
            isOpen={isGetInformationModalOpen}
            onClose={() => setIsGetInformationModalOpen(false)}
          />
        </div>
      </div>
    </>
  );
};

export default TokenSidebar;
