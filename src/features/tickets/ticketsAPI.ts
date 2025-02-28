import { SupportTicket } from "../../types";

const BASE_URL = import.meta.env.VITE_CRUDCRUD_URL;
if (!BASE_URL) {
  throw new Error("Please set VITE_CRUDCRUD_URL in your .env file.");
}
const TICKETS_ENDPOINT = `${BASE_URL}/tickets`;

export async function getAllTickets(): Promise<SupportTicket[]> {
  const res = await fetch(TICKETS_ENDPOINT);
  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return res.json();
}

export async function createTicket(
  ticketData: Omit<SupportTicket, "_id">
): Promise<SupportTicket> {
  const res = await fetch(TICKETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketData),
  });
  if (!res.ok) {
    throw new Error("Failed to create ticket");
  }
  return res.json();
}

export async function updateTicket(
  ticketId: string,
  updated: Partial<SupportTicket>
): Promise<SupportTicket> {
  const resGet = await fetch(`${TICKETS_ENDPOINT}/${ticketId}`);
  if (!resGet.ok) {
    throw new Error("Failed to fetch ticket before update");
  }
  const existing: SupportTicket = await resGet.json();
  const merged = { ...existing, ...updated };
  delete (merged as any)._id;
  const resPut = await fetch(`${TICKETS_ENDPOINT}/${ticketId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(merged),
  });
  if (!resPut.ok) {
    throw new Error("Failed to update ticket");
  }
  return resPut.json();
}
