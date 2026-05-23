/** Future PayMongo / Stripe integration — stubs only. */

export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
};

export interface PaymentProvider {
  createIntent(amount: number, currency: string, metadata: Record<string, string>): Promise<PaymentIntent>;
  handleWebhook(payload: unknown, signature: string): Promise<void>;
}
