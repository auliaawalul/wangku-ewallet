import * as Crypto from "expo-crypto";

export const hashPin = async (pin: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin.trim()
  );
};

export const verifyPin = async (
  inputPin: string,
  savedPinHash: string
) => {
  const inputHash = await hashPin(inputPin);
  return inputHash === savedPinHash;
};