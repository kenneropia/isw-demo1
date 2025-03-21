import { INTERSWITCH_CONSTANTS, PaymentResponse } from "./types";

// Get transaction reference from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const txnRef = urlParams.get("txnRef");
const originalAmount = urlParams.get("amount");

const resultContainer = document.querySelector<HTMLDivElement>(
  "#verification-result"
)!;

interface VerificationResponse {
  Amount: number;
  ResponseCode: string;
  ResponseDescription: string;
  PaymentStatus: string;
  TransactionDate: string;
}

async function verifyTransaction(txnRef: string, amount: string) {
  try {
    // In a real implementation, this request should be made from your backend
    const verificationUrl = `https://qa.interswitchng.com/collections/api/v1/gettransaction.json`;
    const params = new URLSearchParams({
      merchantcode: INTERSWITCH_CONSTANTS.TEST_MERCHANT_CODE,
      transactionreference: txnRef,
      amount: amount,
    });

    // Note: This is for demonstration only. In production, make this request from your backend
    const response = await fetch(`${verificationUrl}?${params}`);
    const data: VerificationResponse = await response.json();

    // Display verification result
    const resultHtml = `
      <div class="${data.ResponseCode === "00" ? "success" : "error"}">
        <h2>Transaction Verification Result</h2>
        <p><strong>⚠️ Important Note:</strong> This verification should be performed on your backend server before giving value to the customer.</p>
        <div class="result-details">
          <p><strong>Status:</strong> ${data.PaymentStatus}</p>
          <p><strong>Amount Paid:</strong> ₦${(data.Amount / 100).toFixed(
            2
          )}</p>
          <p><strong>Response Code:</strong> ${data.ResponseCode}</p>
          <p><strong>Description:</strong> ${data.ResponseDescription}</p>
          <p><strong>Transaction Date:</strong> ${data.TransactionDate}</p>
          ${
            data.ResponseCode === "00"
              ? `<p class="amount-validation">${
                  Number(originalAmount) === data.Amount
                    ? "✅ Amount matches original transaction"
                    : "❌ Warning: Amount mismatch detected!"
                }</p>`
              : ""
          }
        </div>
      </div>
    `;

    resultContainer.innerHTML = resultHtml;
  } catch (error) {
    resultContainer.innerHTML = `
      <div class="error">
        <h2>Verification Error</h2>
        <p>An error occurred while verifying the transaction. Please try again later.</p>
        <p><small>Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }</small></p>
      </div>
    `;
  }
}

// Start verification if transaction reference is present
if (txnRef && originalAmount) {
  verifyTransaction(txnRef, originalAmount);
} else {
  resultContainer.innerHTML = `
    <div class="error">
      <h2>Invalid Request</h2>
      <p>Missing transaction reference or amount parameter.</p>
    </div>
  `;
}
