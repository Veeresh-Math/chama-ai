import paypal from 'paypal-rest-sdk';

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID!,
  client_secret: process.env.PAYPAL_CLIENT_SECRET!,
});

export const paypalSdk = paypal;

export async function createPayment({
  amount,
  currency = 'USD',
  description,
  returnUrl,
  cancelUrl,
  payerId,
}: {
  amount: number;
  currency?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  payerId?: string;
}) {
  return new Promise((resolve, reject) => {
    const payment = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: { return_url: returnUrl, cancel_url: cancelUrl },
      transactions: [{
        amount: { total: amount.toFixed(2), currency },
        description,
      }],
    };

    paypal.payment.create(payment, (err, payment) => {
      if (err) reject(err);
      else resolve(payment);
    });
  });
}

export async function executePayment(paymentId: string, payerId: string) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, { payer_id: payerId }, (err, payment) => {
      if (err) reject(err);
      else resolve(payment);
    });
  });
}

export async function createPayout({
  senderBatchId,
  emailSubject,
  items,
}: {
  senderBatchId: string;
  emailSubject: string;
  items: Array<{
    recipient_type: 'EMAIL' | 'PHONE';
    amount: { value: string; currency: string };
    receiver: string;
    note?: string;
  }>;
}) {
  return new Promise((resolve, reject) => {
    const payout = {
      sender_batch_header: { sender_batch_id: senderBatchId, email_subject: emailSubject },
      items,
    };

    paypal.payout.create(payout, (err, payout) => {
      if (err) reject(err);
      else resolve(payout);
    });
  });
}

export async function getPayoutStatus(payoutBatchId: string) {
  return new Promise((resolve, reject) => {
    paypal.payout.get(payoutBatchId, (err, payout) => {
      if (err) reject(err);
      else resolve(payout);
    });
  });
}

export function verifyWebhookSignature(
  webhookId: string,
  headers: Record<string, string>,
  body: unknown
): Promise<boolean> {
  return new Promise((resolve) => {
    paypal.notification.webhookEvent.verify(
      headers,
      body,
      webhookId,
      (err, verified) => {
        resolve(verified === true);
      }
    );
  });
}