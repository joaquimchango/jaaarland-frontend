import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (credentials) => {
  const response = await api.post("/auth/register", credentials);
  return response.data;
};

export const verify = async () => {
  const response = await api.get("/auth/verify");
  return response.data;
};

export const logout = async () => {
  const response = await api.delete("/auth/logout");
  return response.data;
};