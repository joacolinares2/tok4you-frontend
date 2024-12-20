import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { EscrowBuySellOrders, escrowBuySellOrders, wusdtToken } from "@/utils/contracts";
import { client } from "@/client";
import { defineChain, getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { tokenABI } from "@/abis/tokenABI";
import { ethers } from "ethers";
import { escrowABI } from "@/abis/escrowABI";
import { showErrorAlert, showSuccessAlert } from "@/utils/notificationsListWithReactToastify/notifications";
export default function OrderBookProjectDetail({ projectTrexToken, projectName, symbol, arrayOrders, setArrayOrders, setOrderInformation,setIsProcessing }: any) {



  const chain = defineChain(137)
  const account = useActiveAccount()

  const { data: getSellOrderDetailsByProject } = useReadContract({
    contract: escrowBuySellOrders,
    method: "getSellOrderDetailsByProject",
    params: [projectTrexToken],
  });

  const { data: getBuyOrderDetailsByProject } = useReadContract({
    contract: escrowBuySellOrders,
    method: "getBuyOrderDetailsByProject",
    params: [projectTrexToken],
  });


  useEffect(() => {
    handleTypeClick("venta")
  }, [])

  useEffect(() => {
    if (getSellOrderDetailsByProject || getBuyOrderDetailsByProject) {
      const combinedOrders: any[] = [];

      // Procesar órdenes de venta
      if (getSellOrderDetailsByProject) {
        let i = 0;
        getSellOrderDetailsByProject.forEach((order: any) => {
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
      }

      // Procesar órdenes de compra
      if (getBuyOrderDetailsByProject) {
        let i = 0;
        getBuyOrderDetailsByProject.forEach((order: any) => {
          if (order.isActive) {
            // Filtrar sólo órdenes activas
            combinedOrders.push({
              name: projectName,
              quantity: Number(order.amountOffered) / 1000000, // Convertir a la unidad adecuada
              total: Number(order.amountWanted) / 1000000, // Convertir a la unidad adecuada
              orderId: order.creator, // Usar el creador como ID de la orden
              id: i,
              type: "compra",
            });
          }
          i++;
        });
      }

      // Actualizar el estado con las órdenes combinadas
      setArrayOrders({
        data: combinedOrders,
        status: true,
      });
    }
  }, [getSellOrderDetailsByProject, getBuyOrderDetailsByProject]);





  const [activeType, setActiveType] = useState<"venta" | "compra" | "">("venta");

  const handleTypeClick = (type: "venta" | "compra") => {
    setActiveType((prevType) => (prevType === type ? prevType : type));
  };

  const createBuyerOffer = async (id: any) => {
    try {
      //DIEGO Inicia ejecucion de orden de compra
      setIsProcessing(true)

      if (account == undefined) {
        throw new Error("No se encontró la dirección del usuario.");
      }

      const trexToken = getContract({
        client: client,
        address: projectTrexToken,
        chain: chain,
        abi: tokenABI
      })

      const escrowAdd = EscrowBuySellOrders; // CAMBIAR

      // APROVE TREX
      const approvalTrexToken = prepareContractCall({
        contract: trexToken,
        method: "approve",
        params: [
          escrowAdd,
          BigInt(Number(1000000) * 10 ** 6),
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

      console.log("executeBuyOrder")
      const executeBuyOrden = prepareContractCall({
        contract: escrowBuySellOrders,
        method: "executeBuyOrder",
        params: [BigInt(id)],
        gasPrice: BigInt(250000000000),
      });

      console.log("NO")


      const { transactionHash: executeBuyOrderHash } =
        await sendTransaction({
          transaction: executeBuyOrden,
          account: account,
        });
        console.log("Todo bien1 ")

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: executeBuyOrderHash,
      });
      console.log("Todo bien2 ")


      setOrderInformation()
      showSuccessAlert("Compra realizada con exito!");
      setIsProcessing(false)
    } catch (error) {
      showErrorAlert("Hubo un error en la compra, porfavor revise su saldo");
      console.log(error)
      setIsProcessing(false)
      //DIEGO Error en la ejecucion de orden de compra
    }
  }



  const createSellOffer = async (id: any) => {
    try {
      //DIEGO Inicia ejecucion de orden de venta
      setIsProcessing(true)
      if (account == undefined) {
        throw new Error("No se encontró la dirección del usuario.");
      }

      const trexToken = getContract({
        client: client,
        address: projectTrexToken,
        chain: chain,
        abi: tokenABI
      })

      const escrowAdd = EscrowBuySellOrders; // CAMBIAR

      // APROVE TREX
      const approvalWusdtBuyToken = prepareContractCall({
        contract: wusdtToken,
        method: "approve",
        params: [
          escrowAdd,
          BigInt(Number(10000000) * 10 ** 6), // valor a aprob
        ],
        gasPrice: BigInt(250000000000),
      });

      const { transactionHash: approveWusdBuytHash } = await sendTransaction(
        {
          transaction: approvalWusdtBuyToken,
          account: account,
        }
      );

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: approveWusdBuytHash,
      });

      const executeSellOrder = prepareContractCall({
        contract: escrowBuySellOrders,
        method: "executeSellOrder",
        params: [BigInt(id)],
        gasPrice: BigInt(250000000000),
      });



      const { transactionHash: executeSellOrderHash } =
        await sendTransaction({
          transaction: executeSellOrder,
          account: account,
        });

      await waitForReceipt({
        client: client,
        chain: chain,
        transactionHash: executeSellOrderHash,
      });


      setOrderInformation()
      showSuccessAlert("Venta realizada con exito!");
      setIsProcessing(false)
    } catch (error) {
      showErrorAlert("Hubo un error en la venta, porfavor revise su saldo");
      setIsProcessing(false)
      //DIEGO Error en la ejecucion de orden de venta
    }
  }

  return (
    <div className="w-full bg-background mt-4 ">
      <div className="flex justify-end pb-4 border-b space-x-4">
        <Button
          className={
            activeType === "venta"
              ? "bg-c-primaryColor text-white rounded"
              : "bg-gray-200 rounded"
          }
          onClick={() => handleTypeClick("venta")}
        >
          Ventas
        </Button>
        <Button
          className={
            activeType === "compra"
              ? "bg-c-primaryColor text-white rounded"
              : "bg-gray-200 rounded "
          }
          onClick={() => handleTypeClick("compra")}
        >
          Compras
        </Button>
      </div>

      <div className=" overflow-y-scroll h-52">
        <div className="overflow-x-auto ">
          <table className="w-full text-xs font-medium text-c-text-primary border-separate border-spacing-y-2 ">
            <thead>
              <tr>
                <th className="p-2 text-[15px]">Nombre de proyecto</th>
                <th className="p-2 ">Precio</th>
                <th className="p-2 hidden md:table-cell">Total</th>
                <th className="p-2">compra o venta</th>
                <th className="p-2 ">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {arrayOrders &&
                arrayOrders.data
                  ?.filter((item: any) =>
                    activeType ? item.type === activeType : true
                  ) // Filtrar según el tipo activo
                  .map((item: any) => (
                    <tr
                      key={item.orderId + Math.random()}
                      className=" text-[15px] font-medium bg-white shadow-md rounded-lg text-center"
                    >
                      <td className="p-2 font-semibold">
                        <span className=" sm:hidden">Nombre: </span>
                        {item.name}
                      </td>

                      {activeType == "venta" ? (
                        <>
                          <td className="p-2 hidden md:table-cell text-c-text-secondary">
                            <span className=" md:hidden">Total: </span>
                            {item.total} Wusdt
                          </td>
                          <td className="p-2 text-c-text-secondary">
                            <span className=" sm:hidden">Precio: </span>
                            {item.quantity} {symbol && symbol}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 text-c-text-secondary">
                            <span className=" sm:hidden">Precio: </span>
                            {item.quantity} Wusdt
                          </td>
                          <td className="p-2 hidden md:table-cell text-c-text-secondary">
                            <span className=" md:hidden">Total: </span>
                            {item.total} {symbol && symbol}
                          </td>
                        </>
                      )}
                      <td className="p-2 flex justify-between sm:table-cell">
                        <span className=" sm:hidden">Tipo: </span>
                        <span
                          className={` ${
                            item.type === "venta"
                              ? "text-c-primaryColor"
                              : "text-green-500"
                          }`}
                        >
                          {item.type === "venta" ? "Venta" : "Compra"}
                        </span>
                      </td>
                      <td className="p-2  rounded-b-lg sm:rounded-r-lg sm:rounded-b-none ">
                        {item.type == "venta" ? (
                          <>
                            <Button
                              onClick={() => {
                                createSellOffer(item.id);
                              }}
                              className="bg-c-primaryColor text-white "
                              size="sm"
                            >
                              Ejecutar Venta
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                createBuyerOffer(item.id);
                              }}
                              className="bg-c-primaryColor text-white "
                              size="sm"
                            >
                              Ejecutar Compra
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

