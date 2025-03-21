export interface InlineCheckoutRequest {
  merchant_code: string;
  pay_item_id: string;
  txn_ref: string;
  amount: number;
  currency: number;
  site_redirect_url?: string;
  onComplete: (response: PaymentResponse) => void;
  mode: "TEST";
}

export interface PaymentRequest {
  merchantCode: string;
  payItemId: string;
  customerEmail: string;
  customerMobile?: string;
  amount: number;
  currency: string;
  transactionReference: string;
  paymentDescription: string;
  redirectUrl?: string;
}

export interface PaymentResponse {
  transactionReference: string;
  responseCode: string;
  responseDescription: string;
  paymentStatus: string;
  amount: number;
  transactionDate: string;
}

export const INTERSWITCH_CONSTANTS = {
  TEST_MERCHANT_CODE: "MX25938",
  TEST_PAY_ITEM_ID: "101",
  CURRENCY_CODE: 566,
  MODE: "TEST" as const,
  GATEWAY_URL: "https://sandbox.interswitchng.com/collections/w/pay",
};

export const generateTransactionRef = (): string => {
  return `TXN-${Date.now()}-UNI`;
};

export const formatAmount = (amount: number): number => {
  return amount * 100;
};
