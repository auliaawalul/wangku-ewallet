export type DigitalProduct = {
  id: string;
  name: string;
  category: "Pulsa" | "Paket Data" | "Tagihan" | "E-Money" | string;
  provider: string;
  price: number;
  description: string;
  iconUrl: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  balance: number;
  photoURL: string;
  transactionPinHash: string;
  settings: {
    notifications: boolean;
    language: "id" | "en";
    theme: "light" | "dark";
  };
  createdAt: any;
};

export type WalletTransaction = {
  id?: string;
  uid: string;
  type: "topup" | "payment";
  title: string;
  category?: string;
  provider?: string;
  amount: number;
  status: "success" | "failed";
  createdAt: any;
};