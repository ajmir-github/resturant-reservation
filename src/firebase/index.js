import { database } from "./config";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const reservationColName = "reservations";

// reservation onbject
// id, date, name, persons, table, specialRequest

const reservationRef = collection(database, reservationColName);

async function getReservations() {
  const snap = await getDocs(reservationRef);
  const reservations = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return reservations;
}

async function createReservation(reservation) {
  const ref = doc(reservationRef);
  await setDoc(ref, reservation);
  console.log("Reservations added!");
}

async function updateReservation(id, entries, merge = true) {
  const ref = doc(database, reservationColName, id);
  await setDoc(ref, entries, { merge });
  console.log("Reservation " + (merge ? "updated!" : "overwritten!"));
}

async function deleteReservation(id) {
  const ref = doc(database, reservationColName, id);
  await deleteDoc(ref);
  console.log("Reservation deleted!");
}

async function trackChanges(onChange) {
  const unsubscribe = onSnapshot(reservationRef, (querySnapshot) => {
    const reservations = [];
    querySnapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() });
    });
    onChange(reservations);
  });

  return unsubscribe;
}

export async function test() {
  // trackChanges((docs) => {
  //   console.log(docs);
  // });
}

export async function run() {
  // id, date, name, persons, table, specialRequest
  // await createReservation({
  //   date: Timestamp.fromDate(new Date()),
  //   name: "Esmat",
  //   persons: 3,
  //   table: "33",
  //   specialRequest: "Date",
  // });
  // await deleteReservation("one");
  // await getReservations();
  // await updateReservation("UjtmCL7zTfUdHIsEogkB", {
  //   name: "Ajmir",
  //   persons: count++,
  // });

  const reservations = await getReservations();
  reservations.forEach((doc) => {
    const time = new Timestamp(doc.date.seconds, doc.date.nanoseconds);
    const date = time.toDate();
    console.log(new Date(date).toLocaleString());
  });
}
