import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../features/auth/authSlice";
import { Booking, User, SupportTicket, AdminFilterState } from "../types";
import AdminFilters from "../components/admin/AdminFilters";
import AdminTicketsTable from "../components/admin/AdminTicketsTable";
import AdminUsersTable from "../components/admin/AdminUsersTable";
import AdminBookingsTable from "../components/admin/AdminBookingsTable";
import CancelMembershipModal from "../components/authentication/CancelMembershipModal";
import CreateAndEditBookingModal from "../components/booking/CreateAndEditBookingModal";
import {
  adminFetchAllBookings,
  adminDeleteBooking,
  adminUpdateBooking,
  adminFetchAllUsers,
  adminDeleteUser,
  adminRestartMember,
  adminConfirmCancelMember,
  adminFetchTickets,
  adminCloseTicket,
} from "../features/admin/adminAPI";

export default function AdminPage() {
  const { isLoggedIn, email } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [filters, setFilters] = useState<AdminFilterState>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [cancelUser, setCancelUser] = useState<User | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [currentTab, setCurrentTab] = useState<
    "bookings" | "users" | "tickets"
  >("bookings");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || email !== "admin") return;
    fetchAllBookings();
    fetchAllUsers();
    fetchAllTickets();
  }, [isLoggedIn, email]);

  async function fetchAllBookings() {
    try {
      const data = await adminFetchAllBookings();
      setAllBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  }

  async function fetchAllUsers() {
    try {
      const data = await adminFetchAllUsers();
      setAllUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  async function fetchAllTickets() {
    try {
      const data = await adminFetchTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  }

  function applyFilters() {
    let result = [...allBookings];
    if (filters.date) {
      result = result.filter((b) => b.date === filters.date);
    }
    if (filters.court) {
      result = result.filter(
        (b) => b.court.toLowerCase() === (filters.court || "").toLowerCase()
      );
    }
    if (filters.players) {
      const num = Number(filters.players);
      result = result.filter((b) => b.players === num);
    }
    setFilteredBookings(result);
  }

  function handleFilterChange(name: keyof AdminFilterState, value: string) {
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
  }

  function handleSearchFilters() {
    applyFilters();
  }

  function handleTabChange(tab: "bookings" | "users" | "tickets") {
    setCurrentTab(tab);
  }

  function handleUserSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserSearch(e.target.value);
  }

  function handleUserSearch() {
    if (!userSearch.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    const result = allUsers.filter((u) =>
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
    setFilteredUsers(result);
  }

  async function handleDeleteBooking(id: string) {
    const confirmRes = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmRes) return;
    try {
      await adminDeleteBooking(id);
      const updated = allBookings.filter((b) => b._id !== id);
      setAllBookings(updated);
      setFilteredBookings(updated);
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  }

  function handleEdit(booking: Booking) {
    setEditBooking(booking);
    setIsEditModalOpen(true);
  }

  async function handleUpdateBooking(updated: Booking) {
    if (!updated._id) return;
    try {
      const newBooking = await adminUpdateBooking(updated);
      const replaced = allBookings.map((b) =>
        b._id === updated._id ? newBooking : b
      );
      setAllBookings(replaced);
      setFilteredBookings(replaced);
      setEditBooking(null);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  }

  function handleCancelMember(user: User) {
    setCancelUser(user);
    setIsCancelModalOpen(true);
  }

  async function confirmCancelMemberWrapper(userId: string, reason: string) {
    const confirmRes = window.confirm(
      "Are you sure you want to cancel this membership?"
    );
    if (!confirmRes) return;
    try {
      await adminConfirmCancelMember(userId, reason);
      fetchAllUsers();
    } catch (err) {
      console.error("Error canceling membership:", err);
    }
  }

  async function handleDeleteUser(userId: string) {
    const confirmRes = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmRes) return;
    try {
      await adminDeleteUser(userId);
      const updated = allUsers.filter((u) => u._id !== userId);
      setAllUsers(updated);
      setFilteredUsers(updated);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  async function handleRestartMember(userId: string) {
    const confirmRes = window.confirm(
      "Are you sure you want to restart this membership?"
    );
    if (!confirmRes) return;
    try {
      await adminRestartMember(userId);
      fetchAllUsers();
    } catch (err) {
      console.error("Error restarting membership:", err);
    }
  }

  async function handleCloseTicket(ticketId: string) {
    const confirmRes = window.confirm(
      "Are you sure you want to close this ticket?"
    );
    if (!confirmRes) return;
    try {
      await adminCloseTicket(ticketId);
      fetchAllTickets();
    } catch (err) {
      console.error("Error closing ticket:", err);
    }
  }

  function handleCreateNewBookingClick() {
    setIsCreateModalOpen(true);
  }

  async function handleCreateBooking(newBooking: Booking) {
    const updatedList = [
      ...allBookings,
      { ...newBooking, _id: crypto.randomUUID() },
    ];
    setAllBookings(updatedList);
    setFilteredBookings(updatedList);
    setIsCreateModalOpen(false);
  }

  useEffect(() => {
    if (!isLoggedIn || email !== "admin") {
      setShowAlert(true);
    }
  }, [isLoggedIn, email]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/", { replace: true });
  };

  if (!isLoggedIn || email !== "admin") {
    return (
      <>
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-sm">
              <p className="mb-4">Access Denied: Not Admin</p>
              <div className="flex justify-end">
                <button
                  onClick={handleCloseAlert}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Return To Homepage
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <section className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleTabChange("bookings")}
          className={`px-4 py-2 rounded ${
            currentTab === "bookings" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Manage Bookings
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`px-4 py-2 rounded ${
            currentTab === "users" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => handleTabChange("tickets")}
          className={`px-4 py-2 rounded ${
            currentTab === "tickets" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Support Tickets
        </button>
      </div>

      {currentTab === "bookings" && (
        <div className="bg-gray-800 p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <AdminFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearchFilters}
            />
            <button
              onClick={handleCreateNewBookingClick}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 text-white"
            >
              Create Booking
            </button>
          </div>
          <AdminBookingsTable
            bookings={filteredBookings}
            onEdit={handleEdit}
            onDelete={handleDeleteBooking}
          />
        </div>
      )}

      {currentTab === "users" && (
        <div className="bg-gray-800 p-4 rounded shadow">
          <div className="mb-4 flex">
            <input
              type="text"
              placeholder="Search users by email"
              value={userSearch}
              onChange={handleUserSearchChange}
              className="border px-2 py-1 mr-2 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleUserSearch}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Search
            </button>
          </div>
          <AdminUsersTable
            users={filteredUsers}
            onCancelMember={handleCancelMember}
            onDeleteUser={handleDeleteUser}
            onRestartMember={handleRestartMember}
          />
        </div>
      )}

      {currentTab === "tickets" && (
        <div className="bg-gray-800 p-4 rounded shadow">
          <AdminTicketsTable
            tickets={tickets}
            onCloseTicket={handleCloseTicket}
          />
        </div>
      )}

      {editBooking && isEditModalOpen && (
        <CreateAndEditBookingModal
          isOpen
          existingBooking={editBooking}
          userEmail={editBooking.userEmail}
          onClose={() => {
            setEditBooking(null);
            setIsEditModalOpen(false);
          }}
          onSave={handleUpdateBooking}
        />
      )}

      {cancelUser && isCancelModalOpen && (
        <CancelMembershipModal
          user={cancelUser}
          onClose={() => {
            setCancelUser(null);
            setIsCancelModalOpen(false);
          }}
          onConfirm={confirmCancelMemberWrapper}
        />
      )}

      {isCreateModalOpen && (
        <CreateAndEditBookingModal
          isOpen
          userEmail="admin@domain.com"
          createDate={dayjs().add(1, "day").format("YYYY-MM-DD")}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateBooking}
        />
      )}
    </section>
  );
}
