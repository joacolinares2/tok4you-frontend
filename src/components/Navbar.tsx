import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react"; // Loader para el ícono de carga
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { ConnectButton, lightTheme } from "thirdweb/react";
import { createWallet, inAppWallet, walletConnect } from "thirdweb/wallets";
import { client } from "../client";
import {
  useDisconnect,
  useActiveAccount,
  useActiveWallet,
  useReadContract
} from "thirdweb/react";
import { getVerificationProcessData } from "@/controllers/verification.controller";
import { getUserByWallet } from "@/controllers/userInformation.controller";
import { UsdtAddress, WUsdtTokenAddress } from "@/utils/contracts";

import useUserVerificationStateStore from "@/stores/useUserVerificationStateStore";
import { ethers } from "ethers";
import { tokenusABI } from "@/abis/tokenUsAbi";
const wallets = [
  createWallet("io.metamask"),
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook", "phone"],
    },
  }),
];
interface NavbarProps {
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsProcessing }) => {
  const { userAuthorizationState, setUserAuthorizationState } =
    useUserVerificationStateStore();
  const [isUserSidebarOpen, setUserSidebarOpen] = useState(false);
  const currentPath = localStorage.getItem("XXcurrentPath") || "/";
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveAccount();
  const walletToDisconnect = useActiveWallet();
  const userAccount = useActiveAccount();
  const userWallet = userAccount?.address as string;
  const [userData, setUserData] = useState<any>(null);
  // const { data: balanceOf } = useReadContract({
  //   contract: TokenUs,
  //   method: "balanceOf",
  //   params: [userWallet],
  // });

  // const formattedBalance = balanceOf ? Number(balanceOf) / 1e6 : 0;


  //FIX AGREGAR USDT Y WUSDT EN EL BALANCE
  const [formattedBalance, setFormattedBalance] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    // Only fetch if balance is not already set

    console.log(userWallet)
    console.log(formattedBalance)
    if (!userWallet ) return;
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );

      const contract = new ethers.Contract(
        WUsdtTokenAddress,
        tokenusABI,
        provider
      );

      const usdtContract = new ethers.Contract(
        UsdtAddress,
        tokenusABI,
        provider
      );

      const balance = await contract.balanceOf(userWallet);
      const formattedBalance = Number(balance) / 1e6;

      const usdtBalance = await usdtContract.balanceOf(userWallet);
      const formattedUsdtBalance = Number(usdtBalance) / 1e6;

      console.log(formattedUsdtBalance)

      setUsdtBalance(formattedUsdtBalance)
      setFormattedBalance(formattedBalance);
    } catch (error) {
      console.error("Error obteniendo el balance:", error);
    }
  };

  useEffect(() => {
    // Only fetch if wallet exists and balance is not set
    if (userWallet && formattedBalance === null) {
      fetchBalance();
    }
  }, [userWallet, formattedBalance]);

  //trae el objeto de datos del usuario del local storage, si no hay los pide
  useEffect(() => {
    const fetchUserData = () => {
      const userDataString = localStorage.getItem("fullUserDataObject");
      if (userDataString) {
        const userDataObject = JSON.parse(userDataString);
        setUserData(userDataObject);
        return true;
      }
      return false;
    };

    const dataFound = fetchUserData();

    if (!dataFound) {
      const intervalId = setInterval(() => {
        const dataFound = fetchUserData();
        if (dataFound) {
          clearInterval(intervalId);
        }
      }, 4000);
      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [userAccount, setUserData]); // Dependencies

  // objeto de datos de usuario que se le pasa a la funcion de userSidebar para que muestre la información del usuario en la sidebar derecha
  const usuario = {
    nombre: userData?.first_name, //DEBEN TRAER EL NOMBRE DESDE BACK END
    email: userData?.email, //DEBEN TRAER EL EMAIL DESDE BACK END
    userWallet: userWallet && userWallet,
    tokens: formattedBalance && formattedBalance,
    usdtBalance: usdtBalance  && usdtBalance,
    network: "Polygon",
    contract:
      "0x00000000000000000000000000000000000000000x0000000000000000000000000000000000000000",
  };

  useEffect(() => {
    console.log("Active Wallet:", activeWallet);
    if (activeWallet) {
      handleConnectWithVerification(activeWallet.address.toString() as string);
    }
  }, [activeWallet]);

  const toggleUserSidebar = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setUserSidebarOpen(!isUserSidebarOpen);
    return;
  };

  const handleConnectWithVerification = async (wallet: string) => {
    let verificationProcessData;
    let fullUserDataObject;
    try {
      verificationProcessData = await getVerificationProcessData(wallet);
      console.log("use authorization data ", verificationProcessData);

      // Set the state directly from the backend response
      /* await */ setUserAuthorizationState(verificationProcessData);

      if (!verificationProcessData.register) {
        console.log("El usuario no se encuentra registrado");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/register";
        }
      }

      const responseFullUserDataObject = await getUserByWallet(wallet);

      if (responseFullUserDataObject === "usuario no encontrado") {
        console.log(
          "Parece que el usuario no se encuentra registrado en el sistema"
        );
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/register";
        }
      } else if (
        responseFullUserDataObject.wallet &&
        responseFullUserDataObject.id
      ) {
        localStorage.setItem(
          "fullUserDataObject",
          JSON.stringify(responseFullUserDataObject)
        );
      }
    } catch (error) {
      console.error("Error en la verificacion del usuario:", error);
    }
  };

  const stopConnection = () => {
    disconnect(walletToDisconnect as any);
    setUserSidebarOpen(false);

    localStorage?.clear();

    function deleteAllCookies() {
      const cookies = document?.cookie?.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }

    deleteAllCookies();

    if (window) {
      window.location.href = "/";
    }
  };

  const tabs = [
    { name: "Inicio", path: currentPath },
    { name: "Lanzamientos", path: "/lanzamientos" },
    { name: "Mercados", path: "/mercados" },
  ];

  return (
    <nav>
      <div className="flex justify-center lg:justify-end items-center md:mt-6 p-4 bg-white shadow-sm rounded-xl">
        <div className="flex items-center space-x-0 lg:space-x-6 flex-col lg:flex-row">
          <div className="flex items-center space-x-0 lg:space-x-2 mb-8 lg:mb-0">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-4 py-1 rounded-md transition-colors font-medium text-sm ${
                  location.pathname === tab.path
                    ? "text-c-primaryColor bg-gray-200"
                    : "text-gray-500 hover:text-c-primaryColor"
                }`}
              >
                {tab.name}
              </Link>
            ))}
            <button className="text-gray-500 hover:text-c-primaryColor">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 scale-75 lg:scale-100">
            {activeWallet ? (
              <div
                className="relative z-30 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserSidebarOpen(!isUserSidebarOpen);
                }}
              >
                <div className="bg-transparent border-none pointer-events-none">
                  {" "}
                  {/* pointer-events-none prevents click from propagating to the connect button */}
                  <ConnectButton
                    client={client}
                    wallets={wallets}
                    connectButton={{ label: "Conectar billetera" }}
                    locale={"es_ES"}
                    theme={lightTheme({
                      colors: {
                        primaryButtonBg: "#4880FF",
                        primaryButtonText: "#FFFFFF",
                      },
                    })}
                    /* onConnect={handleConnectWithVerification} */
                  />
                </div>
              </div>
            ) : (
              <ConnectButton
                client={client}
                wallets={wallets}
                connectButton={{ label: "Conectar billetera" }}
                locale={"es_ES"}
                theme={lightTheme({
                  colors: {
                    primaryButtonBg: "#4880FF",
                    primaryButtonText: "#FFFFFF",
                  },
                })}
                /*  onConnect={() => {
                }} */
              />
            )}
          </div>
        </div>
      </div>
     
      <UserSidebar
        isOpen={isUserSidebarOpen}
        onClose={toggleUserSidebar as () => void}
        usuario={usuario}
        stopConnection={stopConnection}
        setIsProcessing={setIsProcessing}
        fetchBalance={fetchBalance}
      />
    </nav>
  );
};

export default Navbar;
