export type DigitalProduct = {
  id: number;
  type: string;
  provider: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

const BASE_URL = "http://10.204.95.179:3000"; 

export const getDigitalProducts = async () => {
  try {
    // 👈 DIUBAH: Endpoint disesuaikan dengan key JSON kamu yaitu digitalProducts
    const response = await fetch(`${BASE_URL}/digitalProducts`);
    if (!response.ok) {
      throw new Error("Respon server bermasalah");
    }
    const result = await response.json();
    
    // 👈 DIUBAH: Mengembalikan array digitalProducts di dalam objek, jika tidak ada kembalikan array kosong
    return result.digitalProducts || result;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};