export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingRepository {
  schedule(leadId: string, slot: string): Promise<string>;
}
