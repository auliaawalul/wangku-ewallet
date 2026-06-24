
export type DigitalProduct = {
  id: number;
  type: string;
  provider: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

// Ganti dengan IP Address laptop kamu yang didapat dari langkah ke-2
const BASE_URL = "http://10.204.95.179:3000"; 

export const getDigitalProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Respon server bermasalah");
    }
    return await response.json();
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};