import { useEffect, useState } from "react";
import {
  FILTER,
  INPUTS,
  InputDateTimeToFirebaseTimestamp,
  classes,
  jsDateToInputDateTime,
  jsDateToTime,
} from "../utils";
import {
  trackChanges,
  updateReservation,
  deleteReservation,
} from "../firebase";
// import dayjs from "dayjs";

export default function Reservations({ date }) {
  const [filter, setFilter] = useState(FILTER.pending);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState({});
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({ all: 0, taken: 0, pending: 0 });

  useEffect(() => {
    // count the catagories
    const allCount = reservations.length;
    const takenCount = reservations.filter((doc) => doc.taken).length;
    const pendingCount = allCount - takenCount;
    setStats({
      all: allCount,
      taken: takenCount,
      pending: pendingCount,
    });

    // deadline indicator
    // const deadlineInterval = setInterval(() => {
    //   const NOW = new Date();
    //   const EXPIRE_MIN = 15;
    //   const NTOFIFY_MIN = -5;
    //   reservations.forEach((reservation, index) => {
    //     if (reservation.taken) return;
    //     const dateTime = reservations[index].dateTime;
    //     const diff = parseInt((NOW - dateTime) / 1000 / 60);

    //     if (diff > EXPIRE_MIN) {
    //       return updateReservation(reservation.id, {
    //         ...reservation,
    //         taken: true,
    //       }).then((res) => {
    //         popMessage("Reservation expired!");
    //       });
    //     }

    //     if (diff > NTOFIFY_MIN) {
    //       console.log("NOTIFY", reservation.name, diff);
    //     }
    //     // if (diff > EXPIRE_MIN) {
    //     //   return updateReservation(reservation.id, {
    //     //     ...reservation,
    //     //     taken: true,
    //     //   }).then((res) => {
    //     //     popMessage("Reservation expired!");
    //     //   });
    //     // }

    //     // if (dateTime < AFTER) {
    //     //   console.log(reservation.name, "Is close");
    //     // }
    //   });
    //   // console.log(dayjs(reservations[0].dateTime).format("HH:mm"));
    // }, 2000);

    // // if no reservations
    // const cancelDeadlineInterval = () => clearInterval(deadlineInterval);
    // if (stats.all === 0) cancelDeadlineInterval();
    // return cancelDeadlineInterval;
  }, [reservations]);

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
      dateTime: InputDateTimeToFirebaseTimestamp(form.get(INPUTS.dateTime)),
      persons: form.get(INPUTS.persons),
      name: form.get(INPUTS.name),
      more: form.get(INPUTS.more),
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
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.all && "tab-active"
          )}
          onClick={() => setFilter(FILTER.all)}
        >
          All ({stats.all})
        </button>
        <button
          className={classes(
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.taken && "tab-active"
          )}
          onClick={() => setFilter(FILTER.taken)}
        >
          Taken ({stats.taken})
        </button>
        <button
          className={classes(
            "tab  grow flex justify-center items-center gap-2",
            filter === FILTER.pending && "tab-active"
          )}
          onClick={() => setFilter(FILTER.pending)}
        >
          Pending ({stats.pending})
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
              <th className=" p-2 sm:p-4">More</th>
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
                  <th>{jsDateToTime(reservation.dateTime)}</th>
                  <th>{reservation.persons}</th>
                  <td>{reservation.name}</td>
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
            <button
              className="btn btn-sm sm:btn-md btn-primary"
              type="reset"
              onClick={() => {
                window.actionModal.close();
                takenReservation(selectedReservation.taken);
              }}
            >
              {selectedReservation.taken ? "Untaken" : "Taken"}
            </button>
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
