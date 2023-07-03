import { useEffect, useState } from "react";
import { trackChanges } from "../firebase";
import { jsToLocalStringTime } from "../firebase/dateConvertor";

const FILTER = {
  all: 1,
  taken: 2,
  pending: 3,
};

export default function Reservations() {
  const [filter, setFilter] = useState(FILTER.all);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // const unsubscribe = trackChanges(setReservations);
    trackChanges(setReservations);

    // return () => unsubscribe();
  }, []);

  const changeStatus = (id, taken) => {
    console.log({ id, taken });
  };

  const filterFuc = ({ taken }) => {
    if (filter === FILTER.all) return true;
    if (filter === FILTER.taken && taken) return true;
    if (filter === FILTER.pending && !taken) return true;
    return false;
  };

  const sortFunc = (a, b) => {
    const aDate = new Date(a.dateTime);
    const bDate = new Date(b.dateTime);
    return bDate - aDate;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Filter the reservations */}
      <div className="tabs tabs-boxed">
        <button
          className={filter === FILTER.all ? "tab grow tab-active" : "tab grow"}
          onClick={() => setFilter(FILTER.all)}
        >
          All
        </button>
        <button
          className={
            filter === FILTER.taken ? "tab grow tab-active" : "tab grow"
          }
          onClick={() => setFilter(FILTER.taken)}
        >
          Taken
        </button>
        <button
          className={
            filter === FILTER.pending ? "tab grow tab-active" : "tab grow"
          }
          onClick={() => setFilter(FILTER.pending)}
        >
          Pending
        </button>
      </div>

      {/* Reservations table */}
      <div className="overflow-x-auto">
        <table className="table table-sm">
          {/* head */}
          <thead>
            <tr className="">
              <th>Time</th>
              <th>P</th>
              <th>Name</th>
              <th>T</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {reservations
              .filter(filterFuc)
              .sort(sortFunc)
              .map((reservation) => (
                <tr
                  key={reservation.id}
                  className={
                    (reservation.taken
                      ? "bg-red-700 hover:bg-red-800 "
                      : "bg-green-700 hover:bg-green-800 ") +
                    "bg-opacity-50 cursor-pointer"
                  }
                  onClick={() =>
                    changeStatus(reservation.id, reservation.taken)
                  }
                >
                  <th>{jsToLocalStringTime(reservation.dateTime)}</th>
                  <th>{reservation.persons}</th>
                  <td>{reservation.name}</td>
                  <td>{reservation.table}</td>
                  <td>
                    {reservation.specialRequest}
                    <br />
                    {reservation.phoneNumber}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
