import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../alert/Alert";

const MiCuenta: React.FC = () => {
  const navigate = useNavigate();
  const verificationProcessData = localStorage.getItem(
    "verification-process-data"
  );
  const verificationProcessDataObject = verificationProcessData
    ? JSON.parse(verificationProcessData)
    : null;

  const alertRenderer = () => {
    if (
      verificationProcessDataObject?.register === false &&
      verificationProcessDataObject?.hasKYC === false &&
      verificationProcessDataObject?.hasTOS === false
    ) {
      return (
        <Alert
          message="Debes completar el registro de usuario, KYC y TOS para poder invertir."
          type="error"
        />
      );
    }

    if (
      verificationProcessDataObject?.register === true &&
      verificationProcessDataObject?.hasKYC === false &&
      verificationProcessDataObject?.hasTOS === false
    ) {
      return (
        <Alert
          message="Continúa con el proceso de KYC y TOS para poder invertir."
          type="warning"
        />
      );
    }

    if (
      verificationProcessDataObject?.register === true &&
      verificationProcessDataObject?.hasKYC === true &&
      verificationProcessDataObject?.hasTOS === false
    ) {
      return (
        <Alert
          message="Ya completaste la verificación de usuario y KYC, te falta firmar los términos de servicio (TOS)."
          type="warning"
        />
      );
    }

    if (
      verificationProcessDataObject?.register === true &&
      verificationProcessDataObject?.hasKYC === true &&
      verificationProcessDataObject?.hasTOS === true
    ) {
      return (
        <Alert
          message="Ya completaste la verificación de usuario, ya puedes invertir."
          type="success"
        />
      );
    }

    return (
      <Alert
        message="Algo salió mal, intenta cerrar sesión y volver a entrar, si el problema persiste contacta al equipo de soporte."
        type="error"
      />
    );
  };

  return (
    <section className="flex justify-center items-center ">
      <div className="bg-white rounded-lg p-4 w-full md:w-auto my-4">
        <div className="mi-cuenta-container my-4">{alertRenderer()}</div>

        {verificationProcessDataObject?.register &&
          verificationProcessDataObject?.hasKYC &&
          verificationProcessDataObject?.hasTOS && (
            <button
              className="w-full bg-c-primaryColor  text-white py-2 px-4 rounded-md hover:bg-c-secondaryColor transition-colors"
              onClick={() => navigate("/")}
            >
              Da clic aquí para explorar proyectos de inversión
            </button>
          )}
      </div>
    </section>
  );
};

export default MiCuenta;
