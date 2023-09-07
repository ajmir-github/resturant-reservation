import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";
import { useThemes } from "./hooks/useThemes";
import { useState } from "react";
import ThemeButton from "./components/themeButton";
import DateChanger from "./components/dateChanger";
import { DATE_FORMAT } from "./utils";
import dayjs from "dayjs";

function App() {
  const [theme, toggleTheme] = useThemes();
  const [date, setDate] = useState(dayjs().format(DATE_FORMAT));

  return (
    <div
      className="flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 min-h-screen"
      data-theme={theme}
    >
      <ThemeButton toggleTheme={toggleTheme} />
      <DateChanger date={date} setDate={setDate} />
      <Reservations date={date} />
      <MakeReservation date={date} />
    </div>
  );
}

export default App;
