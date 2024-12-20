const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export async function sendTransactionData(data: any) {
  const formData = new FormData();
  formData.append("userWallet", data.userWallet);
  formData.append("tokenAmount", data.usdAmount.toString());
  formData.append("usdAmount", data.usdAmount);
  formData.append("idTransactionEmittedByTheBank", data.transactionId);
  formData.append("bankThatEmittedTheTransaction", data.sourceBank);
  formData.append("bankThatReceivedTheTransaction", data.destinationBank);
  if (data.transactionDate) {
    formData.append("dayInWhichTheTransactionWasDone", data.transactionDate);
  }
  if (data.notes) {
    formData.append("notes", data.notes);
  }
  formData.append("userBankAccountNumber", data.userBankAccountNumber);
  formData.append("userBankAccountType", data.userBankAccountType);
  formData.append("imageReceipt", data.receipt);

  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/send/startTransactionWUSDtoUserWallet`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending transaction data:", error);
    throw error;
  }
}

export async function approveTransaction(data: any) {
  const formData = new FormData();

  // Append all existing fields
  formData.append("dbTransactionId", data.dbTransactionId);
  formData.append("userWallet", data.userWallet);
  formData.append("tokenAmount", data.tokenAmount);
  formData.append("usdAmount", data.usdAmount);
  formData.append(
    "idTransactionEmittedByTheBank",
    data.idTransactionEmittedByTheBank
  );
  formData.append(
    "bankThatEmittedTheTransaction",
    data.bankThatEmittedTheTransaction
  );
  formData.append(
    "bankThatReceivedTheTransaction",
    data.bankThatReceivedTheTransaction
  );
  formData.append(
    "dayInWhichTheTransactionWasDone",
    data.dayInWhichTheTransactionWasDone
  );
  formData.append("notes", data.notes);
  formData.append("userBankAccountNumber", data.userBankAccountNumber);
  formData.append("userBankAccountType", data.userBankAccountType);
  formData.append("adminBankAccountNumber", data.adminBankAccountNumber);
  formData.append("adminBankAccountType", data.adminBankAccountType);
  formData.append("adminWallet", data.adminWallet);

  // Append the new admin transaction receipt
  if (data.adminTransactionReceipt) {
    formData.append(
      "adminApprovalReceiptEmittedByTheBank",
      data.adminTransactionReceipt
    );
  }

  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/send/ApproveAndSendWUSDtoUserWallet`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving transaction:", error);
    throw error;
  }
}

export async function getBankTransactionsInformation(
  status?: string,
  transactionType?: string
) {
  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/getBankTransactionsInformation?status=${status}&transactionType=${transactionType}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching bank transactions information:", error);
    throw error;
  }
}


export async function approveWUSDToUSDTransaction(data: FormData) {
  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/send/ApproveWithdrawalOfWUSDtoUsd`,
      {
        method: "POST",
        body: data, // Send as FormData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving transaction:", error);
    throw error;
  }
}

export async function getTransactionDataById(id: number | string) {
  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/getBankTransactionInformationById/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw error;
  }
}



export async function startWithdrawalWUSDtoUsd(data: any) {
  try {
    const response = await fetch(
      `${backendEndpoint}/bank-transactions/send/startWithdrawalWUSDtoUsd`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWallet: data.userWallet,
          tokenAmount: data.tokenAmount.toString(),
          usdAmount: data.usdAmount.toString(),
          bankThatReceivedTheTransaction: data.bankThatReceivedTheTransaction,
          dayInWhichTheTransactionWasDone: data.dayInWhichTheTransactionWasDone,
          userBankAccountNumber: data.userBankAccountNumber,
          userBankAccountType: data.userBankAccountType,
          transactionHash: data.transactionHash,
          notes: data.notes,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error starting WUSD to USD withdrawal:", error);
    throw error;
  }
}
