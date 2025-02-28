import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  adminFetchAllBookings,
  adminUpdateBooking,
  adminDeleteBooking,
} from "../features/admin/adminAPI";
import type { Booking } from "../types";

global.fetch = vi.fn();

const mockBooking: Booking = {
  _id: "1",
  userEmail: "user@example.com",
  date: "2025-04-10",
  court: "B",
  time: "12:00",
  players: 4,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("adminsAPI", () => {
  it("should fetch all bookings successfully", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockBooking]),
    });

    const result = await adminFetchAllBookings();
    expect(result).toEqual([mockBooking]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/bookings"));
  });

  it("should update a booking successfully", async () => {
    (fetch as any).mockResolvedValue({ ok: true });

    const result = await adminUpdateBooking(mockBooking);
    expect(result).toEqual(mockBooking);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bookings/1"),
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("should delete a booking successfully", async () => {
    (fetch as any).mockResolvedValue({ ok: true });

    await expect(adminDeleteBooking("1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/bookings/1"), expect.objectContaining({ method: "DELETE" }));
  });
});