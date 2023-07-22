import { useEffect, useState } from "react";
import {
  DATE_FORMAT,
  FILTER,
  INPUTS,
  InputDateTimeToFirebaseTimestamp,
  RESERVATION_STATUS,
  classes,
  jsDateToInputDateTime,
  jsDateToTime,
} from "../utils";
import {
  trackChanges,
  updateReservation,
  deleteReservation,
} from "../firebase";
import dayjs from "dayjs";
// import dayjs from "dayjs";

export default function Reservations({ date }) {
  const [filter, setFilter] = useState(FILTER.pending);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState({});
  const [message, setMessage] = useState(null);
  const [isClose, setIsClose] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // count the catagories
    const numberOfReservations = reservations.length;
    if (numberOfReservations > 0) {
      const countStatus = (status) =>
        reservations.filter((doc) => doc.status === status).length;
      setStats({
        all: numberOfReservations,
        taken: countStatus(RESERVATION_STATUS.taken),
        pending: countStatus(RESERVATION_STATUS.pending),
        expired: countStatus(RESERVATION_STATUS.expired),
      });
    } else setStats(null);

    // deadline indicator
    const deadlineInterval = setInterval(() => {
      const NOW = new Date();
      const EXPIRE_MIN = 5;
      const NOTIFY_MIN = -15;
      reservations.forEach((reservation, index) => {
        if (
          dayjs().format(DATE_FORMAT) !== date ||
          reservation.status === RESERVATION_STATUS.expired ||
          reservation.status === RESERVATION_STATUS.taken
        )
          return console.log("NOT PASSED");
        const diff = parseInt((NOW - reservation.dateTime) / 1000 / 60);

        if (diff >= EXPIRE_MIN) {
          reservation.isClose = false;
          return updateReservation(reservation.id, {
            ...reservation,
            status: RESERVATION_STATUS.expired,
          }).then((res) => {
            popMessage("Reservation expired!");
          });
        }

        if (diff >= NOTIFY_MIN) {
          if (!isClose.includes(index)) setIsClose([...isClose, index]);
        }
      });
    }, 5000);

    // if no reservations
    const cancelDeadlineInterval = () => clearInterval(deadlineInterval);
    return cancelDeadlineInterval;
  }, [reservations, date, isClose]);

  const isCloseMat = (doc, index) => {
    if (isClose.includes(index)) {
      doc.isClose = true;
    }
    return doc;
  };

  const filterFunc = (doc) => {
    switch (filter) {
      case FILTER.expired:
        return doc.status === RESERVATION_STATUS.expired;
      case FILTER.taken:
        return doc.status === RESERVATION_STATUS.taken;
      case FILTER.pending:
        return doc.status === RESERVATION_STATUS.pending;

      default:
        return true;
    }
  };

  const popMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const reservation = {
      dateTime: InputDateTimeToFirebaseTimestamp(form.get(INPUTS.dateTime)),
      persons: form.get(INPUTS.persons),
      name: form.get(INPUTS.name),
      more: form.get(INPUTS.more),
      status: RESERVATION_STATUS.pending,
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

  const takenReservation = (status) => {
    updateReservation(selectedReservation.id, {
      ...selectedReservation,
      status,
    }).then((res) => {
      popMessage(`Reservation ${status}!`);
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
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.all && "tab-active"
          )}
          onClick={() => setFilter(FILTER.all)}
        >
          All {stats && ` (${stats.all})`}
        </button>

        <button
          className={classes(
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.pending && "tab-active"
          )}
          onClick={() => setFilter(FILTER.pending)}
        >
          Pending {stats && ` (${stats.pending})`}
        </button>

        <button
          className={classes(
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.taken && "tab-active"
          )}
          onClick={() => setFilter(FILTER.taken)}
        >
          Taken {stats && ` (${stats.taken})`}
        </button>

        <button
          className={classes(
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.expired && "tab-active"
          )}
          onClick={() => setFilter(FILTER.expired)}
        >
          Expired {stats && ` (${stats.expired})`}
        </button>
      </div>

      {/* Reservations table */}
      <div className="overflow-x-auto">
        <table className="table table-sm">
          {/* head */}
          <thead>
            <tr className="">
              <th className=" p-2 sm:p-4">Time</th>
              <th className=" p-2 sm:p-4">People</th>
              <th className=" p-2 sm:p-4">Name</th>
              <th className=" p-2 sm:p-4">Table</th>
              <th className=" p-2 sm:p-4">More</th>
            </tr>
          </thead>
          <tbody>
            {reservations
              .map(isCloseMat)
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
              .filter(filterFunc)
              .map((reservation) => (
                <tr
                  key={reservation.id}
                  className={classes(
                    "bg-opacity-50 cursor-pointer",
                    reservation.status === RESERVATION_STATUS.taken
                      ? "bg-green-700 hover:bg-green-800 "
                      : reservation.status === RESERVATION_STATUS.pending
                      ? reservation.isClose
                        ? "bg-yellow-700 hover:bg-yellow-800"
                        : "bg-gray-700 hover:bg-gray-800"
                      : "bg-red-700 hover:bg-red-800"
                  )}
                  onClick={() => openModal(reservation)}
                >
                  <th>{jsDateToTime(reservation.dateTime)}</th>
                  <th>{reservation.persons}</th>
                  <td>{reservation.name}</td>
                  <td>{reservation.table}</td>
                  <td>{reservation.more}</td>
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
                defaultValue={jsDateToInputDateTime(
                  selectedReservation.dateTime
                )}
                className="input w-full input-sm md:input-md input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Persons</span>
              </label>

              <input
                type="number"
                name={INPUTS.persons}
                defaultValue={selectedReservation.persons}
                required
                className="input w-full input-sm md:input-md input-bordered input-primary"
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
                className="input w-full input-sm md:input-md input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Table</span>
              </label>

              <input
                type="text"
                name={INPUTS.table}
                required
                defaultValue={selectedReservation.table}
                className="input w-full input-sm md:input-md input-bordered input-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">More</span>
              </label>

              <textarea
                type="text"
                name={INPUTS.more}
                defaultValue={selectedReservation.more}
                className="textarea textarea-xs sm:textarea-sm w-full input-secondary"
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

          <div className="modal-action flex justify-center flex-wrap gap-2">
            {/* if there is a button in form, it will close the modal */}
            {selectedReservation.status !== RESERVATION_STATUS.taken ? (
              <button
                className="btn btn-sm sm:btn-md btn-primary"
                type="reset"
                onClick={() => {
                  window.actionModal.close();
                  takenReservation(RESERVATION_STATUS.taken);
                }}
              >
                Taken
              </button>
            ) : (
              <button
                className="btn btn-sm sm:btn-md btn-primary"
                type="reset"
                onClick={() => {
                  window.actionModal.close();
                  takenReservation(RESERVATION_STATUS.pending);
                }}
              >
                Pending
              </button>
            )}
            <button
              className="btn btn-sm sm:btn-md btn-secondary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                openEditModal();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-sm sm:btn-md btn-error"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                removeReservation();
              }}
            >
              Remove
            </button>
            <button
              className="btn btn-sm sm:btn-md "
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
