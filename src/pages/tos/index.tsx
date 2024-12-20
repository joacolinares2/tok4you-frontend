import React, { useEffect, useState } from "react";
import Layout from "@/components/LayoutBars";
import { useActiveAccount } from "thirdweb/react";
import { useNavigate } from "react-router-dom";

import {
  getStampingSignTosLink,
  getVerificationProcessData,
  updateUserVerification,
} from "@/controllers/verification.controller";
import { redirectToPath } from "@/lib/changePath";
import { toast } from "react-toastify";
const Tos: React.FC = () => {
  const navigate = useNavigate();
  const activeAccountWallet = useActiveAccount();
  const userName = "usuario por defecto";
  const wallet = activeAccountWallet;

  console.log(userName, wallet);

  const [dynamicLink, setDynamicLink] = useState<string>("");

  const handleGetStampingSignTosLink = async () => {
    const verificationProcessData = localStorage.getItem(
      "verification-process-data"
    );

    if (verificationProcessData) {
      const verificationProcessDataObject = JSON.parse(verificationProcessData);
      // console.log(verificationProcessDataObject);
      if (verificationProcessDataObject.hasTOS === true) {
        redirectToPath(navigate, "/mi-cuenta");
        toast.success("Ya has firmado los términos de servicio.");
        return;
      }
    }

    console.log("Fetching stamping sign TOS link...");

    if (!activeAccountWallet) {
      console.error("No active account wallet found.");
      return;
    }

    const responselink = await getStampingSignTosLink({
      name: userName,
      wallet: activeAccountWallet?.address.toString() as string,
    });

    console.log("Response link:", responselink);

    if (
      responselink &&
      responselink !== "" &&
      responselink.startsWith("https")
    ) {
      setDynamicLink(responselink);
    } else {
      console.error("Invalid response link:", responselink);
    }
  };

  useEffect(() => {
    handleGetStampingSignTosLink();
  }, [activeAccountWallet]);

  return (
    <Layout /* path="/Tos" */>
      <section className="w-full flex justify-center my-4 p-8">
        <div className="flex-1 w-full h-full p-8 mx-[2%] xl:mx-[6%] 2xl:mx-[12%] max-w-[1224px] flex-col flex items-center gap-10 bg-white rounded-xl">
          <h1 className="text-2xl font-bold text-center">
            Firmar términos de servicio
          </h1>
          <p>
            Por favor revisa los términos de servicio de la plataforma. Al darle
            click al botón de firmar y completar el proceso de firma con
            Stamping, estarás aceptando los términos de servicio que rigen
            nuestra relación y se te entregará un certificado de firma. Cuando
            lo obtengas, descárgalo.
          </p>
          <p>
            Cuando ya hayas descargado el certificado de firma, regresa a la
            plataforma. Al firmar, se verificará que en nuestros servidores toda
            tu información se encuentre correcta y ya podrás comenzar a
            invertir.
          </p>

          <button
            onClick={async () => {
              if (dynamicLink) {
                window.open(dynamicLink, "_blank");
              } else {
                console.error("No dynamic link found.");
              }

              await updateUserVerification({
                wallet: activeAccountWallet?.address.toString() as string,
                hasTOS: "true",
              });

              await getVerificationProcessData(
                activeAccountWallet?.address.toString() as string
              );

              redirectToPath(navigate, "/mi-cuenta");
            }}
            className="bg-c-primaryColor text-white py-4 px-8 rounded-md hover:bg-c-secondaryColor transition-colors"
          >
            Firmar
          </button>
          {/* </a> */}
        </div>
      </section>
    </Layout>
  );
};

export default Tos;
