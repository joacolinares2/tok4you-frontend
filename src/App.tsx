import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/home/Inicio";
import ProjectDetail from "@/pages/project-detail";
import ProjectsDetails from "@/pages/lanzamientos/details"
import Projects from "./pages/Projects";
import Lanzamientos from "./pages/lanzamientos/lanzamientos";
import Mercados from "./pages/mercados/mercados";
import { HelmetProvider } from "react-helmet-async";
import RegisterPage from "./pages/register";
import TOS from "./pages/tos";
import KYCPage from "./pages/kyc";
import MiCuentaPage from "@/pages/mi-cuenta"; // Add this import
import TestingComponent from "./pages/testing";
import DashBoardPromotor from "@/pages/dashboardPromotor";
import DashBoardInversor from "@/pages/dashboardInvestor";
import AprobarProyectoPage from "@/pages/aprobarProyecto"; // Add this import
import PagoExitosoPage from "./pages/pagoExitoso";
import PagoNoExitosoPage from "./pages/pagoNoExitoso";
import AdminDashboard from "./pages/dashboardAdmin";
import { ListUsdToWusdPendingTransactions } from "./pages/bankTransactions/USDtoWUSD/ListUsdToWusdPendingTransactions";
import { ApproveUsdToWusdTransactions } from "./pages/bankTransactions/USDtoWUSD/ApproveUsdToWusdTransactions";
import { StartUsdToWusdTransaction } from "./pages/bankTransactions/USDtoWUSD/StartUsdToWusdTransaction";
import { PendingTransactions } from "./pages/bankTransactions";
import { ApproveWUSDToUSDTransaction } from "./pages/bankTransactions/WUSDtoUSD/ApproveWusdToUsdTransactions";

export function App() {
  const [userData, setUserData] = useState(null);

  //FIX Cada vez que se hace una orden de compra/venta o se ejecuta una accion de compra/venta debe aparecer una pantalla similar a compra de token y que aparezca bloqueada la pantalla y diga "Cargando..."
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    const getUserData = () => {
      const data = localStorage.getItem("userData");

      if (!data || data === "null" || data === "undefined" || data === "") {
      }

      return data ? JSON.parse(data) : null;
    };

    const data = getUserData();
    setUserData(data);
  }, []);


  

  return (
    <div>
      {isProcessing && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="text-white text-xl font-bold">Realizando compra...</div>
      </div>
      )}
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lanzamientos" element={<Lanzamientos />} />
          <Route path="/mercados" element={<Mercados />} />
          <Route
            path="/project-detail/:projectId"
            element={<ProjectDetail  setIsProcessing={setIsProcessing}/>}
          />
          <Route
            path="/project-details/:projectId"
            element={<ProjectsDetails setIsProcessing={setIsProcessing} />}
          />
          <Route path="/projects" element={<Projects />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/tos" element={<TOS />} />
          <Route path="/mi-cuenta" element={<MiCuentaPage />} />
          <Route path="/test" element={<TestingComponent />} />
          <Route path="/dashboardPromotor" element={<DashBoardPromotor />} />
          <Route path="/dashboardInversor" element={<DashBoardInversor />} />
          <Route path="/aprobarProyecto" element={<AprobarProyectoPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/user-bank-transfer"
            element={<StartUsdToWusdTransaction />}
          />

          <Route
            path="/admin/bank-transaction/list-pending-transactions"
            element={<PendingTransactions />}
          />
          <Route
            path="/admin/bank-transaction/USDtoWUSD/approve-transaction/:id"
            element={<ApproveUsdToWusdTransactions />}
          />
          <Route
            path="/admin/bank-transaction/WUSDtoUSD/approve-transaction/:id"
            element={<ApproveWUSDToUSDTransaction />}
          />
        </Routes>
      </HelmetProvider>
      <div id="loading-root"></div>
    </div>
  );
}

{
  /*   <Route
            path="/pago-exitoso-via-stripe"
            element={<PagoExitosoPage />}
          />
          <Route
            path="/pago-no-exitoso-via-stripe"
            element={<PagoNoExitosoPage />}
          /> */
}