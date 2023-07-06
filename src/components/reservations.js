import { useEffect, useState } from "react";
import { classes } from "../utils";
import {
  trackChanges,
  updateReservation,
  deleteReservation,
} from "../firebase";
import {
  HTMLDateTimeToFirebase,
  jsToLocalStringTime,
  jsDateToHTMLInput,
} from "../firebase/dateConvertor";

const FILTER = {
  all: 1,
  taken: 2,
  pending: 3,
};

const INPUTS = {
  dateTime: "dateTime",
  persons: "persons",
  name: "name",
  table: "table",
  specialRequest: "specialRequest",
  phoneNumber: "phoneNumber",
};

export default function Reservations({ date }) {
  const [filter, setFilter] = useState(FILTER.all);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState({});
  const [message, setMessage] = useState(null);
  const popMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const reservation = {
      dateTime: HTMLDateTimeToFirebase(form.get(INPUTS.dateTime)),
      persons: form.get(INPUTS.persons),
      table: form.get(INPUTS.table),
      name: form.get(INPUTS.name),
      specialRequest: form.get(INPUTS.specialRequest),
      phoneNumber: form.get(INPUTS.phoneNumber),
      taken: selectedReservation.taken,
    };

    updateReservation(selectedReservation.id, reservation).then(() => {
      popMessage("Reservation updated!");
    });
  };

  useEffect(() => {
    const unsubscribe = trackChanges(date, setReservations);
    return unsubscribe;
  }, [date]);

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    window.actionModal.showModal();
  };

  const openEditModal = () => {
    window.updateReservationModal.showModal();
  };

  const filterFuc = ({ taken }) => {
    if (filter === FILTER.all) return true;
    if (filter === FILTER.taken && taken) return true;
    if (filter === FILTER.pending && !taken) return true;
    return false;
  };

  const takenReservation = (taken) => {
    updateReservation(selectedReservation.id, {
      ...selectedReservation,
      taken: !taken,
    }).then((res) => {
      popMessage(taken ? "Reservation untaken!" : "Reservation taken!");
    });
  };

  const removeReservation = () => {
    deleteReservation(selectedReservation.id).then((res) => {
      popMessage("Reservation removed!");
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Filter the reservations */}
      <div className="tabs tabs-boxed">
        <button
          className={classes(
            "tab  grow",
            filter === FILTER.all && "tab-active"
          )}
          onClick={() => setFilter(FILTER.all)}
        >
          All
        </button>
        <button
          className={classes(
            "tab  grow",
            filter === FILTER.taken && "tab-active"
          )}
          onClick={() => setFilter(FILTER.taken)}
        >
          Taken
        </button>
        <button
          className={classes(
            "tab  grow",
            filter === FILTER.pending && "tab-active"
          )}
          onClick={() => setFilter(FILTER.pending)}
        >
          Pending
        </button>
      </div>

      {/* Reservations table */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="">
              <th className=" p-2 sm:p-4">
                Time
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 sm:w-7 h-5 sm:h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg> */}
              </th>
              <th className=" p-2 sm:p-4">
                People
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 sm:w-7 h-5 sm:h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg> */}
              </th>
              <th className=" p-2 sm:p-4">
                Name
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 sm:w-7 h-5 sm:h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg> */}
              </th>
              <th className=" p-2 sm:p-4">
                Table
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 sm:w-7 h-5 sm:h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg> */}
              </th>
              <th className=" p-2 sm:p-4">
                More
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 sm:w-7 h-5 sm:h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg> */}
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations
              .filter(filterFuc)
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
              .map((reservation) => (
                <tr
                  key={reservation.id}
                  className={classes(
                    "bg-opacity-50 cursor-pointer",
                    reservation.taken
                      ? "bg-red-700 hover:bg-red-800 "
                      : "bg-green-700 hover:bg-green-800 "
                  )}
                  onClick={() => openModal(reservation)}
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
      {/* added toast */}
      {message && (
        <div className="toast toast-center">
          <div className="alert alert-info px-2 py-1 sm:p-3 text-sm sm:text-md flex gap-1 justify-center items-center">
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
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>

            <span>{message}</span>
          </div>
        </div>
      )}
      {/* edit modal */}

      <dialog id="updateReservationModal" className="modal">
        <form method="dialog" className="modal-box" onSubmit={handleEditSubmit}>
          <h3 className="font-bold text-lg">Edit the reservation</h3>
          <div className="py-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date and time</span>
              </label>

              <input
                type="datetime-local"
                name={INPUTS.dateTime}
                required
                defaultValue={jsDateToHTMLInput(selectedReservation.dateTime)}
                className="input w-full input-sm input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Number of persons</span>
              </label>

              <input
                type="number"
                name={INPUTS.persons}
                defaultValue={selectedReservation.persons}
                required
                className="input w-full input-sm input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>

              <input
                type="text"
                name={INPUTS.name}
                required
                defaultValue={selectedReservation.name}
                className="input w-full input-sm input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Table</span>
              </label>

              <input
                type="text"
                name={INPUTS.table}
                defaultValue={selectedReservation.table}
                className="input w-full input-sm input-bordered input-secondary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Special Request</span>
              </label>

              <textarea
                type="text"
                name={INPUTS.specialRequest}
                defaultValue={selectedReservation.specialRequest}
                className="textarea textarea-xs sm:textarea-sm w-full input-secondary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>

              <input
                type="text"
                name={INPUTS.phoneNumber}
                defaultValue={selectedReservation.phoneNumber}
                className="input w-full input-sm input-bordered input-secondary"
              />
            </div>
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-xs sm:btn-sm btn-primary"
              type="submit"
              onClick={() => window.updateReservationModal.close()}
            >
              Save
            </button>

            <button
              className="btn btn-xs sm:btn-sm"
              type="reset"
              onClick={() => window.updateReservationModal.close()}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
      {/* Action modal */}

      <dialog id="actionModal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Actions</h3>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-xs sm:btn-sm btn-primary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                takenReservation(selectedReservation.taken);
              }}
            >
              {selectedReservation.taken ? "Untaken" : "Taken"}
            </button>
            <button
              className="btn btn-xs sm:btn-sm btn-secondary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                openEditModal();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-xs sm:btn-sm btn-error"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                removeReservation();
              }}
            >
              Remove
            </button>
            <button
              className="btn btn-xs sm:btn-sm "
              type="reset"
              onClick={() => window.actionModal.close()}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
