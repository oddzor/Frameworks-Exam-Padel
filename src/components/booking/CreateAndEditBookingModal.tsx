import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllBookings } from "../../features/bookings/bookingsAPI";
import { Booking, Court } from "../../types";

interface CreateAndEditBookingModalProps {
  isOpen: boolean;
  userEmail?: string;
  createDate?: string;
  existingBooking?: Booking;
  onClose: () => void;
  onSave: (updated: Booking) => Promise<void>;
  courts?: Court[];
}

export default function CreateAndEditBookingModal({
  isOpen,
  userEmail,
  createDate,
  existingBooking,
  onClose,
  onSave,
  courts = [
    { name: "Court #1" },
    { name: "Court #2" },
    { name: "Court #3" },
    { name: "Court #4" },
    { name: "Court #5" },
    { name: "Court #6" },
  ],
}: CreateAndEditBookingModalProps) {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const isEditMode = !!existingBooking;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [court, setCourt] = useState("Court #1");
  const [players, setPlayers] = useState(2);
  const [mainPlayerName, setMainPlayerName] = useState("");
  const [coPlayers, setCoPlayers] = useState<string[]>([""]);
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && existingBooking) {
      setDate(existingBooking.date);
      setTime(existingBooking.time);
      setCourt(existingBooking.court);
      setPlayers(existingBooking.players);
      setMainPlayerName(existingBooking.mainPlayerName || "");
      if (existingBooking.players === 4) {
        setCoPlayers(existingBooking.coPlayers || ["", "", ""]);
      } else {
        setCoPlayers(
          existingBooking.coPlayers?.length ? existingBooking.coPlayers : [""]
        );
      }
    } else {
      setDate(createDate || dayjs().format("YYYY-MM-DD"));
      setTime("10:00");
      setCourt("Court #1");
      setPlayers(2);
      setMainPlayerName("");
      setCoPlayers([""]);
    }
  }, [isOpen, isEditMode, existingBooking, createDate]);

  useEffect(() => {
    if (!isOpen) return;
    getAllBookings()
      .then((res) => setAllBookings(res))
      .catch((err) => console.error("Failed to load bookings:", err));
  }, [isOpen]);
  useEffect(() => {
    if (players === 4 && coPlayers.length < 3) {
      setCoPlayers((prev) => {
        const expanded = [...prev, "", ""].slice(0, 3);
        return expanded;
      });
    } else if (players === 2 && coPlayers.length > 1) {
      setCoPlayers((prev) => {
        const truncated = [...prev].slice(0, 1);
        return truncated;
      });
    }
  }, [players, coPlayers]);

  if (!isOpen) return null;

  function buildTimeSlots() {
    const slots: string[] = [];
    let hour = 10;
    let minute = 0;
    while (hour < 22 || (hour === 21 && minute <= 30)) {
      const hh = hour.toString().padStart(2, "0");
      const mm = minute.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return slots;
  }

  const times = buildTimeSlots();
  const isToday = dayjs(date, "YYYY-MM-DD").isSame(dayjs(), "day");
  const nowPlusOneHour = dayjs().add(1, "hour");
  const filteredTimes = times.filter((t) => {
    return !allBookings.some((b) => {
      if (isEditMode && existingBooking && b._id === existingBooking._id) {
        return false;
      }
      return b.date === date && b.court === court && b.time === t;
    });
  });
  const finalTimes = filteredTimes.filter((slot) => {
    if (!isToday) return true;
    const checkTime = dayjs(`${date} ${slot}`, "YYYY-MM-DD HH:mm");
    return checkTime.isAfter(nowPlusOneHour);
  });

  function handleCoPlayerChange(idx: number, val: string) {
    setCoPlayers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const conflict = allBookings.some((b) => {
      if (isEditMode && existingBooking && b._id === existingBooking._id) {
        return false;
      }
      return b.date === date && b.court === court && b.time === time;
    });
    if (conflict) {
      alert("That slot is taken. Please choose another time.");
      return;
    }

    const finalBooking: Booking = isEditMode
      ? { ...(existingBooking as Booking) }
      : {
          userEmail: userEmail || "",
          date: "",
          time: "",
          court: "",
          players: 2,
        };

    finalBooking.date = date;
    finalBooking.time = time;
    finalBooking.court = court;
    finalBooking.players = players;
    finalBooking.mainPlayerName = mainPlayerName;
    finalBooking.coPlayers =
      players === 4 ? coPlayers.slice(0, 3) : coPlayers.slice(0, 1);

    onSave(finalBooking).catch((err) =>
      console.error("Save booking error:", err)
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit Booking" : "Create Booking"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditMode && (
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Court</label>
            <select
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
            >
              {courts.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
            >
              {finalTimes.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
              {!finalTimes.includes(time) && (
                <option value={time}>{time}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Players</label>
            <select
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Main Player Name</label>
            <input
              type="text"
              value={mainPlayerName}
              onChange={(e) => setMainPlayerName(e.target.value)}
              className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              {players === 4 ? "Co-Players" : "Co-Player"}
            </label>
            {coPlayers.map((cp, index) => (
              <input
                key={index}
                type="text"
                value={cp}
                onChange={(e) => handleCoPlayerChange(index, e.target.value)}
                placeholder={`Co-Player #${index + 1}`}
                className="border border-gray-500 px-2 py-1 rounded w-full bg-gray-700 mb-1"
              />
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
