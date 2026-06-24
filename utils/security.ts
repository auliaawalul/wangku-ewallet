import * as Crypto from "expo-crypto";

// Fungsi untuk membuat hash PIN baru
export const hashPin = async (pin: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin.trim()
  );
};

// Fungsi untuk memverifikasi apakah PIN cocok
export const verifyPin = async (
  inputPin: string,
  savedPinHash: string
) => {
  const inputHash = await hashPin(inputPin);
  return inputHash === savedPinHash;
};

// 👈 PERBAIKAN: Tambahkan alias ini agar halaman Profil yang memanggil 'isPinValid' tidak error lagi!
export const isPinValid = verifyPin;