import API from "./api";

export const createPayment = (amount, token) =>
  API.post(
    "/api/payment/create",
    { amount },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );


  export const verifyPayment = (data, token) =>
  API.post("/api/payment/verify", data, {
    headers: { Authorization: `Bearer ${token}` },
  });