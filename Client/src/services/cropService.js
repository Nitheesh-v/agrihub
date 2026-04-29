import API from "./api";

// 👨‍🌾 Add crop
export const createCrop = (data, token) =>
  API.post("/api/crops", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 🌍 Get all crops
export const getCrops = () => API.get("/api/crops");

// 👨‍🌾 My crops
export const getMyCrops = (token) =>
  API.get("/api/crops/my", {
    headers: { Authorization: `Bearer ${token}` },
  });