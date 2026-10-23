declare module 'paypal-rest-sdk' {
  export interface PayPalLink {
    rel: string;
    href: string;
  }

  export interface PayPalPaymentResult {
    id: string;
    state?: string;
    links: PayPalLink[];
  }

  export interface PayPalPayoutResult {
    batch_header: {
      payout_batch_id: string;
      sender_batch_id: string;
      email_subject: string;
    };
  }

  export interface PayPalError {
    message: string;
    response?: unknown;
  }

  export interface PayPalConfiguration {
    mode?: 'sandbox' | 'live';
    client_id?: string;
    client_secret?: string;
    [key: string]: unknown;
  }

  const paypal: {
    configure(config: PayPalConfiguration): void;
    payment: {
      create(
        payment: Record<string, unknown>,
        callback: (error: PayPalError | null, payment: PayPalPaymentResult) => void
      ): void;
      execute(
        paymentId: string,
        options: Record<string, unknown>,
        callback: (error: PayPalError | null, payment: PayPalPaymentResult) => void
      ): void;
    };
    payout: {
      create(
        payout: Record<string, unknown>,
        callback: (error: PayPalError | null, payout: PayPalPayoutResult) => void
      ): void;
      get(
        payoutBatchId: string,
        callback: (error: PayPalError | null, payout: PayPalPayoutResult) => void
      ): void;
    };
    notification: {
      webhookEvent: {
        verify(
          headers: Record<string, string>,
          body: unknown,
          webhookId: string,
          callback: (error: PayPalError | null, verified: boolean) => void
        ): void;
      };
    };
  };

  export default paypal;
}
