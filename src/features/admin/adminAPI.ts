import { Booking, User, SupportTicket } from "../../types.d";
import { getAllTickets, updateTicket } from "../tickets/ticketsAPI";

const BASE_URL = import.meta.env.VITE_CRUDCRUD_URL || "";
const BOOKINGS_ENDPOINT = `${BASE_URL}/bookings`;
const USERS_ENDPOINT = `${BASE_URL}/users`;

export async function adminFetchAllBookings(): Promise<Booking[]> {
  const res = await fetch(BOOKINGS_ENDPOINT);
  if (!res.ok) {
    throw new Error("Failed to fetch all bookings");
  }
  return res.json();
}

export async function adminFetchAllUsers(): Promise<User[]> {
  const res = await fetch(USERS_ENDPOINT);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

export async function adminFetchTickets(): Promise<SupportTicket[]> {
  return getAllTickets(); 
}

export async function adminDeleteBooking(bookingId: string): Promise<void> {
  const confirmRes = await fetch(`${BOOKINGS_ENDPOINT}/${bookingId}`, { method: "DELETE" });
  if (!confirmRes.ok) {
    throw new Error("Failed to delete booking");
  }
}

export async function adminUpdateBooking(updated: Booking): Promise<Booking> {
  if (!updated._id) {
    throw new Error("Cannot update booking without _id");
  }
  const { _id, ...putBody } = updated;
  const res = await fetch(`${BOOKINGS_ENDPOINT}/${_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(putBody),
  });
  if (!res.ok) {
    throw new Error("Failed to update booking");
  }
  return updated;
}

export async function adminConfirmCancelMember(userId: string, reason: string): Promise<void> {
  const userRes = await fetch(`${USERS_ENDPOINT}/${userId}`);
  if (!userRes.ok) {
    throw new Error("Failed to fetch that user first");
  }
  const userData: User = await userRes.json();
  const putBody = {
    ...userData,
    banned: true,
    banReason: reason,
  };
  delete putBody._id;
  const res = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(putBody),
  });
  if (!res.ok) {
    throw new Error("Failed to cancel membership");
  }
}

export async function adminDeleteUser(userId: string): Promise<void> {
  const res = await fetch(`${USERS_ENDPOINT}/${userId}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
}

export async function adminRestartMember(userId: string): Promise<void> {
  const userRes = await fetch(`${USERS_ENDPOINT}/${userId}`);
  if (!userRes.ok) {
    throw new Error("Failed to fetch user record");
  }
  const userData: User = await userRes.json();
  const putBody = {
    ...userData,
    banned: false,
    banReason: undefined,
  };
  delete putBody._id;
  const res = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(putBody),
  });
  if (!res.ok) {
    throw new Error("Failed to restart membership");
  }
}

export async function adminCloseTicket(ticketId: string): Promise<void> {
  await updateTicket(ticketId, { status: "closed" });
}