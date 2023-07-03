import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";

function App() {
  return (
    <div className="flex flex-col p-2 gap-2">
      <input
        type="date"
        name={"date"}
        className="input w-full input-bordered input-primary input-sm"
      />
      <Reservations />
      <MakeReservation />
    </div>
  );
}

export default App;
