export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export type WalletTransaction = {
  id?: string;
  uid: string;
  type: "topup" | "payment" | "transfer";
  title: string;
  amount: number;
  status: "success" | "failed";
  createdAt: any;
};