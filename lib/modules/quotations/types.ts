/** Future quotation module — interface only. */
export type QuoteStatus = "draft" | "sent" | "accepted" | "expired";

export interface QuoteRepository {
  createFromLead(leadId: string): Promise<string>;
}
