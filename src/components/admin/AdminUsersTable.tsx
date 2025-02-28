import { User } from "../../types";

interface AdminUsersTableProps {
  users: User[];
  onCancelMember: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onRestartMember: (userId: string) => void;
}

export default function AdminUsersTable({
  users,
  onCancelMember,
  onDeleteUser,
  onRestartMember,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-gray-900 text-white shadow">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-2 border text-white border-gray-600">Email</th>
            <th className="p-2 border border-gray-600">Role</th>
            <th className="p-2 border border-gray-600">Banned</th>
            <th className="p-2 border border-gray-600">Ban Reason</th>
            <th className="p-2 border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-gray-600 bg-gray-800">
              <td className="p-2 border border-gray-600">{u.email}</td>
              <td className="p-2 border border-gray-600">{u.role}</td>
              <td className="p-2 border border-gray-600">
                {u.banned ? "Yes" : "No"}
              </td>
              <td className="p-2 border border-gray-600">{u.banReason}</td>
              <td className="p-2 border border-gray-600 space-x-2">
                {!u.banned && (
                  <button
                    onClick={() => onCancelMember(u)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Cancel Membership
                  </button>
                )}
                {u.banned && (
                  <button
                    onClick={() => u._id && onRestartMember(u._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Restart Membership
                  </button>
                )}
                <button
                  onClick={() => u._id && onDeleteUser(u._id)}
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
}
