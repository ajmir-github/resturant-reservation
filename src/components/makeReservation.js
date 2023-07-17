import { useState } from "react";
import { createReservation } from "../firebase";
import { InputDateTimeToFirebaseTimestamp } from "../utils";

const INPUTS = {
  dateTime: "dateTime",
  persons: "persons",
  name: "name",

  more: "more",
};
export default function MakeReservation({ date }) {
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const reservation = {
      // dateTime: InputDateTimeToFirebaseTimestamp(form.get(INPUTS.dateTime)),
      dateTime: InputDateTimeToFirebaseTimestamp(
        date + "T" + form.get(INPUTS.dateTime)
      ),
      persons: form.get(INPUTS.persons),
      name: form.get(INPUTS.name),
      more: form.get(INPUTS.more),
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

      {/* Make a reservation */}
      <button
        className="btn btn-circle btn-primary absolute bottom-0 right-0 m-4 z-10"
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
                type="time"
                name={INPUTS.dateTime}
                required
                className="input w-full input-sm sm:input-md input-bordered input-primary"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Persons</span>
              </label>

              <input
                type="number"
                name={INPUTS.persons}
                required
                className="input w-full input-sm sm:input-md input-bordered input-primary"
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
                className="input w-full input-sm sm:input-md input-bordered input-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">More</span>
              </label>

              <textarea
                type="text"
                name={INPUTS.more}
                className="textarea w-full textarea-sm sm:textarea-md input-secondary"
              />
            </div>
          </div>
          <div className="modal-action ">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm sm:btn-md btn-primary" type="submit">
              Add
            </button>
            <button
              className="btn btn-sm sm:btn-md"
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
