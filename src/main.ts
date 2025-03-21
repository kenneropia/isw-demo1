import "./style.css";
import {
  INTERSWITCH_CONSTANTS,
  generateTransactionRef,
  formatAmount,
  PaymentResponse,
  InlineCheckoutRequest,
} from "./types";

const form = document.querySelector<HTMLFormElement>("#payment-form")!;

// Payment callback function to handle the response
const paymentCallback = (response: PaymentResponse) => {
  console.log("Payment Response:", response);
  // Handle the payment response here
  if (response.responseCode === "00") {
    // Redirect to verification page with transaction reference and amount
    const params = new URLSearchParams({
      txnRef: response.transactionReference,
      amount: response.amount.toString(),
    });
    window.location.href = `/verify.html?${params}`;
  } else {
    alert(`Payment failed: ${response.responseDescription}`);
  }
};

form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const amount = parseFloat(
    document.querySelector<HTMLInputElement>("#amount")!.value
  );

  const paymentRequest: InlineCheckoutRequest = {
    merchant_code: INTERSWITCH_CONSTANTS.TEST_MERCHANT_CODE,
    pay_item_id: INTERSWITCH_CONSTANTS.TEST_PAY_ITEM_ID,
    txn_ref: generateTransactionRef(),
    amount: formatAmount(amount),
    currency: INTERSWITCH_CONSTANTS.CURRENCY_CODE,
    site_redirect_url: window.location.href,
    onComplete: paymentCallback,
    mode: INTERSWITCH_CONSTANTS.MODE,
  };

  console.log(paymentRequest);

  (window as any).webpayCheckout(paymentRequest);
});
