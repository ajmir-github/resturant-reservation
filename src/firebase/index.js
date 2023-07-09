import { database } from "./config";
import {
  // Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseTimestampToJsDateTime, inputDateToJSONDate } from "../utils";

const reservationColName = "reservations";

// reservation onbject
// id, date, name, persons, table, specialRequest

function normalizeFirebaseDoc(doc) {
  const id = doc.id;
  const data = doc.data();
  const dateTime = firebaseTimestampToJsDateTime(data.dateTime);
  return {
    ...data,
    id,
    dateTime,
  };
}

const reservationRef = collection(database, reservationColName);

export async function getReservations() {
  const snap = await getDocs(reservationRef);
  return snap.docs.map(normalizeFirebaseDoc);
}

export async function createReservation(reservation) {
  const ref = doc(reservationRef);
  await setDoc(ref, reservation);
  return "Reservations added!";
}

export async function updateReservation(id, entries, merge = true) {
  const ref = doc(database, reservationColName, id);
  await setDoc(ref, entries, { merge });
  console.log("Reservation " + (merge ? "updated!" : "overwritten!"));
}

export async function deleteReservation(id) {
  const ref = doc(database, reservationColName, id);
  await deleteDoc(ref);
  console.log("Reservation deleted!");
}

export function trackChanges(inputDate, onChange) {
  const { year, month, day } = inputDateToJSONDate(inputDate);
  const filterQuery = query(
    reservationRef,
    where("dateTime", ">", new Date(`${year}-${month}-${day}`)),
    where("dateTime", "<", new Date(`${year}-${month}-${day + 1}`))
  );

  const unsubscribe = onSnapshot(filterQuery, (querySnapshot) => {
    const reservations = [];
    querySnapshot.forEach((doc) => {
      reservations.push(normalizeFirebaseDoc(doc));
    });
    onChange(reservations);
  });

  return () => unsubscribe();
}

// ------------ delete a week old reservations
// setTimeout(async () => {
//   const inputDate = getCurrentDate();
//   const { year, month, day } = inputDateToJSONDate(inputDate);
//   const jsDate = new Date(`${year}-${month}-${day - 1}`);
//   const filterQuery = query(reservationRef, where("dateTime", "<", jsDate));
//   const snap = await getDocs(filterQuery);
//   snap.docs.map(normalizeFirebaseDoc).forEach((doc) => {
//     console.log(doc.name);
//   });
// }, 1000);

// setTimeout(async () => {
//   const year = 2023;
//   const month = 7;
//   const today = 7;

//   const createDate = ({ year, month, day }) =>
//     new Date(`${year}-${month}-${day}`);
//   const q = query(
//     reservationRef,
//     where("dateTime", ">", createDate({ year, month, day: today })),
//     where("dateTime", "<", createDate({ year, month, day: today + 1 }))
//   );
//   // const q = query(reservationRef, where("dateTime", ">", now));
//   const snap = await getDocs(q);
//   snap.docs.map(normalizeFirebaseDoc).forEach((doc) => {
//     console.log(doc.dateTime);
//   });
// }, 1000);

// export async function test() {
//   // trackChanges((docs) => {
//   //   console.log(docs);
//   // });
// }

// export async function run() {
//   // id, date, name, persons, table, specialRequest
//   // await createReservation({
//   //   date: Timestamp.fromDate(new Date()),
//   //   name: "Esmat",
//   //   persons: 3,
//   //   table: "33",
//   //   specialRequest: "Date",
//   // });
//   // await deleteReservation("one");
//   // await getReservations();
//   // await updateReservation("UjtmCL7zTfUdHIsEogkB", {
//   //   name: "Ajmir",
//   //   persons: count++,
//   // });

//   const reservations = await getReservations();
//   reservations.forEach((doc) => {
//     const time = new Timestamp(doc.date.seconds, doc.date.nanoseconds);
//     const date = time.toDate();
//     console.log(new Date(date).toLocaleString());
//   });
// }
