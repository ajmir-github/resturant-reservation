import dayjs from "dayjs";
import { DATE_FORMAT } from "../utils";

export default function DateChanger({ date, setDate }) {
  const hanldeDateInput = (e) => setDate(e.target.value);
  const nextDate = () => setDate(dayjs(date).add(1, "day").format(DATE_FORMAT));
  const previousDate = () =>
    setDate(dayjs(date).subtract(1, "day").format(DATE_FORMAT));

  return (
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
  );
}
