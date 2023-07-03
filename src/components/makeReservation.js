const INPUTS = {
  dateAndTime: "dataAndTime",
  persons: "persons",
  name: "name",
  table: "table",
  specialRequest: "specialRequest",
  phoneNumber: "phoneNumber",
};
export default function MakeReservation() {
  return (
    <div>
      {/* Make a reservation */}
      <button
        className="btn btn-circle bg-primary absolute bottom-0 right-0 m-5"
        onClick={() => window.make_reservation_modal.showModal()}
      >
        Add
      </button>
      <dialog id="make_reservation_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Make Reservations</h3>
          <div className="py-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date and time</span>
              </label>

              <input
                type="datetime-local"
                name={INPUTS.dateAndTime}
                required
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
                className="input w-full input-sm input-bordered input-secondary"
              />
            </div>
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-primary" type="submit">
              Add
            </button>
            <button
              className="btn"
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
