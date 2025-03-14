import type { Booking } from "../../types.d";

const BASE_URL = import.meta.env.VITE_CRUDCRUD_URL;
if (!BASE_URL) {
  throw new Error("Please set VITE_CRUDCRUD_URL in your .env file.");
}

const BOOKINGS_ENDPOINT = `${BASE_URL}/bookings`;

export async function getAllBookings(): Promise<Booking[]> {
  const res = await fetch(BOOKINGS_ENDPOINT);
  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return res.json();
}

export async function fetchAllBookingsForUser(
  email: string,
  isLoggedIn: boolean
) {
  const all = await getAllBookings();
  if (email && isLoggedIn) {
    const userOnly = all.filter(
      (b) => b.userEmail?.toLowerCase() === email.toLowerCase()
    );
    return { allBookings: all, userBookings: userOnly };
  }
  return { allBookings: all, userBookings: [] };
}

async function createOrUpdateBooking(booking: Booking): Promise<Booking> {
  const { _id, ...body } = booking;

  if (!_id) {
    const res = await fetch(BOOKINGS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("Failed to create booking");
    }
    return await res.json();
  } else {
    const res = await fetch(`${BOOKINGS_ENDPOINT}/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("Failed to update booking");
    }
    return { ...booking };
  }
}

export async function createBooking(booking: Booking): Promise<Booking> {
  if (booking._id) {
    console.warn("createBooking called with an _id, ignoring _id for creation");
    delete booking._id;
  }
  return createOrUpdateBooking(booking);
}

export async function updateBooking(updated: Booking): Promise<Booking> {
  if (!updated._id) {
    throw new Error("updateBooking requires a booking with _id");
  }
  return createOrUpdateBooking(updated);
}

export async function deleteBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete booking");
  }
}

export function findNextAvailableTime(
  allBookings: Booking[],
  dateStr: string,
  court: string,
  currentTime: string
): string | null {
  let hour = parseInt(currentTime.split(":")[0], 10);
  let minute = parseInt(currentTime.split(":")[1], 10);
  while (true) {
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
    if (hour >= 22) {
      return null;
    }
    const hh = hour.toString().padStart(2, "0");
    const mm = minute.toString().padStart(2, "0");
    const t = `${hh}:${mm}`;
    const conflict = allBookings.some(
      (b) => b.date === dateStr && b.court === court && b.time === t
    );
    if (!conflict) {
      return t;
    }
  }
}
