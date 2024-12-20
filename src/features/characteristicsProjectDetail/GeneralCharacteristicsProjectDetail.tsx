import React, { useState } from "react";
import { useProjectDetailsStore } from "@/stores/projectDetailStore/projectDetailStore"; // Import the Zustand store
import { formatDate } from "@/utils/formatDate/formatDate";
import { Button } from "@/components/ui/button";
import {  CircleArrowDown } from "lucide-react";

const GeneralCharacteristicsProjectDetail = () => {
  const projectDetails = useProjectDetailsStore(
    (state) => state.projectDetails
  ); // Get project details from Zustand store
  const [activeTab, setActiveTab] = useState("General"); // State for active tab

  const renderContent = () => {
    if (!projectDetails) return null;

    switch (activeTab) {
      case "General":
        return (
          <div className="flex flex-col h-52 overflow-y-scroll lg:grid lg:grid-cols-2 gap-4">
            {projectDetails.caracteristicasGenerales.map((item: any) => (
              <KeyValueDisplay
                key={item.nombre}
                title={item.nombre}
                content={item.texto}
              />
            ))}
          </div>
        );
      case "Finanzas":
        return (
          <div className="flex flex-col h-52 overflow-y-scroll lg:grid lg:grid-cols-2 gap-4">
            {Object.entries(projectDetails.caracteristicasFinanzas)
              .filter(
                ([key]) =>
                  ![
                    "ventaAnticipada",
                    "ventaPublica",
                    "createdAt",
                    "updatedAt",
                    "homeTestId",
                    "id",
                  ].includes(key)
              )
              .map(([key, value]) => (
                <KeyValueDisplay
                  key={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  content={value as string}
                />
              ))}
            <KeyValueDisplay
              title="Venta Anticipada"
              content={formatDate(
                projectDetails.caracteristicasFinanzas.ventaAnticipada
              )}
            />
            <KeyValueDisplay
              title="Venta Pública"
              content={formatDate(
                projectDetails.caracteristicasFinanzas.ventaPublica
              )}
            />
          </div>
        );

      case "Documentos":
        return (
          <div className="flex flex-col h- xl:max-w-full xl:overflow-y-scroll ">
            {projectDetails?.caracteristicasDocumentos.map((doc: any) => (
              <div
                key={doc.id}
                className="flex justify-between p-4 border-b items-center"
              >
                <div className="flex flex-col w-full ">
                  <span className="text-c-text-secondary">{doc.title}</span>
                  <span className="max-w-[30%] 2xl:max-w-full truncate">
                    {doc.link}
                  </span>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <a
                    href="https://stamping.io/asign/?&id=78a56145c425e157307fd51c008e83caa4872d84&scope=dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-c-primaryColor text-white" size="sm">
                      Firmar
                    </Button>
                  </a>

                  <a
                    href={doc.link}
                    className="text-c-primaryColor font-normal cursor-pointer underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CircleArrowDown
                      size={25}
                      className="text-gray-400 hover:text-c-primaryColor transition-colors"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        );


        case "Trazabilidad":
          return (
            <div className="flex flex-col h-52 overflow-y-scroll lg:grid lg:grid-cols-2 gap-4">
             Rastrar
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="py-1 max-w-full overflow-x-auto">
      <div className="flex">
        {["General", "Finanzas", "Documentos", "Trazabilidad"].map((tab) => (
          <button
            key={tab}
            className={`p-2 shadow-none rounded-none ${
              activeTab === tab
                ? "border-b-2 text-c-primaryColor  border-blue-500"
                : "border-b text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4  w-full">{renderContent()}</div>
    </div>
  );
};

const KeyValueDisplay = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div className="border p-4 rounded shadow">
    <h4 className=" text-c-text-secondary">{title}</h4>
    <p className="text-c-text-primary font-semibold">{content}</p>
  </div>
);

export default GeneralCharacteristicsProjectDetail;
