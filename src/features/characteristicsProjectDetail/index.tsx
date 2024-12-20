import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import GeneralCharacteristicsProjectDetail from "./GeneralCharacteristicsProjectDetail";
import ExchangeOrdersProjectDetail from "../exchangeOrdersProjectDetail";
import OrderBookProjectDetail from "./OrderBookProjectDetail";
import { ethers } from "ethers";
import { escrowABI } from "@/abis/escrowABI";
import { EscrowBuySellOrders } from "@/utils/contracts";
interface CharacteristicsProjectDetailProps {
  projectTrexToken: string;
  projectName: string;
  symbol?: any;
  setIsProcessing: any;
}

const CharacteristicsProjectDetail: React.FC<
  CharacteristicsProjectDetailProps
> = ({ projectTrexToken, projectName, symbol,setIsProcessing }) => {
  const [isCharacteristicsVisible, setIsCharacteristicsVisible] =
    useState(true);
  const [isOrdersVisible, setIsOrdersVisible] = useState(true);
  const [isBookVisible, setIsBookVisible] = useState(true);
  const [arrayOrders, setArrayOrders] = useState<any>({
    dato: [],
    status: false,
  });

  //console.log(setIsProcessing)

  const setOrderInformation = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );

    const escrowBuySellOrdersContract = new ethers.Contract(
      EscrowBuySellOrders,
      escrowABI,
      provider
    );

    const sellOrders =
      await escrowBuySellOrdersContract.getSellOrderDetailsByProject(
        projectTrexToken
      );
    const buyOrders =
      await escrowBuySellOrdersContract.getBuyOrderDetailsByProject(
        projectTrexToken
      );

    console.log("Entra");
    const combinedOrders: any[] = [];

    // Procesar órdenes de venta

    let i = 0;
    sellOrders.forEach((order: any) => {
      if (order.isActive) {
        // Filtrar sólo órdenes activas
        combinedOrders.push({
          name: projectName,
          quantity: Number(order.amountOffered) / 1000000, // Convertir a la unidad adecuada
          total: Number(order.amountWanted) / 1000000, // Convertir a la unidad adecuada
          orderId: order.creator, // Usar el creador como ID de la orden
          id: i,
          type: "venta",
        });
      }
      i++;
    });

    // Procesar órdenes de compra
    let x = 0;
    buyOrders.forEach((order: any) => {
      if (order.isActive) {
        // Filtrar sólo órdenes activas
        combinedOrders.push({
          name: projectName,
          quantity: Number(order.amountOffered) / 1000000, // Convertir a la unidad adecuada
          total: Number(order.amountWanted) / 1000000, // Convertir a la unidad adecuada
          orderId: order.creator, // Usar el creador como ID de la orden
          id: x,
          type: "compra",
        });
      }
      x++;
    });

    // Actualizar el estado con las órdenes combinadas
    setArrayOrders({
      data: combinedOrders,
      status: true,
    });

    console.log("Termino");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-c-text-primary">
            Características
          </h2>
          <Switch
            className={isCharacteristicsVisible ? "bg-c-dark" : "bg-gray-300"}
            checked={isCharacteristicsVisible}
            onCheckedChange={setIsCharacteristicsVisible}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCharacteristicsVisible
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <GeneralCharacteristicsProjectDetail />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-c-text-primary">Órdenes</h2>
          <Switch
            className={isOrdersVisible ? "bg-c-dark" : "bg-gray-300"}
            checked={isOrdersVisible}
            onCheckedChange={setIsOrdersVisible}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOrdersVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ExchangeOrdersProjectDetail
            projectTrexToken={projectTrexToken}
            setOrderInformation={setOrderInformation}
            setIsProcessing={setIsProcessing}
          />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-c-text-primary">
            Libro de órdenes{" "}
            <button
              onClick={() => {
                setOrderInformation();
              }}
            >
              🔄
            </button>
          </h2>
          <Switch
            className={isBookVisible ? "bg-c-dark" : "bg-gray-300"}
            checked={isBookVisible}
            onCheckedChange={setIsBookVisible}
          />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isBookVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <OrderBookProjectDetail
            projectTrexToken={projectTrexToken}
            projectName={projectName}
            symbol={symbol}
            arrayOrders={arrayOrders}
            setArrayOrders={setArrayOrders}
            setOrderInformation={setOrderInformation}
            setIsProcessing={setIsProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacteristicsProjectDetail;
