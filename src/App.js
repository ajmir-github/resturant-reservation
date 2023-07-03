import Reservations from "./components/reservations";
import MakeReservation from "./components/makeReservation";

function jsDateToHtml(date) {
  const isoString = date.toISOString();
  return isoString.substring(0, isoString.indexOf("T") + 6);
}

function App() {
  return (
    <div className="flex flex-col p-2 gap-2">
      <input
        type="datetime-local"
        name={"date"}
        className="input w-full input-bordered input-primary input-sm"
        defaultValue={jsDateToHtml(new Date())}
      />
      <Reservations />
      <MakeReservation />
    </div>
  );
}

export default App;
