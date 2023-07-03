import { useState } from "react";
import { createReservation } from "../firebase";
import { HTMLDateTimeToFirebase } from "../firebase/dateConvertor";

const INPUTS = {
  dateTime: "dateTime",
  persons: "persons",
  name: "name",
  table: "table",
  specialRequest: "specialRequest",
  phoneNumber: "phoneNumber",
};
export default function MakeReservation() {
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const reservation = {
      dateTime: HTMLDateTimeToFirebase(form.get(INPUTS.dateTime)),
      persons: form.get(INPUTS.persons),
      table: form.get(INPUTS.table),
      name: form.get(INPUTS.name),
      specialRequest: form.get(INPUTS.specialRequest),
      phoneNumber: form.get(INPUTS.phoneNumber),
      taken: false,
    };

    createReservation(reservation).then((res) => {
      setMessage(res);
      window.make_reservation_modal.close();
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    });
  };

  return (
    <div>
      {/* added toast */}
      {message && (
        <div className="toast toast-start">
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Make a reservation */}
      <button
        className="btn btn-circle btn-primary absolute bottom-0 right-0 m-2 sm:m-4"
        onClick={() => window.make_reservation_modal.showModal()}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <dialog id="make_reservation_modal" className="modal">
        <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
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
                className="input w-full input-xs sm:input-sm input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Number of persons</span>
              </label>

              <input
                type="number"
                name={INPUTS.persons}
                required
                className="input w-full input-xs sm:input-sm input-bordered input-primary"
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
                className="input w-full input-xs sm:input-sm input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Table</span>
              </label>

              <input
                type="text"
                name={INPUTS.table}
                className="input w-full input-xs sm:input-sm input-bordered input-secondary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Special Request</span>
              </label>

              <textarea
                type="text"
                name={INPUTS.specialRequest}
                className="textarea w-full textarea-xs sm:textarea-md input-secondary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>

              <input
                type="text"
                name={INPUTS.phoneNumber}
                className="input w-full input-xs sm:input-sm input-bordered input-secondary"
              />
            </div>
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-xs sm:btn-sm btn-primary" type="submit">
              Add
            </button>
            <button
              className="btn btn-xs sm:btn-sm"
              type="reset"
              onClick={() => window.make_reservation_modal.close()}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
