// BuyTokenusTokenPaymentViaStripe.js
import { showErrorAlert } from "@/utils/notificationsListWithReactToastify/notifications";
import { useState } from "react";
const backendEndpoint = import.meta.env.VITE_API_BASE_URL;
import { useActiveAccount } from "thirdweb/react";

export const BuyTokenusTokenPaymentViaStripe = () => {
  const address = useActiveAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState(1);

  const handlePayment = async () => {
    setIsProcessing(true);

    console.log("walletAddress", address?.address);

    if (!address?.address) {
      showErrorAlert("Debes conectar tu wallet para comprar.");
      return;
    }

    // Validar que la cantidad sea un número mayor o igual a 1
    if (amount < 1) {
      showErrorAlert("La cantidad de tokens debe ser al menos 1.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch(
        `${backendEndpoint}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet: address?.address, // Usar la dirección de la wallet activa
            amount: amount, // Usar la cantidad ingresada por el usuario
          }),
        }
      );
      const responseData = await response.json();

      //console.log("Response data:", responseData);

      if (responseData?.success) {
        //console.log("Redirecting to Stripe checkout page:", responseData.data);
        window.location.href = responseData?.data; // Redirect to Stripe checkout page
      } else {
        const error = response;
        console.error("Error creating checkout session:", error);
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (event: any) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setAmount(value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-center text-gray-700 mb-2 text-xs my-4">
        Elige la cantidad de tokens que quieres comprar
      </h1>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={handleAmountChange}
        className="mt-4 p-2 border border-gray-300 rounded"
        placeholder="Cantidad de tokens"
      />
      <button
        className="mt-4 px-4 py-2 bg-c-primaryColor text-white font-bold rounded"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? "Procesando..." : "Comprar"}
      </button>
    </div>
  );
};