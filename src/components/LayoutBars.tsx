import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  //FIX DETECTA CUANDO SE CAMBIO DE CUENTA
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.reload();
      console.log("Nueva cuenta conectada:", accounts[0]);
    };

    if (typeof window.ethereum !== "undefined") {
      // Escuchar cambios de cuenta
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    } else {
      console.error("MetaMask no está instalado.");
    }

    // Limpieza del evento
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  //FIX Agregue la pantalla de carga
  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Pantalla borrosa y mensaje de compra */}
      {isProcessing && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="text-white text-xl font-bold">Realizando compra...</div>
      </div>
      )}
        <SideBar />
        <div className="w-full flex-1 flex flex-col bottom-0 lg:ml-72">
          <Navbar setIsProcessing={setIsProcessing} />
          {children}
        </div>
    </div>
  );
};

export default Layout;
