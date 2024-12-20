import { showErrorAlert } from "@/utils/notificationsListWithReactToastify/notifications";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export const getUserByWallet = async (wallet: string) => {
  try {
    const response = await fetch(`${backendEndpoint}/users/${wallet}`);

    const data = await response.json();

    if (!response.ok) {
      showErrorAlert("La peticion salio mal, intenta nuevamente por favor");
    }

    if (data.message === "usuario no encontrado") {
      return "Parece que el usuario no existe en nuestro sistema";
    }

    if (data.wallet && data.id) {
      return data;
    }

    return "usuario no encontrado";
  } catch (error) {
    console.error(
      "Error buscando la billetera del usuario en el sistema:",
      error
    );
    throw error;
  }
};

