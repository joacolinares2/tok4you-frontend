import React from "react";
import { clasesActivo } from "@/data/projectCreation";

const SeleccionarClaseActivo: React.FC<{ setClaseActivoSeleccionada: React.Dispatch<React.SetStateAction<string | null>>, toggleFormProyect: () => void }> = ({ setClaseActivoSeleccionada, toggleFormProyect }) => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[75vh] lg:max-h-none overflow-hidden overflow-y-auto p-4 lg:p-1">
        {clasesActivo.map((clase) => (
          <div
            key={clase.id}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setClaseActivoSeleccionada(clase.titulo);
              toggleFormProyect(); // Cambia a mostrar el formulario tras seleccionar clase activo
            }}
          >
            <div className="text-center mb-2">{React.createElement(clase.icono)}</div> {/* Icono */}
            <h3 className="text-lg font-semibold mb-1">{clase.titulo}</h3>
            <p className="text-sm text-gray-500">{clase.descripcion}</p>
          </div>
        ))}
      </div>
    );
  };

  export default SeleccionarClaseActivo;