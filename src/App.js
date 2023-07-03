import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";
import { convertjsDateToHtml } from "./firebase";

function App() {
  return (
    <div className="flex flex-col p-2 gap-2">
      <input
        type="datetime-local"
        name={"date"}
        className="input w-full input-bordered input-primary input-sm"
        // defaultValue={convertjsDateToHtml(new Date())}
      />
      <Reservations />
      <MakeReservation />
    </div>
  );
}

export default App;
