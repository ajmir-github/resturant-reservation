import { useEffect, useState } from "react";
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

export default function Reservations() {
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
    const unsubscribe = trackChanges(setReservations);
    return unsubscribe;
  }, []);

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

  const sortFunc = (a, b) => {
    const aDate = new Date(a.dateTime);
    const bDate = new Date(b.dateTime);
    return bDate - aDate;
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
        <div className="toast toast-start">
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        </div>
      )}
      {/* edit modal */}

      <dialog id="updateReservationModal" className="modal">
        <form method="dialog" className="modal-box" onSubmit={handleEditSubmit}>
          <h3 className="font-bold text-lg">Make Reservations</h3>
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

              <input
                type="text"
                name={INPUTS.specialRequest}
                defaultValue={selectedReservation.specialRequest}
                className="input w-full input-sm input-bordered input-secondary"
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
              className="btn btn-sm btn-primary"
              type="submit"
              onClick={() => window.updateReservationModal.close()}
            >
              Save
            </button>

            <button
              className="btn btn-sm"
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
              className="btn btn-sm btn-primary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                takenReservation(selectedReservation.taken);
              }}
            >
              {selectedReservation.taken ? "Untaken" : "Taken"}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                openEditModal();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-error"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                removeReservation();
              }}
            >
              Remove
            </button>
            <button
              className="btn btn-sm"
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
