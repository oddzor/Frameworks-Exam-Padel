import React from "react";
import { AdminBookingsProps } from "../../types";

const AdminBookingsTable: React.FC<AdminBookingsProps> = ({
  bookings,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto text-white">
      <table className="w-full border-collapse shadow">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border border-gray-600">Date</th>
            <th className="p-2 border border-gray-600">Time</th>
            <th className="p-2 border border-gray-600">Court</th>
            <th className="p-2 border border-gray-600">Players</th>
            <th className="p-2 border border-gray-600">User Email</th>
            <th className="p-2 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="bg-gray-800 hover:bg-gray-700">
              <td className="p-2 border border-gray-600">{b.date}</td>
              <td className="p-2 border border-gray-600">{b.time}</td>
              <td className="p-2 border border-gray-600">{b.court}</td>
              <td className="p-2 border border-gray-600">{b.players || "-"}</td>
              <td className="p-2 border border-gray-600">{b.userEmail}</td>
              <td className="p-2 border border-gray-600 space-x-2">
                <button
                  onClick={() => onEdit(b)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => b._id && onDelete(b._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingsTable;
