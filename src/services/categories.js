import api from "./api";

export const getCategorySummary = async () => {
  const response = await api.get("/api/products/category-summary");
  return response.data;
};
