import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import type { Dayjs } from "dayjs";
import type { Booking } from "../../types";
import { makeDayComponent } from "./CalendarPickedDate";

interface CalendarSectionProps {
  selectedDate: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  bookings?: Booking[];
}

export default function CalendarSection({
  selectedDate,
  onChange,
  bookings = [],
}: CalendarSectionProps) {

  const MyGreenDay = makeDayComponent(bookings);

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          views={["day"]}
          disablePast
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue) {
              onChange(newValue);
            }
          }}
          slots={{
            day: MyGreenDay as React.ComponentType<any>,
          }}
          sx={{
            color: "#fff",
            backgroundColor: "transparent",
            "& .MuiPickersCalendarHeader-root": {
              color: "#fff",
            },
            "& .MuiPickersArrowSwitcher-button": {
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
            "& .MuiDayCalendar-weekDayLabel": {
              color: "#fff",
              margin: 1,
            },
            "& .MuiPickersDay-root": {
              color: "#fff",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#333",
              },
            },
            "& .MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#555",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#666",
              },
            },
            "& .MuiPickersDay-root.MuiPickersDay-today": {
              border: "1px solid #fff",
            },
            overflowX: "hidden",
          }}
        />
      </LocalizationProvider>
    </div>
  );
}