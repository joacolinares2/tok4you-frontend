import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { defineChain, getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { EscrowBuySellOrders, WUsdtTokenAddress, escrowBuySellOrders, wusdtToken } from "@/utils/contracts";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/client";
import { ethers } from "ethers";
import { tokenABI } from "@/abis/tokenABI";
import { identityRegistryABI } from "@/abis/IdentityRegistryABI";
import {
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/notificationsListWithReactToastify/notifications";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import { set } from "react-hook-form";

const ExchangeOrdersProjectDetail = ({ projectTrexToken,setOrderInformation,setIsProcessing }: any) => {
  const [orderType, setOrderType] = useState("venta");
  const [amount, setAmount] = useState<any>(0)
  const [price, setPrice] = useState<any>(0)
  const [balance, setBalance] = useState<string>("0"); // Balance del token
  const [tokenSymbol, setTokenSymbol] = useState<string>("TKNS"); // Decimales del token
  const [isLoading, setIsLoading] = useState(false);
  const chain = defineChain(137)
  const account = useActiveAccount()
  const userWallet = account?.address as string;



  const createSellOrder = async () => {
    try {
      //DIEGO Inicia creacion de orden de venta
      setIsProcessing(true) 

    const amountTokens = amount
    const totalPrice = price

    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    const privateKey: any = import.meta.env.VITE_API_ADMIN;
    const deployer = new ethers.Wallet(privateKey, provider);

    const tokenContractOrder = new ethers.Contract(
      projectTrexToken, // Usar este mismo valor para ver que token es
      tokenABI,
      deployer
    );
    const userAddressOrder = userWallet;

    const addIndetityOrder =
      await tokenContractOrder.identityRegistry();
    const identityRegistryOrder = new ethers.Contract(
      addIndetityOrder,
      identityRegistryABI,
      deployer
    );

    // Verificar que el creador de la compra este registrado en el token que intenta vender
    if (!(await identityRegistryOrder.isVerified(userAddressOrder))) {
      const registerIdentity =
        await identityRegistryOrder.registerIdentity(
          userAddressOrder,
          addIndetityOrder,
          0, // VALOR DE PAIS RECIBIDO DESDE IDENTIFICACION
          {
            gasPrice: BigInt(250000000000),
          }
        );
      await registerIdentity.wait();
    } else {
    }

    // Instacia de contrato escrow
    const escrowAdd = EscrowBuySellOrders; // CAMBIAR


    if (account == undefined) {
      throw new Error("No se encontró la dirección del usuario.");
    }

    const trexToken = getContract({
      client: client,
      address: projectTrexToken,
      chain: chain,
      abi: tokenABI
    })


    // APROVE TREX
    const approvalTrexToken = prepareContractCall({
      contract: trexToken,
      method: "approve",
      params: [
        escrowAdd,
        BigInt(Number(amountTokens) * 10 ** 6), // valor a aprob
      ],
      gasPrice: BigInt(250000000000),
    });

    const { transactionHash: approveTrexHash } = await sendTransaction({
      transaction: approvalTrexToken,
      account: account,
    });

    await waitForReceipt({
      client: client,
      chain: chain,
      transactionHash: approveTrexHash,
    });

    const trexProjectAddress = projectTrexToken

    const createSellOrden = prepareContractCall({
      contract: escrowBuySellOrders,
      method: "createSellOrder",
      params: [trexProjectAddress, WUsdtTokenAddress, BigInt(Number(amountTokens) * 10 ** 6), BigInt(Number(totalPrice) * 10 ** 6)],
      gasPrice: BigInt(350000000000),
    });

    if (account == undefined) { return }
    const { transactionHash: createSellOrderHash } =
      await sendTransaction({
        transaction: createSellOrden,
        account: account//userWallet,
      });

    await waitForReceipt({
      client: client,
      chain: chain,
      transactionHash: createSellOrderHash,
    });
    setOrderInformation()
    showSuccessAlert("Orden de venta creada con exito!");
    setIsProcessing(false) 
    //DIEGO Termina con exito la creacion de orden de venta
  } catch (error) {
    showErrorAlert("Hubo un error en la creación de la orden, porfavor revise su saldo");
    console.log("Error: ",error)
    setIsProcessing(false) 
    //DIEGO Error al crear de orden de venta
  }finally{
   setIsProcessing(false) 
   //DIEGO Termina creacion de orden de venta

  }


  }


  const createBuyOrder = async () => {
    //DIEGO Inicia creacion de orden de compra
    setIsLoading(true);
    try {
      setIsProcessing(true) 
    const WUsdtAdd = WUsdtTokenAddress; // cambiar
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    const privateKey: any = import.meta.env.VITE_API_ADMIN;
    const deployer = new ethers.Wallet(privateKey, provider);
    const tokenContractOrder = new ethers.Contract(
      projectTrexToken, // Usar este mismo valor para ver que token es
      tokenABI,
      deployer
    );
    const userAddressOrder = userWallet;
    const addIndetityOrder = await tokenContractOrder.identityRegistry();

    const identityRegistryOrder = new ethers.Contract(
      addIndetityOrder,
      identityRegistryABI,
      deployer
    );

    // Verificar que el creador de la compra este registrado en el token que intenta vender
    if (!(await identityRegistryOrder.isVerified(userAddressOrder))) {
      const registerIdentity = await identityRegistryOrder.registerIdentity(
        userAddressOrder,
        addIndetityOrder,
        0,
        {
          gasPrice: BigInt(250000000000),
        }
      );
      await registerIdentity.wait();
      console.log("Identidad registrada:", registerIdentity);
    } else {
      console.log("Identidad ya registrada");
    }
    // Instacia de contrato escrow
    const escrowAdd = EscrowBuySellOrders; // CAMBIAR

    // APROVE WUSDT
    const approvalWusdtToken = prepareContractCall({
      contract: wusdtToken,
      method: "approve",
      params: [
        escrowAdd,
        BigInt(Number(price) * 10 ** 6), // valor a aprob
      ], gasPrice: BigInt(250000000000),
    });

    if (account == undefined) {
      throw new Error("No se encontró la dirección del usuario.");
    }

    const { transactionHash: approveWusdtHash } = await sendTransaction(
      {
        transaction: approvalWusdtToken,
        account: account,
      });

    await waitForReceipt({
      client: client,
      chain: chain,
      transactionHash: approveWusdtHash,
    });

    const tokenOfferedBuy = WUsdtAdd;
    const tokenWantedBuy = projectTrexToken;
    const amountOfferedBuy = BigInt(Number(price) * 10 ** 6);
    const amountWantedBuy = BigInt(Number(amount) * 10 ** 6);

    const createBuyOrden = prepareContractCall({
      contract: escrowBuySellOrders,
      method: "createBuyOrder",
      params: [tokenOfferedBuy, tokenWantedBuy, amountOfferedBuy, amountWantedBuy],
      gasPrice: BigInt(250000000000),
    });

    const { transactionHash: createBuyOrderHash } =
      await sendTransaction({
        transaction: createBuyOrden,
        account: account,
      });

    await waitForReceipt({
      client: client,
      chain: chain,
      transactionHash: createBuyOrderHash,
    });
    console.log("Creada de forma correcta la orden de compra");
    setOrderInformation()
    showSuccessAlert("Orden de compra creada con exito!");
    setIsProcessing(false) 
    //DIEGO Termina con exito la creacion de orden de compra
  } catch (error) {
    showErrorAlert("Hubo un error en la creación de la orden, porfavor revise su saldo");
    setIsProcessing(false)
    //DIEGO Error al crear de orden de compra
  }finally{
    setIsProcessing(false)
    //DIEGO Termina creacion de orden de compra
  }
  }



  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!projectTrexToken || !userWallet) return;
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

      try {
        // Crear una instancia del contrato del token
        const tokenContract = new ethers.Contract(
          projectTrexToken,
          tokenABI,
          provider
        );

        // Obtener balance y decimales
        const [rawBalance, decimals] = await Promise.all([
          tokenContract.balanceOf(userWallet),
          tokenContract.decimals(),
        ]);
        // Formatear el balance
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
        setBalance(formattedBalance); // Guardar el balance formateado
        setTokenSymbol(await tokenContract.symbol()); // Guardar el símbolo del token
      } catch (error) {
        console.error("Error fetching token details:", error);
      }
    };

    fetchTokenDetails();
  }, [projectTrexToken, userWallet]);


  return (
    <section className="bg-white flex flex-col gap-4">
      {isLoading && <LoadingOverlay isLoading={isLoading} text="Cargando..."/>}
      <div className="w-full flex flex-col md:flex-row gap-4">
        <button
          onClick={() => {
            setOrderType("venta")
          }}
          className={`flex-1 flex border ${orderType === "venta" ? "border-c-blue" : "border-c-light-gray"
            } rounded-lg p-4 items-center justify-center border-2`}
        >
          <p className="text-c-blue">Órden de venta</p>
        </button>


        <button
          onClick={() => setOrderType("compra")}
          className={`flex-1 flex flex-col border ${orderType === "compra" ? "border-c-blue" : "border-c-light-gray"
            } rounded-lg p-4 items-center justify-center border-2`}
        >
          <CreditCard size={20} className="text-c-blue mb-2" />
          <p className="text-c-blue">Órden de compra</p>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-1 flex-col">
          <h2 className="text-lg font-semibold text-c-text-primary">Cantidad</h2>
          <input
            onChange={(e) => { setAmount(e.target.value) }}
            className="border border-gray-300 rounded-md p-2"
            type="number"
            min={0}
            maxLength={1000000}
            value={amount}
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h2 className="text-lg font-semibold text-c-text-primary">Precio en Wusdt</h2>
          <input
            onChange={(e) => { setPrice(e.target.value) }}
            className="border border-gray-300 rounded-md p-2"
            type="number"
            min={0}
            maxLength={1000000}
            value={price}
          />
        </div>
        <div
          className={`flex flex-1 flex-col ${orderType === "venta" ? "" : "hidden"
            }`}
        >
          <h2 className="text-lg font-semibold text-c-text-primary">Balance   </h2>
          {balance}{" "}{tokenSymbol}
        </div>
      </div>

      <button
        onClick={() => {
          if (orderType == "venta") {
            createSellOrder()
          } else {
            createBuyOrder()
          }

        }}
        className="flex-1 flex border bg-c-blue rounded-lg px-4 py-2 items-center justify-center"
      >
        <p className="text-white">Crear órden de {orderType}</p>
      </button>
    </section>
  );
};

export default ExchangeOrdersProjectDetail;
