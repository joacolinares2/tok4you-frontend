import React, { useEffect, useState } from "react";
import { X, Mail, Copy } from "lucide-react";
import TokenSidebar from "./TokenSidebar";
import CopyValueWrapper from "./CopyValueWrapper";
import { shortenAddress } from "@/utils/stringTransformations/stringTransformations";
import { useActiveAccount } from "thirdweb/react";
import { WUsdtTokenAddress } from "@/utils/contracts";
interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: {
    nombre: string;
    email: string;
    userWallet: string;
    tokens: number | null;
    usdtBalance: number | null;
    network: string;
    contract: string;
  };
  stopConnection: () => void;
  setIsProcessing: any;
  fetchBalance: any,
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
  usuario,
  stopConnection,
  setIsProcessing,
  fetchBalance
}) => {
  const [isTokenSidebarOpen, setTokenSidebarOpen] = useState(true);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const walletProvider = localStorage.getItem('thirdweb:connected-wallet-ids')

  
  const addToken = async () => {
    const tokenAddress = WUsdtTokenAddress;
    const tokenSymbolVar = "WUSDT";
    const tokenDecimals = 6;
    const tokenImage = ''; // Imagen del token
  
    try {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbolVar,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });
  
        if (wasAdded) {
          console.log('Token added successfully!');
        } else {
          console.log('Token addition was not confirmed.');
        }
      } else {
        console.log('Ethereum object is not available. Make sure MetaMask is installed.');
      }
    } catch (error) {
      console.log('Error adding token:', error);
    }
  };


  useEffect(() => {

  
    console.log(walletProvider)
    if(walletProvider == `["io.metamask"]`){
      setIsMetamaskConnected(true)
    }
  }, [walletProvider]);

  return (
    <>
      {/* Oscurecer el fondo cuando el sidebar esté abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40" // Capa de fondo oscuro
          onClick={onClose} // Cierra el sidebar si se hace clic fuera del sidebar
        />
      )}

      <div
        className={`fixed rounded-lg z-50 top-0 right-0 w-full h-full md:w-80 lg:w-96 bg-white shadow-xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col items-center relative w-full h-full overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-lg font-bold mb-4">{usuario.nombre}</h2>

          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500" />
            <CopyValueWrapper valueToCopy={usuario.email}>
              <p className="text-gray-700">{usuario.email}</p>
            </CopyValueWrapper>
          </div>

          <div className="flex items-center justify-center flex-wrap w-[90%]">
            <CopyValueWrapper valueToCopy={usuario.userWallet}>
              <p className="text-gray-700">
                {shortenAddress(usuario.userWallet)}
              </p>
            </CopyValueWrapper>
          </div>

          {/*//FIX Hacer dinamico el balance de Wusdt y USDT*/}
          <button onClick={() =>{fetchBalance()}}>Refrescar saldos 🔄</button>
          <div className="text-center mb-6">


 
            <p className="text-3xl font-semibold text-c-primaryColor">
              {usuario.tokens}
            </p>
            <p className="text-c-primaryColor">Wusdt</p>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-3xl font-semibold text-c-primaryColor">
              {usuario.usdtBalance}
            </p>
            <p className="text-c-primaryColor">USDTs</p>
          </div>
          
          {isMetamaskConnected ? (
            <button
              onClick={addToken}
              className="text-xs font-semibold text-c-primaryColor p-2 border border-blue-500 rounded-md"
            >
              Agregar Wusdt en Metamask
            </button>
          ) : (
            <></>
          )}

          <div className="w-full">
            <TokenSidebar
              isOpen={isTokenSidebarOpen}
              wallet={usuario.userWallet}
              network={usuario.network}
              contract={usuario.contract}
              setIsProcessing={setIsProcessing}
            />
          </div>

          <button
            className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 mt-6"
            onClick={() => stopConnection()}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
