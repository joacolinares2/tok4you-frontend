import { showErrorAlert } from "@/utils/notificationsListWithReactToastify/notifications";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export async function getStampingSignTosLink({
  name,
  wallet,
}: {
  name: string;
  wallet: string;
}) {
  if (!name || !wallet) {
    return "Nombre y billetera son campos requeridos, no se encontraron tus datos nombre y billetera. Recarga la página e inicia sesión de nuevo.";
  }

  const cachedSignLink = localStorage.getItem("sign-tos-link");
  if (cachedSignLink) {
    return JSON.parse(cachedSignLink);
  }

  try {
    // Construct the URL with query parameters
    const url = new URL(`${backendEndpoint}/authorization/get-sign-tos-link`);
    url.searchParams.append("name", name);
    url.searchParams.append("wallet", wallet);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      showErrorAlert("La respuesta de la red no fue exitosa.");
    }

    const data = await response.json();

    if (data.message !== "link a la firma de tos obtenido") {
      showErrorAlert(
        "Error al obtener el link de la firma de tos. Intenta de nuevo por favor."
      );
    }

    localStorage.setItem("sign-tos-link", JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    console.error("Error al obtener el link de la firma de tos:", error);
    showErrorAlert(
      "Error al obtener el link de la firma de tos. Intenta de nuevo por favor."
    );
  }
}

export async function getVerificationProcessData(wallet: string) {
  try {
    const response = await fetch(
      `${backendEndpoint}/validations/status/${wallet}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("La respuesta de la red no fue exitosa.");
    }

    const data = await response.json();

    localStorage.setItem("verification-process-data", JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Error al obtener los datos de verificacion:", error);
    showErrorAlert(
      "Error al obtener los datos de verificacion. Intenta de nuevo por favor."
    );
  }
}

export async function updateUserVerification({
  wallet,
  hasKYC,
  hasTOS,
}: {
  wallet: string;
  hasKYC?: string;
  hasTOS?: string;
}) {
  if (!wallet) {
    showErrorAlert("La dirección de la billetera es requerida.");
    return;
  }

  try {
    const url = `${backendEndpoint}/validations/status/${wallet}`;

    const requestBody: { hasKYC?: string; hasTOS?: string } = {};
    if (hasKYC !== undefined) requestBody.hasKYC = hasKYC;
    if (hasTOS !== undefined) requestBody.hasTOS = hasTOS;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      showErrorAlert(
        "La respuesta de la red no fue exitosa. Intenta de nuevo o más tarde por favor."
      );
      return;
    }

    const data = await response.json();

    if (data.message !== "Verificación del usuario actualizada") {
      showErrorAlert(
        "Error al actualizar la verificación del usuario. Intenta de nuevo por favor."
      );
      return;
    }

    console.log("Verificación del usuario actualizada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar la verificación del usuario:", error);
    showErrorAlert(
      "Error al actualizar la verificación del usuario. Intenta de nuevo por favor."
    );
  }
}


export const getSumsubTokenAndStoreIt = async (
  walletAsUserId: string,
  levelName: string
) => {
  if (!walletAsUserId || !levelName) {
    showErrorAlert("La dirección de la billetera y el nivel son requeridos.");
    return;
  }

  try {
    const response = await fetch(
      `${backendEndpoint}/sumsub/get-sumsub-token-and-store-it`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAsUserId, levelName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error obteniendo el token de sumsub: ${data.message}`);
    }

    if (data?.message === "success" && data?.token !== undefined) {
      return {
        message: "success",
        token: data?.token,
        userId: data?.userId,
      };
    } else {
      throw new Error("Error obteniendo o guardando el token");
    }
  } catch (error) {
    console.error(
      "Error en nuestro servidor obteniendo el token de sumsub:",
      error
    );
    showErrorAlert(
      "Error en nuestro servidor obteniendo el token de sumsub. Intenta de nuevo más tarde por favor."
    );
  }
};



export const getApplicantKycStateFromSumsub = async (wallet: string) => {
  try {
    const response = await fetch(
      `${backendEndpoint}/sumsub/get-applicant-kyc-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userWallet: wallet }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching KYC status: ${data.message}`);
    }

    if (data?.message === "Usuario aprobado por sumsub") {
      return data;
    } else if (data?.message === "Usuario NO aprobado por sumsub todavia") {
      return data;
    }
  } catch (error) {
    console.error("Error in our server fetching the KYC status:", error);
    return {
      message:
        "Error trayendo el estado de KYC. Intenta de nuevo más tarde por favor.",
    };
    /* showErrorAlert(
      "Error en nuestro servidor obteniendo el estado de KYC. Intenta de nuevo más tarde por favor."
    ); */
  }
};
