import { useState } from "react";
import { createReservation } from "../firebase";
import { InputDateTimeToFirebaseTimestamp, classes } from "../utils";
import { useForm } from "react-hook-form";

function Form({ handleSubmit, close }) {
  const form = useForm();
  const INPUTS = {
    dateTime: "dateTime",
    persons: "persons",
    name: "name",
    more: "more",
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <h3 className="font-bold text-lg">Make Reservations</h3>
      <div className="py-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Date and time</span>
          </label>

          <input
            type="time"
            name={INPUTS.dateTime}
            className="input w-full input-bordered input-primary"
            {...form.register(INPUTS.dateTime, { required: true })}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Persons</span>
          </label>
          <input
            type="number"
            className="input w-full input-bordered input-primary"
            {...form.register(INPUTS.persons, {
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>

          <input
            type="text"
            className="input w-full input-bordered input-primary"
            {...form.register(INPUTS.name, { required: true })}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">More</span>
          </label>

          <textarea
            type="text"
            className="textarea w-full  input-secondary"
            {...form.register(INPUTS.more)}
          />
        </div>
      </div>
      <div className="modal-action">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-primary" type="submit">
          Add
        </button>
        <button className="btn" type="button" onClick={close}>
          Close
        </button>
      </div>
    </form>
  );
}

export default function MakeReservation({ date }) {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const handleSubmit = (inputs) => {
    const reservation = {
      ...inputs,
      taken: false,
      dateTime: InputDateTimeToFirebaseTimestamp(date + "T" + inputs.dateTime),
    };
    createReservation(reservation).then((res) => {
      setMessage(res);
      setOpen(false);
      setTimeout(() => setMessage(null), 3000);
    });
  };
  const close = () => setOpen(false);
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
        onClick={() => setOpen(true)}
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

      {/* /make un mounted to reset the form */}
      <div className={classes("modal", open && "modal-open")}>
        <div className="modal-box">
          {open && <Form handleSubmit={handleSubmit} close={close} />}
        </div>
        <label className="modal-backdrop" onClick={close} />
      </div>
    </div>
  );
}
