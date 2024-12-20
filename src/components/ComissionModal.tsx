import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { showErrorAlert, showSuccessAlert } from "@/utils/notificationsListWithReactToastify/notifications";
import { useActiveAccount } from "thirdweb/react";
import { defineChain, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { Exchange, ExchangeUsdtToTokenus, USDT, WUsdtTokenAddress, escrowBuySellOrders, exchangeUsdtToTokenus, wusdtToken } from "@/utils/contracts";
import { client } from "@/client";
import { exchangeABI } from "@/abis/ExchangeAbi";
const KPIS = [
    "ACTIVE_PROJECTS",
    "USERS_REGISTERED",
    "KYC_REJECTED",
    "KYC_CONVERSION",
    "AVAILABLE_TOKENUS",
    "USERS_FOR_COUNTRY",
    "TOTAL_TOKENUS",
];

const ComissionCard: React.FC = () => {
    const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
    const [frequency, setFrequency] = useState<string>("days");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [format, setFormat] = useState<string>("excel");

    const [buyPercentage, setBuyPercentage] = useState(0)
    const [sellPercentage, setSellPercentage] = useState(0)
    const [addressBuyAndSell, setAddressBuyAndSell] = useState("0x123")
    
    const [exchangeUsdtToWusdtPercentage, setExchangeUsdtToWusdtPercentage] = useState(0)
    const [addressExchangeUsdtToWusdt, setAddressExchangeUsdtToWusdt] = useState("0x123")
    const [amountUsdtExchange, setAmountUsdtExchange] = useState(0)
    const [amountWusdtExchange, setAmountWusdtExchange] = useState(0)
    
    const [exchangePercentage, setExchangePercentage] = useState(0)

    const [amountExchange, setAmountExchangeAmount] = useState(0)
    const [recipientAddress, setRecipientAddress] = useState("0x123")
    // const [addressExchange, setAddressExchange] = useState(0)
    
    const [ordersPercentage, setOrdersPercentage] = useState(0)
    const [ordersAddress, setOrdersAddress] = useState(0)

    const address = useActiveAccount();
    const chain = defineChain(137);

    const formatDate = (date: string): string => {
        if (!date) return "";
    
        const parts = date.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}-${month}-${year}`;
        } else if (parts.length === 2) {
            const [year, month] = parts;
            return `${month}-${year}`;
        }
    
        return date; 
    };
    

    const handleKPIChange = (kpi: string) => {
        setSelectedKPIs((prev) =>
            prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
        );
    };


    const handleDownload = () => {
        if (!startDate || !endDate || selectedKPIs.length === 0) {
            alert("Por favor, selecciona los KPIs, un rango de fechas y un formato.");
            return;
        }

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const params = new URLSearchParams({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            format,
            rangeType: frequency,
            kpis: selectedKPIs.join(","),
        });

        const downloadUrl = `https://tb.zeuss.click/api/v1/admin/dashboard/exports?${params.toString()}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `export.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const handleBuyPercentage = (
        e: any
      ) => {
        setBuyPercentage(e.target.value);
      };

    const handleSellPercentage = (
        e: any
      ) => {
        setSellPercentage(e.target.value);
      };

    const handleAddressBuyAndSell = (
        e: any
      ) => {
        setAddressBuyAndSell(e.target.value);
      };

    const handleExchangeUsdtToWusdtPercentage = (
        e: any
      ) => {
        setExchangeUsdtToWusdtPercentage(e.target.value);
      };
    const handleAddressExchangeUsdtToWusdtPercentage = (
        e: any
      ) => {
        setAddressExchangeUsdtToWusdt(e.target.value);
      };

    const handleAmountUsdtExchange = (
        e: any
      ) => {
        setAmountUsdtExchange(e.target.value);
      };
    const handleAmountWusdtExchange = (
        e: any
      ) => {
        setAmountWusdtExchange(e.target.value);
      };


    const handleExchangePercentage = (
        e: any
      ) => {
        setExchangePercentage(e.target.value);
      };

    const handleAmountExchangeAmount = (
        e: any
      ) => {
        setAmountExchangeAmount(e.target.value);
      };
    const handleRecipientAddress = (
        e: any
      ) => {
        setRecipientAddress(e.target.value);
      };
    const handleOrdersPercentage = (
        e: any
      ) => {
        setOrdersPercentage(e.target.value);
      };
    const handleOrdersAddress = (
        e: any
      ) => {
        setOrdersAddress(e.target.value);
      };


    const setBuyWusdt = async (buyAmount: any, sellAmount: any) => {
        if (!buyAmount || Number(buyAmount) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        if (!sellAmount || Number(sellAmount) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        try {
    
    
          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: wusdtToken,
            method: "setFees",
            params: [BigInt(buyAmount * 100), BigInt(sellAmount * 100) ],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Compra configurada con ${buyAmount} porcentaje y venta configurada con ${sellAmount} % correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };

    const setAddressBuyAnSell = async (addressParam: any) => {
        if (!address) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        try {
    
    
          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: wusdtToken,
            method: "setFeeRecipient",
            params: [addressParam],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Compra y venta configurada con la address ${addressParam} como receptor`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };

    const setExchangeUsdtToWusdt = async (exchangeUsdtToWusdtPercentage: any) => {
        if (!exchangeUsdtToWusdtPercentage || Number(exchangeUsdtToWusdtPercentage) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }

        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: exchangeUsdtToTokenus,
            method: "setTransferFee",
            params: [BigInt(exchangeUsdtToWusdtPercentage * 100)],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Intercambio configurada con ${exchangeUsdtToWusdtPercentage} % correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
    };

      const setAddressExchangeUsdtToWusdtFunc = async (addressParam: any) => {
        if (!address) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        try {
    
    
          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: exchangeUsdtToTokenus,
            method: "setFeeRecipient",
            params: [addressParam],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Intercambio de USDT a Wusdt configurado con la address ${addressParam} correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };


      const setExchange = async (exchangePercentage: any) => {
        if (!exchangePercentage || Number(exchangePercentage) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }

        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: Exchange,
            method: "setTransferFee",
            params: [BigInt(exchangePercentage * 100)],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Intercambio configurada con ${exchangePercentage} % correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };


      const withdrawUsdt = async (amounUsdt: any) => {
        if (!amounUsdt || Number(amounUsdt) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }

        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: exchangeUsdtToTokenus,
            method: "withdrawUSDT",
            params: [BigInt(amounUsdt * 10 ** 6)],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `${amounUsdt} Wusdt retirados exisosamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };

      const withdrawWusdt = async (amounWusdt: any) => {
        if (!amounWusdt || Number(amounWusdt) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }

        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: exchangeUsdtToTokenus,
            method: "withdrawWUSDT",
            params: [BigInt(amounWusdt * 10 ** 6)],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `${amounWusdt} USDTs retirados exitosamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };



      const withdrawExchange = async (amount: any, addressParam: any) => {
        if (!amount || Number(amount) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }

        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: Exchange,
            method: "withdraw",
            params: [BigInt(amount * 10 ** 6),addressParam],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Retiraste ${amount} a la address ${addressParam} exitosamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };

      const withdrawExchangeFees = async () => {
        try {


          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: Exchange,
            method: "withdrawTotalFee",
            params: [],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Comisiones retiradas con exito`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
      };


      const setOrdersPercentageFunc = async (amount: any) => {
        if (!amount || Number(amount) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        try {
          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: escrowBuySellOrders,
            method: "setFee",
            params: [BigInt(amount * 100)],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Libro de ordenes configurada con ${amount} % correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
    };



    const setOrdersAddressFunc = async (addressParam: any) => {
        if (!addressParam || Number(addressParam) <= 0) {
          showErrorAlert("Por favor, ingrese una cantidad válida.");
          return;
        }
        try {
          if (address == undefined) {
            throw new Error("No se encontró la dirección del usuario.");
          }
    
          const configTransaction = prepareContractCall({
            contract: escrowBuySellOrders,
            method: "setRecipient",
            params: [addressParam],
            gasPrice: BigInt(150),
          });
    
          const { transactionHash: configHash } = await sendTransaction({
            transaction: configTransaction,
            account: address,
          });
    
          await waitForReceipt({
            client: client,
            chain: chain,
            transactionHash: configHash,
          });


            console.log("Swap realizado");
            showSuccessAlert(
                `Direccion ${addressParam} modificada en libro de ordenes correctamente`,
                { autoClose: false }
            );


        } catch (error) {
          console.error("Error durante el swap:", error);
          showErrorAlert("Hubo un problema en la configuración.");
          //DIEGO Error al hacer swap de tokens de USDT a WUSDTs
        } finally {
         // setIsProcessing(false); // Ocultar pantalla gris
          //DIEGO Finaliza el swap de tokens de USDT a WUSDTs
        }
    };

    return (
        <>
                <h2 className="text-xl font-semibold">Configuracion de comisiones</h2>
                <h3 className="font-medium mb-2">En todos los campos se debe poner el numero sin signo de porcentaje (%), si es 4% lo que queremos poner se debe poner el 4 solo</h3>
        <Card className="p-4">
            <CardContent className="space-y-4">
                <div style={{display:"inline-block"}}>
                    <h3 className="font-medium mb-2">Comisión de compra y venta de Wusdt</h3>

                    <input
                        type="text"
                        value={buyPercentage}
                        onChange={handleBuyPercentage}
                        placeholder="Ingrese porcentaje para venta"
                        className="border p-2 mb-2"
                    />
                    <br />
                    <input
                        type="text"
                        value={sellPercentage}
                        onChange={handleSellPercentage}
                        placeholder="Ingrese porcentaje para venta"
                        className="border p-2 mb-2"
                    />
                    <br />
                    <button onClick={() => setBuyWusdt(buyPercentage,sellPercentage)}>Configurar Wusdt</button>

                    <br />
            

                </div>
                <div style={{display:"inline-block"}}>

                    <input 
                        type="text"
                        value={addressBuyAndSell}
                        onChange={handleAddressBuyAndSell}
                        placeholder="Ingrese la billetera que recibira las comisiones"
                        className="border p-2 mb-2"
                        />
                    <br />
                    <button onClick={() => setAddressBuyAnSell(addressBuyAndSell)}>Configurar dirección </button>

                </div>




            </CardContent>
        </Card>


        <Card className="p-4">
            <CardContent className="space-y-4">
                <div style={{display:"inline-block"}}>
                    <h3 className="font-medium mb-2">Comisión de intercambio entre USDT a Wusdt</h3>

                    <input
                        type="text"
                        value={exchangeUsdtToWusdtPercentage}
                        onChange={handleExchangeUsdtToWusdtPercentage}
                        placeholder="Ingrese porcentaje para intercambio"
                        className="border p-2 mb-2"
                    />
                    <br />
                    <button onClick={() => setExchangeUsdtToWusdt(exchangeUsdtToWusdtPercentage)}>Configurar Intercambio</button>

                    
                </div>

                <div style={{display:"inline-block"}}> 
                <input 
                        type="text"
                        value={addressExchangeUsdtToWusdt}
                        onChange={handleAddressExchangeUsdtToWusdtPercentage}
                        placeholder="Ingrese la address que recibira las comisiones"
                        className="border p-2 mb-2"
                        />
                    <br />
                    <button onClick={() => setAddressExchangeUsdtToWusdtFunc(addressExchangeUsdtToWusdt)}>Configurar dirección </button>
                </div>

                <br />
                <div style={{display:"inline-block"}}>
                <input 
                        type="text"
                        value={amountUsdtExchange}
                        onChange={handleAmountUsdtExchange}
                        placeholder="Ingrese la cantidad de USDT a reclamar"
                        className="border p-2 mb-2"
                        />

                    <button onClick={() => withdrawWusdt(amountUsdtExchange)}>Retirar Wusdt</button>
                    <br />

                    <input 
                        type="text"
                        value={amountWusdtExchange}
                        onChange={handleAmountWusdtExchange}
                        placeholder="Ingrese la cantidad de Wusdt a reclamar"
                        className="border p-2 mb-2"
                        />
                    <button onClick={() => withdrawUsdt(amountWusdtExchange)}>Retirar USDT</button>
                </div>
            </CardContent>
        </Card>


        <Card className="p-4">
            <CardContent className="space-y-4">
                <div style={{display:"inline-block"}}>
                    <h3 className="font-medium mb-2">Comisión de compra tokens de proyecto</h3>
                    <input
                        type="text"
                        value={exchangePercentage}
                        onChange={handleExchangePercentage}
                        placeholder="Ingrese porcentaje para intercambio"
                        className="border p-2 mb-2"
                    />
                    <br />
                    <button onClick={() => setExchange(exchangePercentage)}>Configurar Intercambio</button>
                </div>
                <div style={{display:"inline-block"}}>
                <input 
                        type="text"
                        value={amountExchange}
                        onChange={handleAmountExchangeAmount}
                        placeholder="Ingrese la cantidad de USDT a reclamar"
                        className="border p-2 mb-2"
                        />
                <input 
                        type="text"
                        value={recipientAddress}
                        onChange={handleRecipientAddress}
                        placeholder="Ingrese la cantidad de USDT a reclamar"
                        className="border p-2 mb-2"
                        />

                    <button onClick={() => withdrawExchange(amountExchange,recipientAddress)}>Retirar Wusdt</button>
                    <br />

                    
                    <button onClick={() => withdrawExchangeFees()}>Retirar comisiones en Wusdt</button>
                </div>
             
            </CardContent>
        </Card>





        <Card className="p-4">
            <CardContent className="space-y-4">
                <div >
                    <h3 className="font-medium mb-2">Comisión de Ordenes de compra y venta</h3>
                    <input
                        type="text"
                        value={ordersPercentage}
                        onChange={handleOrdersPercentage}
                        placeholder="Ingrese porcentaje para intercambio"
                        className="border p-2 mb-2"
                    />
                    <br />
                    <button onClick={() => setOrdersPercentageFunc(ordersPercentage)}>Configurar porcentaje</button>
                </div>
                <div >
                <input 
                        type="text"
                        value={ordersAddress}
                        onChange={handleOrdersAddress}
                        placeholder="Ingrese la cantidad de USDT a reclamar"
                        className="border p-2 mb-2"
                        />
            <br />
                    <button onClick={() => setOrdersAddressFunc(ordersAddress)}>Modificar dirección de recibo</button>

                    
                </div>
             
            </CardContent>
        </Card>


      
    </>
    );
};

export default ComissionCard;

