const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export async function getCountUsersRegistered(rangeInitial: string, rangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();

    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/registered/months?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count of registered users:", error);
    throw error;
  }
}

export async function getCountUsersRegisteredByDays(rangeInitial: string, rangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();

    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/registered/days?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count of registered users by days:", error);
    throw error;
  }
}


export async function getCountUsersCountry() {
  try {
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/by-country`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count of users by country:", error);
    throw error;
  }
}

export async function getKycRejectedByMonths(rangeInitial: string, rangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/kyc/rejected/months?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching KYC rejected counts:", error);
    throw error;
  }
}

export async function getKycRejectedByDays(rangeInitial: string, rangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/kyc/rejected/days?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching KYC rejected counts by days:", error);
    throw error;
  }
}

export async function getKycConversion(rangeInitial: string, rangeFinal: string) {  
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();

    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/kyc/conversion/months?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching KYC conversion rates:", error);
    throw error;
  }
}

export async function getKycConversionByDays(rangeInitial: string, rangeFinal: string) {  
  try {
    const queryParams = new URLSearchParams({
      rangeInitial,
      rangeFinal,
    }).toString();

    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/kyc/conversion/days/?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching KYC conversion rates:", error);
    throw error;
  }
}

export async function getActiveProjects(monthsRangeInitial: string, monthsRangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      monthsRangeInitial,
      monthsRangeFinal,
    }).toString();
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/projects/months?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching active projects counts:", error);
    throw error;
  }
}

export async function getActiveProjectsByDays(daysRangeInitial: string, daysRangeFinal: string) {
  try {
    const queryParams = new URLSearchParams({
      daysRangeInitial,
      daysRangeFinal,
    }).toString();
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/projects/days/?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching active projects counts:", error);
    throw error;
  }
}

export async function getTotalSupplyTokenUS() {
  try {
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/tokenus`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching total supply of TokenUS:", error);
    throw error;
  }
}

export async function getAvailableTokensUS() {
  try {
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/tokenus-available`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available supply of TokenUS:", error);
    throw error;
  }
}

export async function getCountProjectsGeneral() {
  try {
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/projects/general`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count of general projects:", error);
    throw error;
  }
}

export async function getCountUsersGeneral() {
  try {
    const response = await fetch(
      `${backendEndpoint}/admin/dashboard/count/users/general`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count of general users:", error);
    throw error;
  }
}