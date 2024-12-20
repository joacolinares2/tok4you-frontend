import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { formatDate } from "@/utils/formatDate/formatDate";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ShareModal from "./ShareModal";
import ProgressBar from "@/components/progressBar/ProgressBar";
import SimpleCarousel from "@/components/simpleCarousel/simpleCarousel";
import { Helmet } from "react-helmet-async";
import {
  showSuccessAlert,
  showErrorAlert,
  showDownloadAlert,
  showConfirmAlert,
  showAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import {
  sendDataToSignTheTransaction,
  sendTransactionToken,
} from "@/controllers/projects.controller";
import { hashMessage, signMessage } from "thirdweb/utils";
import SignTransactionModal from "@/components/signTransactionModal/SignTransactionModal";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import DownloadStampingInvestmentCertificate from "./DownloadStampingInvestmentCertificate";

import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/client";
import { defineChain } from "thirdweb";
import {
  ExchangeAddress,
  WUsdtTokenAddress,
  wusdtToken,
} from "@/utils/contracts";
import { Exchange } from "@/utils/contracts";
import { bigint } from "zod";
import { ethers } from "ethers";
import { tokenABI } from "@/abis/tokenABI";
import { identityRegistryABI } from "@/abis/IdentityRegistryABI";
import { shortenAddress } from "@/utils/stringTransformations/stringTransformations";
import { set } from "react-hook-form";
import { tokenusABI } from "@/abis/tokenUsAbi";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ProjectCardProps {
  category: string;
  projectName: string;
  owner: string;
  shortDescription: string;
  projectId: string;
  priceForEachToken: string;
  mainImage: string;
  images: string[];
  supplyTotal: number;
  valorTotal: number;
  projectTrexToken: string;
  tokenSymbol: string;
  financials?: any;
  dates?: [
    {
      pre_launch: string;
      launch?: string;
      token_claim_date?: string;
      finalized?: string;
    }
  ];
}

const ProjectDetailsCard: React.FC<ProjectCardProps> = ({
  category,
  projectName,
  owner,
  shortDescription,
  projectId,
  priceForEachToken,
  mainImage,
  images,
  projectTrexToken,
  tokenSymbol,
  financials,
  dates,
}) => {
  const [selectedAmountOfTokens, setSelectedAmountOfTokens] = useState(0);
  const [firstDataResponse, setFirstDataResponse] = useState<any>(null);
  const [idTransaction, setIdTransaction] = useState(null);
  const [signature, setSignature] = useState(null);
  const [acceptedBuy, setAcceptedBuy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateDownloadLink, setCertificateDownloadLink] = useState("");
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const address = useActiveAccount();
  const account = useActiveAccount() as any;
  const accountBalance = 100;
  const tokensSoldAmount = 15000;
  const pricePerToken = parseFloat(priceForEachToken);
  const totalPrice = (pricePerToken * selectedAmountOfTokens).toFixed(2);
  const walletProvider = localStorage.getItem("thirdweb:connected-wallet-ids");
  const [showTokenSelectError, setShowTokenSelectError] = useState(false);
  const [isKYCCompleted, setIsKYCCompleted] = useState(true);
  const [isRegisterCompleted, setIsRegisterCompleted] = useState(true);
  const canBuy =
    address?.address &&
    isKYCCompleted &&
    isRegisterCompleted &&
    selectedAmountOfTokens !== 0 &&
    projectTrexToken; // Determina si puede comprar

  //ESTE ES EL TOKEN DE TREX DEL PROYECTO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  console.log("projectTrexToken  " + projectTrexToken);

  const chain = defineChain(137);

  const handleBuy = async () => {
    //DIEGO Inicia compra de token de proyecto
    if (!canBuy) {
      if (!address?.address) {
        showErrorAlert("Debes conectar tu wallet para comprar.");
      }
      if (!isKYCCompleted) {
        showErrorAlert("Completa el KYC para continuar.");
      }
      if (!isRegisterCompleted) {
        showErrorAlert("Debe registrarse para continuar.");
      }
      if (selectedAmountOfTokens === 0) {
        setShowTokenSelectError(true);
        showAlert(
          "warning",
          "Por favor selecciona la cantidad de tokens antes de continuar."
        );
      }

      return;
    }

    //FIX
    //VERIFICA EL BALANCE SUFICIENTE, SI NO TIENE LE DA ERROR
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com/"
    );

    const contract = new ethers.Contract(
      WUsdtTokenAddress,
      tokenusABI,
      provider
    );

    const balance = await contract.balanceOf(address?.address);
    const formattedBalance = Number(balance) / 1e6;

    console.log("Balance Usuario: ", formattedBalance);
    console.log(
      "Balance necesraio: ",
      Number(selectedAmountOfTokens) * pricePerToken
    );

    if (Number(selectedAmountOfTokens) * pricePerToken > formattedBalance) {
      showErrorAlert("No cuenta con Wusdt suficiente");
      return;
    }

    const confirmed = await showConfirmAlert(accountBalance, totalPrice);

    if (confirmed) {
      showAlert("info", "Procesando tu compra...");
      setIsLoading(true);
      //const response = await sendDataToSignTheTransaction()

      try {
        //1. se envian datos al backend, los manda a stamping, devuelve {data y nonce} y esos datos se usan en thirdweb para ejecutar la firma

        console.log("walletAddress", address?.address);
        console.log("selected amount", selectedAmountOfTokens);

        //TODO: NO puede iniciar la transaccion si no tiene billetera conectada
        //TODO NO puede iniciar la transaccion si no tiene suficiente balance

        // const response = await sendDataToSignTheTransaction({
        //   walletAddress: address?.address as string,
        //   amount: selectedAmountOfTokens, // no se multiplica por 100 aqui, eso lo hace el backend antes de hacer la peticion a stamping
        // });

        // console.log("1. data que viene de stamping y backend", response);          COMENTADO JOAQUIN, DESPUES ZEUS O DIEGO DESCOMENTAR LO SAQUE PARA VIDEO

        // //si hay datos correctos del back, pasa a abrir nuestro componente de firma
        // //console.log("response.data", response);
        // setFirstDataResponse(response);
        // setAcceptedBuy(true);

        //PARTE JOACO
        //2. si hay data y nonce, se ejecuta la firma/compra con thirdweb o lo que sea, si no, se muestra un error

        ///////////////

        if (address) {
          try {
            console.log("INICIA");

            const ownerAdd = "0xc8171459C660257E80bABfa891cB2dff3BD0C34B";

            const provider = new ethers.providers.JsonRpcProvider(
              "https://polygon-rpc.com"
            );

            // Reemplaza 'your-private-key' con tu clave privada real
            const privateKey: any = import.meta.env.VITE_API_ADMIN;
            const deployer = new ethers.Wallet(privateKey, provider);

            const tokenContract = new ethers.Contract(
              projectTrexToken,
              tokenABI,
              deployer
            );

            const userAddress = address?.address;

            console.log("Viendo el address de indentity vinculada al token...");
            const addIndetity = await tokenContract.identityRegistry();
            console.log("Add Indetity:", addIndetity);

            const identityRegistry = new ethers.Contract(
              addIndetity,
              identityRegistryABI,
              deployer
            );

            //ACA ARRANCA LO NUEVO
            //ACA ARRANCA LO NUEVO
            //ACA ARRANCA LO NUEVO
            //ACA ARRANCA LO NUEVO
            //ACA ARRANCA LO NUEVO
            //ACA ARRANCA LO NUEVO

            // AGREGAR AGENTE OWNER AL IDENTITY
            console.log("Agregando agente ADMIN al IDENTITY...");
            console.log("Is Agent:", await identityRegistry.isAgent(ownerAdd));
            if (!(await identityRegistry.isAgent(ownerAdd))) {
              console.log("Register Agent...");
              const addAgentOwner = await identityRegistry.addAgent(ownerAdd, {
                gasPrice: BigInt(300000000000),
              });
              await addAgentOwner.wait();
              console.log("Agente registrado:", addAgentOwner);
            } else {
              console.log("Agente ya registrado");
            }

            // AGREGAR AGENTE EXCHANGE AL TOKEN // ESTARIA BUENO QUE FUNCIONE DESED SCRIPT DE CREACION
            console.log("Agregando agente Exchange al token...");
            console.log(await tokenContract.isAgent(ExchangeAddress));
            if (!(await tokenContract.isAgent(ExchangeAddress))) {
              console.log("Register Agent...");
              // eslint-disable-next-line max-len, max-len, max-len
              const addAgent = await tokenContract.addAgent(ExchangeAddress, {
                gasPrice: BigInt(300000000000),
              });
              await addAgent.wait();
              console.log("Agente registrado:", addAgent);
            } else {
              console.log("Agente ya registrado");
            }

            // ACA TERMINA
            // ACA TERMINA
            // ACA TERMINA
            // ACA TERMINA
            // ACA TERMINA
            // ACA TERMINA
            // ACA TERMINA

            if (!(await identityRegistry.isVerified(userAddress))) {
              console.log("Register Identity...");
              // eslint-disable-next-line max-len, max-len, max-len
              const registerIdentity = await identityRegistry.registerIdentity(
                userAddress,
                addIndetity,
                0,
                {
                  gasPrice: BigInt(300000000000),
                }
              );
              await registerIdentity.wait();
              console.log("Identidad registrada:", registerIdentity);
            } else {
              console.log("Identidad ya registrada");
            }

            // APROVE
            const approvalToken = prepareContractCall({
              contract: wusdtToken,
              method: "approve",
              params: [ExchangeAddress, BigInt(Number(1000000) * 10 ** 6)],
              gasPrice: BigInt(300000000000),
            });

            const { transactionHash: approveHash } = await sendTransaction({
              transaction: approvalToken,
              account: address,
            });

            await waitForReceipt({
              client: client,
              chain: chain,
              transactionHash: approveHash,
            });
            console.log("Aprovado");

            const value = BigInt(Number(selectedAmountOfTokens) * 10 ** 6);

            console.log("COMPRANDOOO");
            const buyToken = prepareContractCall({
              contract: Exchange,
              method: "buyTokens",
              params: [value, projectTrexToken], // RECIBIR ESTE VALOR DEL TOKEN DESDE BACK DEPENDIENDO EL PROYECTO
              gasPrice: BigInt(300000000000),
            });

            const { transactionHash: buyHash } = await sendTransaction({
              transaction: buyToken,
              account: address,
            });

            await waitForReceipt({
              client: client,
              chain: chain,
              transactionHash: buyHash,
            });
            console.log("Aprovado");
            showSuccessAlert("Compra realizada con exito!");
          } catch (error) {
            console.log("ERORR!!!!!");
            console.log(error);
            showErrorAlert(
              "Hubo un error en compra, porfavor comuniquese con soporte"
            );
            //DIEGO Error al compra de token de proyecto
          } finally {
            setIsLoading(false);
            //DIEGO Termina la compra de token de proyecto
          }
        }
      } catch (error) {
        showErrorAlert("Error inicializando la transaccion.");
      }
    }
  };

  //si se acepta en nuestro modal de firma, se ejecuta la transaccion
  const handleAccept = async () => {
    setAcceptedBuy(false);
    try {
      if (firstDataResponse) {
        console.log("firstDataResponse", firstDataResponse.data);
        //console.log(hashMessage(firstDataResponse.data));
        const sign = async (firstDataResponse: any) => {
          const sign = signMessage({
            message: firstDataResponse.data,
            account,
          });
          //console.log( sign);
          return sign;
        };

        const signResponse = await sign(firstDataResponse);

        console.log(
          "Aquí solo queda enviar al backend la informacion de la transaccion del segundo paso"
        );
        //TODO: enviar signResponse a backend para ejecutar la transaccion
        console.log("2. Se firmó y esta es la firma", signResponse);

        let response = null;
        if (signResponse.length > 0 && firstDataResponse) {
          setIsLoading(true);
          try {
            response = await sendTransactionToken({
              idtransaction: firstDataResponse?.idtransaction as string,
              signature: signResponse,
              projectId: projectId,
              walletAddress: address?.address as string,
            });
          } catch (error) {
            console.error("Error sending transaction token:", error);
            // Handle the error appropriately
          } finally {
            setIsLoading(false);
          }
        }

        if (response?.pdfLink && response?.pdfLink?.length > 0) {
          console.log("response", response);
          showSuccessAlert(
            `Transacción finalizada con éxito, invertiste en ${projectName} comprando ${selectedAmountOfTokens} tokens.`,
            { autoClose: false }
          );

          // Open modal for certificate download
          setCertificateDownloadLink(response.pdfLink);
          setShowCertificateModal(true);

          setAcceptedBuy(false);
          return;
        } else if (
          response?.status === 401 ||
          response?.status === 400 ||
          response?.status === 403 ||
          response?.status === 502 ||
          response?.status === 500
        ) {
          showErrorAlert("Error en el envío de la firma de la transacción.");
          return;
        }
      } else {
        showErrorAlert(
          "Falló la inicialización de la transacción. Recargue la página, conécte su billetera con Thirdweb e intente nuevamente por favor.",
          { autoClose: false }
        );
        return;
      }
    } catch (error) {
      showErrorAlert(
        "Error de servidor al confirmar la transaccion. Recargue la página, conécte su billetera con Thirdweb e intente nuevamente por favor. Si el error persiste, comuníquese con el equipo de soporte."
      );
    }
  };

  const addToken = async () => {
    const tokenAddress = projectTrexToken;
    const tokenSymbolVar = tokenSymbol;
    const tokenDecimals = 6;
    const tokenImage = ""; // Imagen del token

    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbolVar,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });

        if (wasAdded) {
          console.log("Token added successfully!");
        } else {
          console.log("Token addition was not confirmed.");
        }
      } else {
        console.log(
          "Ethereum object is not available. Make sure MetaMask is installed."
        );
      }
    } catch (error) {
      console.log("Error adding token:", error);
    }
  };

  useEffect(() => {
    console.log(walletProvider);
    if (walletProvider == `["io.metamask"]`) {
      setIsMetamaskConnected(true);
    }
  }, [walletProvider]);

  return (
    <>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <section
        key={projectId + Math.random()}
        className="relative flex flex-col lg:w-[100%] h-max-[80dvh] lg:h-max-[56dvh] 2xl:h-max-[50dvh] lg:items-center lg:justify-center lg:flex-row lg:gap-4 bg-white overflow-y-visible"
      >
        <Helmet>
          <title>{projectName || "Project Detail"}</title>
          <link
            rel="canonical"
            href={`https://tokenus-frontend-ew9ds4a0u-matias-s-projects-9f48dba8.vercel.app/project-detail/${projectId}`}
          />
          <meta property="og:title" content={projectName || "Project Detail"} />
          <meta
            property="og:description"
            content={shortDescription || "No description available."}
          />
          <meta
            property="og:image"
            content={mainImage || "default-image-url.jpg"}
          />
          <meta
            property="og:url"
            content={`https://tokenus-frontend-ew9ds4a0u-matias-s-projects-9f48dba8.vercel.app/project-detail/${projectId}`}
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={projectName || "Project Detail"}
          />
          <meta
            name="twitter:description"
            content={shortDescription || "No description available."}
          />
          <meta
            name="twitter:image"
            content={mainImage || "default-image-url.jpg"}
          />
          <meta
            name="twitter:url"
            content={`https://tokenus-frontend-ew9ds4a0u-matias-s-projects-9f48dba8.vercel.app/project-detail/${projectId}`}
          />
        </Helmet>

        <div className="absolute top-4 right-4">
          <ShareModal />
        </div>

        <SimpleCarousel images={images} />

        <div className="flex-1 rounded-lg lg:h-full px-4 lg:flex lg:flex-col lg:justify-center xl:gap-2">
          <div className="flex w-full items-center mb-0">
            <div className="flex flex-col w-full">
              <div className="w-1/2">
                <p className="text-sm inline text-c-blue bg-c-blue bg-opacity-15 px-2 py-1 rounded">
                  {category?.toUpperCase()}
                </p>
              </div>
              <h2 className="text-lg mt-2 text-c-dark font-bold">
                {projectName}
              </h2>

              <div className="flex flex-row justify-between">
                <div className="mt-2">
                  <p className="text-c-text-secondary text-xs">Creado por:</p>
                  <p className="text-c-dark font-bold text-sm">{owner}</p>
                </div>
                <div className="mt-2">
                  <p className="text-c-text-secondary text-xs text-right">
                    Contrato:
                  </p>

                  {isMetamaskConnected ? (
                    <p
                      onClick={() => {
                        addToken();
                      }}
                      className="text-c-dark cursor-pointer  font-bold text-sm text-right"
                    >
                      Agregar token en Metamask
                    </p>
                  ) : (
                    <></>
                  )}

                  <a
                    href={`https://polygonscan.com/address/${projectTrexToken}`}
                    target="_blank"
                  >
                    <p className="text-c-blue font-bold text-sm text-right">
                      {shortenAddress(projectTrexToken)}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="text-c-text-secondary text-xs 2xl:text-lg my-1 2xl:my-3">
            {shortDescription}
          </p>
          <div className="mb-4 flex flex-row justify-between border rounded-xl px-4 py-1">
            <div className="flex flex-1 flex-col text-sm 2xl:text-md text-c-text-secondary font-medium">
              <div className="font-bold text-xs">Precio por token:</div>
              <div className="text-c-blue font-semibold text-lg">
                {priceForEachToken} Wusdt
              </div>
            </div>
            <div className="w-[2px] bg-c-light-gray"></div>
            <div className="flex flex-1 text-right flex-col text-sm 2xl:text-md text-c-text-secondary font-medium">
              <p className="text-sm 2xl:text-md">Total:</p>
              <div className="text-c-dark font-semibold text-lg">
                ${totalPrice}
              </div>
            </div>
          </div>
          <ProgressBar
            maxValue={financials[0]?.max_limit}
            completedValue={0} // TODO: Set the value to the actual amount of tokens sold, necesitamos una columna para llevar registro de esto y no estar mapeando la db por esta informacion, cada vez que se compra uno, se descuenta
          />
          <span className="text-right text-xs">
            Cierre del recaudo:{" "}
            {dates
              ? formatDate(dates[0]?.finalized)
              : "No se encontraron datos"}
          </span>
          <div className="flex my-1 2xl:my-3 flex-row items-center w-2/3">
            <Select
              value={selectedAmountOfTokens.toString()}
              onValueChange={(value) => {
                setSelectedAmountOfTokens(Number(value));
                setShowTokenSelectError(false); // Restablecer el borde si selecciona tokens
              }}
            >
              <SelectTrigger
                className={`border rounded-lg text-sm bg-white ${
                  showTokenSelectError ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select tokens" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-auto">
                <SelectItem key={0} value="0">
                  0 tokens
                </SelectItem>
                {Array.from({ length: 100 }, (_, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {index + 1} tokens
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm 2xl:text-md ml-2 shrink-0">{`( ${financials[0]?.assigned_public_sale} disponibles)`}</p>
          </div>
          {projectId ? (
            <button
              className={`w-full text-white py-2 2xl:py-3 rounded flex items-center justify-center space-x-2 ${
                canBuy ? "bg-c-primaryColor hover:bg-c-secondaryColor" : "bg-gray-400"
              }`}
              onClick={handleBuy}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Comprar</span>
            </button>
          ) : null}
        </div>
        {acceptedBuy && (
          <SignTransactionModal
            projectId={projectId}
            selectedAmountOfTokens={selectedAmountOfTokens}
            onClose={() => setAcceptedBuy(false)}
            onAccept={handleAccept}
          />
        )}
      </section>
      <DownloadStampingInvestmentCertificate
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        downloadLink={certificateDownloadLink}
      />
    </>
  );
};

export default ProjectDetailsCard;
