import { useState } from "react";
import dayjs from "dayjs";
import type { Booking } from "../../types";
import CreateAndEditBookingModal from "./CreateAndEditBookingModal";

interface BookingsListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => void;
  onUpdateBooking?: (updated: Booking) => Promise<void>;
}

export default function BookingsList({
  bookings,
  onCancelBooking,
  onUpdateBooking,
}: BookingsListProps) {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  function handleCancel(bid?: string) {
    if (!bid || !onCancelBooking) return;
    const ok = window.confirm("Are you sure you want to cancel?");
    if (ok) onCancelBooking(bid);
  }

  function handleEdit(bk: Booking) {
    setEditingBooking(bk);
    setIsEditOpen(true);
  }

  async function handleSave(updated: Booking) {
    if (onUpdateBooking) {
      await onUpdateBooking(updated);
    }
    setIsEditOpen(false);
    setEditingBooking(null);
  }

  const sorted = [...bookings].sort((a, b) => {
    const aTime = dayjs(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm").valueOf();
    const bTime = dayjs(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm").valueOf();
    return aTime - bTime;
  });

  return (
    <div className="bg-gray-800 p-4 rounded shadow text-white">
      <h3 className="text-lg font-semibold mb-2">Your bookings</h3>

      {sorted.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 border border-gray-600 text-left">DATE</th>
              <th className="px-4 py-2 border border-gray-600 text-left">TIME</th>
              <th className="px-4 py-2 border border-gray-600 text-left">COURT</th>
              <th className="px-4 py-2 border border-gray-600 text-left">PLAYERS</th>
              <th className="px-4 py-2 border border-gray-600 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((bk) => {
              const dateLabel = dayjs(bk.date, "YYYY-MM-DD").format("DD MMM YYYY");
              return (
                <tr key={bk._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{dateLabel}</td>
                  <td className="px-4 py-2">{bk.time}</td>
                  <td className="px-4 py-2">{bk.court}</td>
                  <td className="px-4 py-2">{bk.players}</td>
                  <td className="px-4 py-2 space-x-2">
                    {onUpdateBooking && (
                      <button
                        onClick={() => handleEdit(bk)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                    {onCancelBooking && (
                      <button
                        onClick={() => handleCancel(bk._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {editingBooking && (
        <CreateAndEditBookingModal
          isOpen={isEditOpen}
          existingBooking={editingBooking}
          userEmail={editingBooking.userEmail}
          onClose={() => {
            setIsEditOpen(false);
            setEditingBooking(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}