import axios from "axios";

export const productApi = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
});

export const getDigitalProducts = async () => {
  const response = await productApi.get("/products");
  return response.data;
};