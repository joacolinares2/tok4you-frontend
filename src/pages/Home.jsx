import React, { useState } from "react";
import { Bell } from "lucide-react";
import { client } from '../client';
import { ConnectButton, darkTheme } from 'thirdweb/react';
import { createWallet, inAppWallet, walletConnect } from "thirdweb/wallets";
import SideBar from "@/components/SideBar";
import Inicio from "@/components/home/Inicio";
import TokenUs from "@/assets/icons/TokenUs.png";
export default function Home() {
    const wallets = [
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        walletConnect(),
        inAppWallet({
            auth: {
                options: [
                    "email",
                    "google",
                    "apple",
                    "facebook",
                    "phone",
                ],
            },
        }),
    ];

    const [activeTab, setActiveTab] = useState("inicio");

    const buttonClasses = (tab) =>
        `px-4 py-2 rounded-full ${activeTab === tab
            ? "bg-gray-100 text-c-primaryColor font-medium"
            : "text-gray-500  hover:text-c-primaryColor"
        }`;

    const tabs = ["inicio", "lanzamientos", "mercados"];
    return (
      <div className="flex min-h-screen bg-gray-50 ">
        <SideBar />
        <div className="flex-1 flex flex-col bottom-0 lg:ml-72 ">
          {/* <a href="/" className="block md:hidden ml-48">
            <img
              src={TokenUs}
              alt="TokenUs Icon"
              className="w-40 h-auto mb-8 mt-3"
            />
          </a> */}
          <div className="flex justify-end items-center md:mt-6 p-4 bg-white shadow-sm rounded-xl">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded transition-colors font-medium text-sm ${
                      activeTab === tab
                        ? "bg-gray-100 text-c-primaryColor"
                        : "text-gray-500 hover:text-c-primaryColor"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <button className="text-gray-500 hover:text-c-primaryColor">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  connectButton={{ label: "Conectar billetera" }}
                  theme={darkTheme({
                    colors: {
                      primaryButtonBg: "#4880FF",
                      primaryButtonText: "#FFFFFF",
                    },
                  })}
                ></ConnectButton>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "inicio" && <Inicio />}
            {activeTab === "lanzamientos" && (
              <div>Lanzamientos content here</div>
            )}
            {activeTab === "mercados" && <div>Mercados content here</div>}
          </div>
        </div>
      </div>
    );
}