import { useNavigate } from "react-router-dom";

interface BannedModalProps {
  reason: string;
  onClose: () => void;
}

export default function BannedModal({ reason, onClose }: BannedModalProps) {
  const navigate = useNavigate();

  function handleContact() {
    onClose();
    navigate("/contact");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Membership Cancelled</h2>
        <p className="mb-4">Reason: {reason}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleContact}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Contact Support
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}