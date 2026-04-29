import API from "./api";

// Place order



export const createOrder = (data, token) => {
  return API.post("/api/orders", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get my orders
export const getMyOrders = (token) =>
  API.get("/api/orders/my", {
    headers: { Authorization: `Bearer ${token}` },
  });