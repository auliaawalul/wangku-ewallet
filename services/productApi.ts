import axios from "axios";

export type DigitalProduct = {
  id: number;
  type: string;
  provider: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

const API_BASE_URL = "http://192.168.18.53:3001";

export const getDigitalProducts = async () => {
  const response = await axios.get<DigitalProduct[]>(
    `${API_BASE_URL}/digitalProducts`
  );

  return response.data;
};