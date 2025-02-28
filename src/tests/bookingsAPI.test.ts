import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createBooking,
  updateBooking,
  deleteBooking,
  findNextAvailableTime,
} from "../features/bookings/bookingsAPI";
import type { Booking } from "../types.d";

global.fetch = vi.fn();

const mockBooking: Booking = {
  userEmail: "user@example.com",
  date: "2025-03-12",
  court: "A",
  time: "10:00",
  players: 2,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Booking API", () => {
  it("should create a booking successfully", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockBooking, _id: "1" }),
    });

    const result = await createBooking(mockBooking);
    expect(result._id).toBe("1");
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/bookings"), expect.objectContaining({ method: "POST" }));
  });

  it("should update a booking successfully", async () => {
    const updatedBooking = { ...mockBooking, _id: "1", time: "11:00" };

    (fetch as any).mockResolvedValue({ ok: true });

    const result = await updateBooking(updatedBooking);
    expect(result).toEqual(updatedBooking);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/bookings/1"), expect.objectContaining({ method: "PUT" }));
  });

  it("should delete a booking successfully", async () => {
    (fetch as any).mockResolvedValue({ ok: true });

    await expect(deleteBooking("1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/bookings/1"), expect.objectContaining({ method: "DELETE" }));
  });

  it("should throw an error when updating without _id", async () => {
    const invalidBooking = { ...mockBooking, _id: undefined };

    await expect(updateBooking(invalidBooking)).rejects.toThrow("updateBooking requires a booking with _id");
  });
});

describe("findNextAvailableTime", () => {
  it("should return the next available time slot", () => {
    const existingBookings: Booking[] = [
      { ...mockBooking, time: "14:00" },
      { ...mockBooking, time: "14:30" },
    ];
    const result = findNextAvailableTime(existingBookings, "2025-03-12", "A", "14:00");
    expect(result).toBe("15:00");
  });

  it("should return null if all time slots are booked", () => {
    const fullyBooked = Array.from({ length: 16 }, (_, i) => ({
      ...mockBooking,
      time: `${14 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
    }));

    const result = findNextAvailableTime(fullyBooked, "2025-03-12", "A", "14:00");
    expect(result).toBeNull();
  });
});