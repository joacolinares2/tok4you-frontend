import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Video,
  HelpCircle,
  Users,
  Menu,
  X,
} from "lucide-react";
import TokenUs from "@/assets/icons/TokenUs.png";
import Token4You from "@/assets/icons/TOK4YOU.png";
import DISCORD from "@/assets/icons/brand-discord.png";
import FACEBOOK from "@/assets/icons/brand-facebook.png";
import INSTAGRAM from "@/assets/icons/brand-instagram.png";
import LINKEDIN from "@/assets/icons/brand-linkedin.png";
import TIKTOK from "@/assets/icons/brand-tiktok.png";
import WHATSAPP from "@/assets/icons/brand-whatsapp.png";
import tokenussmall from "@/assets/favicon.ico";
import { Link, useLocation } from "react-router-dom";
import MiCuenta from "@/components/mi-cuenta/MiCuenta";
import VerificationProcess from "./VerificationProcess";
import FormProyect from "@/components/FormProyect";
import { clasesActivo } from "@/data/projectCreation";
import SeleccionarClaseActivo from "@/components/SeleccionarClaseActivo";
import { set } from "react-hook-form";
import { useActiveAccount } from "thirdweb/react";
import { getRoleName } from "@/utils/getUserRoleByRoleId";
import { useUserDataStore } from "@/stores/useUserDataStore";
import useUserVerificationStateStore from "@/stores/useUserVerificationStateStore";

const SideBar: React.FC = () => {
  const { userAuthorizationState } = useUserVerificationStateStore();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFormProyect, setShowFormProyect] = useState(false);
  const [claseActivoSeleccionada, setClaseActivoSeleccionada] = useState<
    string | null
  >(null);
  const [mostrarSeleccionarClase, setMostrarSeleccionarClase] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    const firstPath = localStorage.getItem("XXcurrentPath") || "/";
    setCurrentPath(firstPath);
  }, [currentPath]);
  // Fetch user data from local storage

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
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [activeAccount, setUserData]); // Dependencies

  const handleLinkClick = (newPath: string) => {
    setCurrentPath(newPath);
    localStorage.setItem("XXcurrentPath", newPath);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFormProyect = () => {
    setShowFormProyect(!showFormProyect);
  };
  const toggleMostrarSeleccionarClase = () => {
    setMostrarSeleccionarClase(!mostrarSeleccionarClase);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <section className="z-30">
      <button
        id="menu-button"
        className="p-4 m-4 text-gray-500 hover:text-gray-800 fixed top-0 left-0 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 lg:hidden"></div>
      )}

      <aside
        id="sidebar"
        className={`fixed w-64 bg-white border-r border-gray-200 flex flex-col h-[96vh] shadow-sm rounded-xl lg:m-5 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-6 flex-grow flex flex-col mt-10 lg:mt-0">
          <Link to="/" className="" onClick={() => handleLinkClick("/")}>
            <img
              src={Token4You}
              alt="Tok4You Icon"
              className="w-40 h-auto mb-8 mt-3"
            />
          </Link>

          {activeAccount && (
            <div className="mb-6 relative border-t border-gray-200 pt-6">
              <div className="absolute -left-12 top-5 bottom-0 w-1 bg-c-primaryColor rounded-full"></div>
              <div className="pl-4">
                <h2 className="text-xl font-semibold truncate">
                  {userData?.first_name ? userData?.first_name : "¡Hola!"}
                </h2>
                <p className="text-sm text-gray-500">
                  {userData?.roleId ? getRoleName(userData?.roleId) : null}
                </p>
              </div>
            </div>
          )}

          <li
            className={`flex items-center space-x-3  ${
              currentPath === "/mi-cuenta" ? "text-c-primaryColor" : "text-gray-500"
            }`}
          >
            <Link
              to="/mi-cuenta"
              onClick={() => handleLinkClick("/mi-cuenta")}
              className="flex items-center space-x-3 mb-2 hover:text-c-primaryColor transition-colors"
            >
              <User size={18} className="text-gray-500" />
              <span>Estado de mi Cuenta</span>
            </Link>
          </li>

          <nav className="space-y-6 flex-grow pt-2">
            {userAuthorizationState?.hasTOS === false /* userRole === 1 */ && (
              <VerificationProcess
                handleLinkClick={handleLinkClick}
                currentPath={currentPath}
              />
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-semibold mb-2 text-gray-300">
                TUTORIALS
              </h3>
              <ul className="space-y-2 text-base font-medium">
                <li
                  className={`flex items-center space-x-3 ${
                    currentPath === "/videos-instructivos"
                      ? "text-c-primaryColor"
                      : "text-gray-500"
                  }`}
                >
                  <Link
                    to="/"
                    className="flex items-center space-x-3 hover:text-c-primaryColor transition-colors"
                  >
                    <Video size={18} className="text-gray-500" />
                    <span>Videos instructivos</span>
                  </Link>
                </li>
                <li
                  className={`flex items-center space-x-3 ${
                    currentPath === "/faq" ? "text-c-primaryColor" : "text-gray-500"
                  }`}
                >
                  <Link
                    to="/"
                    className="flex items-center space-x-3 hover:text-c-primaryColor transition-colors"
                  >
                    <HelpCircle size={18} className="text-gray-500" />
                    <span>FAQ</span>
                  </Link>
                </li>

                {activeAccount && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xs font-semibold mb-2 text-gray-300">
                      PROYECTOS
                    </h3>
                    <ul className="space-y-2 text-base font-medium">
                      <li className="flex items-center space-x-3">
                        <Link
                          to="/aprobarProyecto"
                          onClick={() => handleLinkClick("/aprobarProyecto")}
                          className="flex items-center  px-4 py-2 mb-2 bg-green-50 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors duration-300"
                        >
                          <span className="font-medium text-green-700">
                            Aprobar proyecto
                          </span>
                        </Link>
                      </li>

                      <li className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleMostrarSeleccionarClase()}
                          className="flex items-center px-4 py-2 bg-blue-50 rounded-md text-c-primaryColor hover:bg-blue-100 transition-colors"
                        >
                          <span>+ Crear proyecto</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-xs font-semibold mb-2 text-gray-300">
                SOCIAL
              </h3>
              <ul className="space-y-2 text-base font-medium">
                <li
                  className={`flex items-center space-x-3  ${
                    currentPath === "/comunidad"
                      ? "text-c-primaryColor"
                      : "text-gray-500"
                  }`}
                >
                  <a
                    href="https://Tok4You.io/"
                    target="_blank"
                    className="flex items-center space-x-4 hover:text-c-primaryColor transition-colors"
                  >
                    <img
                      src={tokenussmall}
                      alt="Nosotros"
                      className="w-4 h-auto ml-1 text-gray-400  hover:text-c-primaryColor transition-colors filter grayscale"
                    />
                    <span>Nosotros</span>
                  </a>
                </li>
                <li
                  className={`flex items-center space-x-3  ${
                    currentPath === "/comunidad"
                      ? "text-c-primaryColor"
                      : "text-gray-500"
                  }`}
                >
                  <Link
                    to="/"
                    className="flex items-center space-x-3 hover:text-c-primaryColor transition-colors"
                  >
                    <img
                      src={WHATSAPP}
                      alt="WhatsApp"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                    <span>Comunidad</span>
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={INSTAGRAM}
                      alt="Instagram"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={LINKEDIN}
                      alt="LinkedIn"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={DISCORD}
                      alt="Discord"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={FACEBOOK}
                      alt="Facebook"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={TIKTOK}
                      alt="TikTok"
                      className="w-6 h-6 text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      <div>
        {!showFormProyect && mostrarSeleccionarClase ? (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 "
            onClick={toggleMostrarSeleccionarClase}
          >
            <div
              className="bg-white rounded-lg  max-w-4xl  lg:p-10 space-y-4 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 className="text-lg font-semibold">Elegir categoría</h2>
                <button
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => toggleMostrarSeleccionarClase()}
                >
                  <X size={24} />
                </button>
              </div>
              <SeleccionarClaseActivo
                setClaseActivoSeleccionada={setClaseActivoSeleccionada}
                toggleFormProyect={toggleFormProyect}
              />
            </div>
          </div>
        ) : (
          showFormProyect && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg lg:min-w-[600px] max-w-4xl max-h-[75vh] lg:max-h-none overflow-hidden overflow-y-auto">
                <div className="flex sticky top-0 justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                  <h2 className="text-lg font-semibold">
                    Formulario de Proyecto
                  </h2>
                  <button
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={toggleFormProyect}
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <FormProyect
                    claseActivo={claseActivoSeleccionada}
                    toggleFormProyect={toggleFormProyect}
                    toggleMostrarSeleccionarClase={
                      toggleMostrarSeleccionarClase
                    }
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default SideBar;
