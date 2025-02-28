import React, { useState } from "react";
import { User } from "../../types";

interface CancelMembershipModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (userId: string, reason: string) => void;
}

export default function CancelMembershipModal({
  user,
  onClose,
  onConfirm,
}: CancelMembershipModalProps) {
  const [reason, setReason] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user._id) return;
    onConfirm(user._id, reason);
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Cancel Membership</h2>
        <p className="mb-4">{user.email}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm mb-1">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
          >
            <option value="">Select reason</option>
            <option value="Late payments">No payment</option>
            <option value="Violation of rules">Violation of rules</option>
            <option value="Other issues">Other issues</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
