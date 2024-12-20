import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import SumsubWebSdk from "@sumsub/websdk-react";
import {
  getApplicantKycStateFromSumsub,
  getSumsubTokenAndStoreIt,
  getVerificationProcessData,
  updateUserVerification,
} from "@/controllers/verification.controller";
import { redirectToPath } from "@/lib/changePath";
import { X } from "lucide-react";
import { showSuccessAlert } from "@/utils/notificationsListWithReactToastify/notifications";
import { toast } from "react-toastify";

const Kyc: React.FC = () => {
  const navigate = useNavigate();
  const activeWallet = useActiveAccount();
  const [showKycSdk, setShowKycSdk] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldShowUserSumsubState, setShouldShowUserSumsubState] =
    useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cachedVerificationProcessData = localStorage.getItem(
      "verification-process-data"
    );

    if (cachedVerificationProcessData) {
      const verificationProcessData = JSON.parse(cachedVerificationProcessData);
      if (verificationProcessData.hasKYC === true) {
        redirectToPath(navigate, "/TOS");
      }
    }
  }, [navigate]);

  /*   const intervalToPullUserSumsubVerification = async () => {
    console.log("cada 5 segundos se ejecuta el checkKycStatus");
  }

  useEffect(() => {
    setInterval(await intervalToPullUserSumsubVerification, 1000);
  }, []);
 */

  if (activeWallet && !isPolling && shouldShowUserSumsubState) {
    const getUserSumsubVerificationStatus = async () => {
      setIsPolling(true);
      const response = await getApplicantKycStateFromSumsub(
        activeWallet?.address.toString() as string
      );
      console.log("KYC status check response:", response);


      if (
        response?.message === "Usuario aprobado por sumsub" &&
        shouldShowUserSumsubState
      ) {
        toast.success("Usuario creado exitosamente");;
        setShouldShowUserSumsubState(false);
        setIsPolling(false);
        redirectToPath(navigate, "/TOS");
        return;
      }

      if (response?.message === "Usuario NO aprobado por sumsub todavia") {
        setIsPolling(false);
        toast.success("No fuiste aprobado por Sumsub, por lo que no puedes acceder compras en la esta aplicación.");
        redirectToPath(navigate, "/");
        return;
      }
      timeoutRef.current = setTimeout(() => {
        getUserSumsubVerificationStatus();
      }, 15000);
    };

    getUserSumsubVerificationStatus();
  }

  const toggleShowKyc = () => {
    setShowKycSdk(!showKycSdk);
  };

  const handleStartKyc = async () => {
    setLoading(true);
    const response = await getSumsubTokenToStartKyc();
    if (response && response.message === "success") {
      setAccessToken(response.token);
      toggleShowKyc();
    }
    setLoading(false);
  };

  const getSumsubTokenToStartKyc = async () => {
    const response = await getSumsubTokenAndStoreIt(
      activeWallet?.address.toString() as string,
      "basic-kyc-level"
    );
    return response;
  };

  const accessTokenExpirationHandler = () => {
    console.log(
      "El token ha expirado, necesitas uno nuevo, recarga la página."
    );
  };

  /*   const messageHandler = (message: any) => {
    console.log("Message from Sumsub SDK:", message);
    if (message.type === "success") {
      redirectToPath(navigate, "/TOS");
    }
  }; */

  const errorHandler = (error: any) => {
    console.error("Error en Sumsub SDK:", error);
  };

  const config_2 = {};
  const options = {};

  return (
    <div className="flex justify-center items-center my-8">
      {!showKycSdk && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-center mb-4">Iniciar KYC</h2>
          <p className="text-center text-gray-600 mb-6">
            Haz clic en el botón para iniciar el proceso de verificación KYC.
          </p>
          {activeWallet?.address.toString() && (
            <button
              onClick={handleStartKyc}
              className={`w-full text-white py-2 px-4 rounded-md transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Iniciando KYC..." : "Iniciar KYC"}
            </button>
          )}
        </div>
      )}

      {showKycSdk && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <button
              onClick={toggleShowKyc}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="h-full overflow-y-auto max-h-[85vh]">
              <SumsubWebSdk
                accessToken={accessToken}
                expirationHandler={accessTokenExpirationHandler}
                config={config_2}
                options={options}
                /* onMessage={messageHandler} */
                onError={errorHandler}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kyc;

/* import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import SumsubWebSdk from "@sumsub/websdk-react";
import {
  getApplicantKycStateFromSumsub,
  getSumsubTokenAndStoreIt,
  getVerificationProcessData,
  updateUserVerification,
} from "@/services/controllers/verification.controller";
import { redirectToPath } from "@/lib/changePath";
import { X } from "lucide-react";
import { showSuccessAlert } from "@/utils/notificationsListWithReactToastify/notifications";

const Kyc: React.FC = () => {
  const navigate = useNavigate();
  const activeWallet = useActiveAccount();
  const [showKycSdk, setShowKycSdk] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [userSumsubState, setUserSumsubState] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cachedVerificationProcessData = localStorage.getItem(
      "verification-process-data"
    );

    if (cachedVerificationProcessData) {
      const verificationProcessData = JSON.parse(cachedVerificationProcessData);

      if (verificationProcessData.hasKYC === true) {
        redirectToPath(navigate, "/TOS");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (activeWallet && userSumsubState === "") {
      // Clear any existing interval before setting a new one
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        try {
          const response = await getApplicantKycStateFromSumsub(
            activeWallet.address.toString()
          );
          console.log("response", response);

          // Update userSumsubState with the received message
          setUserSumsubState(response?.message || "");

          // Handle the response here, e.g., check if the user is approved
          if (response?.message === "Usuario aprobado por sumsub") {
            showSuccessAlert("User approved by Sumsub");
            redirectToPath(navigate, "/TOS");
          }
        } catch (error) {
          console.error("Error fetching KYC state:", error);
        }
      }, 15000);
    }

    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeWallet, navigate]);

  const toggleShowKyc = () => {
    setShowKycSdk(!showKycSdk);
  };

  const handleStartKyc = async () => {
    setLoading(true);
    const response = await getSumsubTokenToStartKyc();
    if (response && response.message === "success") {
      setAccessToken(response.token);
      toggleShowKyc();
    }
    setLoading(false);
  };

  const getSumsubTokenToStartKyc = async () => {
    const response = await getSumsubTokenAndStoreIt(
      activeWallet?.address.toString() as string,
      "basic-kyc-level"
    );
    return response;
  };

   const handleSkipKyc = async () => {
    const response = await updateUserVerification({
      wallet: activeWallet?.address.toString() as string,
      hasKYC: "comiendo zapatos",
    });
  };

  const accessTokenExpirationHandler = () => {
    console.log("El token ha expirado, deberías obtener uno nuevo.");
  };

  const messageHandler = (message: any) => {
    console.log("Message from Sumsub SDK:", message);
    if (message.type === "success") {
      redirectToPath(navigate, "/TOS");
    }
  };

  const errorHandler = (error: any) => {
    console.error("Error en Sumsub SDK:", error);
  };

  const config_2 = {};
  const options = {};

  return (
    <div className="flex justify-center items-center my-8">
      {!showKycSdk && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-center mb-4">Iniciar KYC</h2>
          <p className="text-center text-gray-600 mb-6">
            Haz clic en el botón para iniciar el proceso de verificación KYC.
          </p>
          {activeWallet?.address.toString() && (
            <button
              onClick={handleStartKyc}
              className={`w-full text-white py-2 px-4 rounded-md transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Iniciando KYC..." : "Iniciar KYC"}
            </button>
          )}
        </div>
      )}

      {showKycSdk && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <button
              onClick={toggleShowKyc}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="h-full overflow-y-auto max-h-[85vh]">
              <SumsubWebSdk
                accessToken={accessToken}
                expirationHandler={accessTokenExpirationHandler}
                config={config_2}
                options={options}
                onMessage={messageHandler}
                onError={errorHandler}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kyc;
 */
