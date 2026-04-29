import API from "./api";

// 🏢 Create contract
export const createContract = (data, token) =>
  API.post("/api/contracts", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 👨‍🌾 Get contracts
export const getContracts = (token) =>
  API.get("/api/contracts", {
    headers: { Authorization: `Bearer ${token}` },
  });

// 👨‍🌾 Apply contract
export const applyContract = (id, token) =>
  API.post(`/api/contracts/apply/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 🏢 Get company contracts
export const getCompanyContracts = (token) =>
  API.get("/api/contracts/company", {
    headers: { Authorization: `Bearer ${token}` },
  });

// 🏢 Approve farmer
export const approveFarmer = (contractId, farmerId, token) =>
  API.put(
    "/api/contracts/approve",
    { contractId, farmerId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  export const getFarmerContracts = (token) =>
  API.get("/api/contracts/farmer", {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const signAgreement = (contractId, token) =>
  API.post(
    "/api/contracts/sign",
    { contractId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );



  export const payAdvance = (data, token) => {
  return API.post("/api/contracts/pay-advance", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const payInstallment = (data, token) => {
  return API.post("/api/contracts/pay-installment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const downloadAgreement = (id, token) =>
  API.get(`http://localhost:5000/api/contracts/agreement/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const verifyPayment = (data, token) =>
  API.post("/api/contracts/verify-payment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });


  export const createInstallmentOrder = (data, token) =>
  API.post("/api/contracts/installment-order", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const verifyInstallment = (data, token) =>
  API.post("/api/contracts/verify-installment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });