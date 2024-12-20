import { showErrorAlert } from "@/utils/notificationsListWithReactToastify/notifications";

const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export async function createUser(data: any) {
  try {
    const response: any = await fetch(`${backendEndpoint}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData?.message === "La billetera ya existe") {
      showErrorAlert(
        "Puede que esta billetera ya exista en nuestro sistema. Si tienes registrada una cuenta, intenta acceder con ella."
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error creando nuevo usuario:", error);
    throw error;
  }
}
