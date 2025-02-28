import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import type { Booking } from "../types";
import type { Dayjs } from "dayjs";
import CalendarSection from "../components/calendar/CalendarSection";
import BookingsList from "../components/booking/BookingsList";
import CreateAndEditBookingModal from "../components/booking/CreateAndEditBookingModal";
import {
  fetchAllBookingsForUser,
  deleteBooking,
  createBooking,
  updateBooking,
} from "../features/bookings/bookingsAPI";

export default function BookingsPage() {
  const { email, isLoggedIn } = useAppSelector(selectAuth);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!email || !isLoggedIn) return;
    const { userBookings } = await fetchAllBookingsForUser(email, isLoggedIn);
    setUserBookings(userBookings);
  }, [email, isLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleDateChange(value: Dayjs | null) {
    if (value) {
      setSelectedDate(value);
      setIsModalOpen(true);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    await deleteBooking(bookingId);
    await fetchData();
  }

  async function handleCreateBooking(newBooking: Booking) {
    await createBooking(newBooking);
    await fetchData();
    setIsModalOpen(false);
  }

  async function handleUpdateBooking(updated: Booking) {
    if (!updated._id) return;
    await updateBooking(updated);
    await fetchData();
  }

  if (!isLoggedIn) {
    return (
      <section className="bg-gray-900 text-white pt-20 pb-0 min-h-screen">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-4">Create a booking</h2>
          <p>Please log in to see your bookings.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 text-white pt-20 pb-16 min-h-screen">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-6">Your Bookings</h2>
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="md:w-2/5 w-full mb-6 md:mb-0">
            <CalendarSection
              selectedDate={selectedDate}
              onChange={handleDateChange}
              bookings={userBookings}
            />
          </div>
          <div className="md:w-3/5 w-full">
            <BookingsList
              bookings={userBookings}
              onCancelBooking={handleCancelBooking}
              onUpdateBooking={handleUpdateBooking}
            />
          </div>
        </div>
      </div>

      <CreateAndEditBookingModal
        isOpen={isModalOpen}
        userEmail={email || ""}
        createDate={selectedDate?.format("YYYY-MM-DD")}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateBooking}
      />
    </section>
  );
}
