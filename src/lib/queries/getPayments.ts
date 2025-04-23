import { instance } from "../api";

export type Payment = {
  id: string;
  amount: string;
  reference: string;
  paystack_reference: string;
  payment_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_verification_attempt: string;
  student: string;
  enrollment: string;
};

export type PaymentResponse = {
  status: boolean;
  message: string;
  data: Payment[];
};

export const getPayments = async (): Promise<PaymentResponse> => {
  const response = await instance.get("/api/payments/");
  return response.data;
};
