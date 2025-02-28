import { styled } from "@mui/material/styles";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Dayjs } from "dayjs";
import { Booking } from "../../types";

export function makeDayComponent(bookings: Booking[]) {
  const MyDay = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, ...rest } = props;
    if (!day || outsideCurrentMonth) {
      return <PickersDay {...props} />;
    }

    const dateStr = day.format("YYYY-MM-DD");
    const isBooked = bookings.some((b) => b.date === dateStr);

    const Styled = styled(PickersDay)({
      ...(isBooked && {
        backgroundColor: "green",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#006400",
        },
      }),
    });

    return (
      <Styled {...rest} day={day} outsideCurrentMonth={outsideCurrentMonth} />
    );
  };
  return MyDay;
}
