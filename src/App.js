import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";
import { useState } from "react";
import Settings from "./components/settings";
import DateChanger from "./components/dateChanger";
import { DATE_FORMAT } from "./utils";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

function App() {
  const theme = useSelector((state) => state.settings.theme);
  const [date, setDate] = useState(dayjs().format(DATE_FORMAT));

  return (
    <div
      className="flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 min-h-screen"
      data-theme={theme}
    >
      <Settings />
      <DateChanger date={date} setDate={setDate} />
      <Reservations date={date} />
      <MakeReservation date={date} />
    </div>
  );
}

export default App;
