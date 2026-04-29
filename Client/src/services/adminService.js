import API from "./api";

// 👨‍💼 Get all users
export const getUsers = (token) =>
  API.get("/api/auth/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

// 👨‍💼 Verify user
export const verifyUser = (data, token) =>
  API.put("/api/auth/verify-user", data, {
    headers: { Authorization: `Bearer ${token}` },
  });