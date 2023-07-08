import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";
import { useThemes } from "./hooks/useThemes";
import { useState } from "react";
import { JSONtoInputDate, inputDateToJSON } from "./firebase";

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [theme, changeTheme] = useThemes();
  const [date, setDate] = useState(getCurrentDate());
  const hanldeDateInput = (e) => setDate(e.target.value);
  const nextDate = () => {
    const jsonDate = inputDateToJSON(date);
    jsonDate.day += 1;
    const plainDate = JSONtoInputDate(jsonDate);
    setDate(plainDate);
  };
  const previousDate = () => {
    const jsonDate = inputDateToJSON(date);
    jsonDate.day -= 1;
    const plainDate = JSONtoInputDate(jsonDate);
    setDate(plainDate);
  };

  return (
    <div
      className="flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 "
      data-theme={theme}
    >
      <button
        className="btn btn-circle btn-secondary absolute bottom-0 left-0 m-2 sm:m-4"
        onClick={changeTheme}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
          />
        </svg>
      </button>
      <div className="join">
        <button className="btn btn-neutral  join-item" onClick={previousDate}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <input
          type="date"
          className="input w-full  join-item text-center font-bold"
          onChange={hanldeDateInput}
          value={date}
        />
        <button className="btn btn-neutral join-item" onClick={nextDate}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <Reservations date={date} />
      <MakeReservation />
    </div>
  );
}

export default App;
