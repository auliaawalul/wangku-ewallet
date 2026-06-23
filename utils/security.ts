import * as Crypto from "expo-crypto";

export const normalizePhone = (value: string) => {
  let phone = value.replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "62" + phone.substring(1);
  }

  return phone;
};

export const looksLikePhone = (value: string) => {
  const text = value.trim();
  return !text.includes("@") && /^[0-9+\-\s]+$/.test(text);
};

export const isBirthDateAllowed = (birthDate: string) => {
  const date = new Date(`${birthDate}T00:00:00`);
  const limitDate = new Date("2010-01-01T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date < limitDate;
};

export const isPinValid = (pin: string) => {
  return /^\d{6}$/.test(pin);
};

export const hashPin = async (pin: string) => {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin
  );
};