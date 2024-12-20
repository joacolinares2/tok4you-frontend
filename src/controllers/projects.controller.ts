const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export async function getAllHomeTests() {
  try {
    const response = await fetch(`${backendEndpoint}/home`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching HomeTests:", error);
    throw error;
  }
}

export async function getProjectById(projectId: string) {
  try {
    const response = await fetch(`${backendEndpoint}/home/${projectId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
}

export async function getApprovedProjectById(projectId: string) {
  try {
    const response = await fetch(`${backendEndpoint}/projects/${projectId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
}

export async function sendDataToSignTheTransaction({
  walletAddress,
  amount,
}: {
  walletAddress: string;
  amount: number;
}) {
  try {
    const response = await fetch(`${backendEndpoint}/token/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, amount }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error sending data buy  the backend:", error);
    throw error;
  }
}

export async function sendTransactionToken({
  idtransaction,
  signature,
  projectId,
  walletAddress,
}: {
  idtransaction: string;
  signature: string;
  projectId: string;
  walletAddress: string;
}) {
  try {
    const response = await fetch(`${backendEndpoint}/token/project/signed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idtransaction,
        signature,
        projectId,
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error sending the transaction signature:", error);
    throw error;
  }
}

export const getAllPendingProjects = async () => {
  try {
    const response = await fetch(
      `${backendEndpoint}/projects/pending-projects`
    );

    if (!response.ok) {
      throw new Error("La peticion no fue exitosa");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo proyectos pendientes:", error);
    throw error;
  }
};

export const getAllApprovedProjects = async () => {
  try {
    const response = await fetch(
      `${backendEndpoint}/projects/approved-projects`
    );

    if (!response.ok) {
      throw new Error("La peticion no fue exitosa");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo proyectos pendientes:", error);
    throw error;
  }
};

export const updateProjectStatus = async (
  tokenizedAssetId: string,
  status: string
) => {
  try {
    const response = await fetch(`${backendEndpoint}/projects/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenizedAssetId,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error("The request was not successful");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating project status:", error);
    throw error;
  }
};


export const approveProjectAndSendItToBlockchain = async ({
  projectId,
  usersWalletAddress,
}: {
  projectId: number;
  usersWalletAddress: string;
}) => {
  try {
    const response = await fetch(
      `${backendEndpoint}/projects/send-project-to-web3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          walletUser: usersWalletAddress,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("La peticion no fue exitosa");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error enviando proyecto a Blockchain:", error);
    return { error: "Error enviando proyecto a Blockchain:" };
  }
};