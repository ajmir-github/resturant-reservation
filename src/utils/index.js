import { Timestamp } from "firebase/firestore";

// -------------- UTIL FUNCS
export function classes(...cls) {
  return cls.filter(Boolean).join(" ");
}

export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export const firebaseTimestampToJsDateTime = (timestamp) => {
  const jsStringDateTime = timestamp.toDate();
  const jsDate = new Date(jsStringDateTime);
  return jsDate;
};

export function inputDateToJSONDate(value) {
  const [year, month, day] = value.split("-").map((str) => parseInt(str));
  return { year, month, day };
}

export function JSONDatetoInputDate({ year, month, day }) {
  const pair = (num) => num.toString().padStart(2, "0");
  return `${pair(year)}-${pair(month)}-${pair(day)}`;
}

export const jsDateToInputDateTime = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

export const jsDateToTime = (jsDate) => {
  const localeTimeString = jsDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return localeTimeString;
};

export function InputDateTimeToFirebaseTimestamp(date) {
  const jsDate = inputDateTimeToJsDate(date);
  return Timestamp.fromDate(jsDate);
}
export function inputDateTimeToJsDate(date) {
  return new Date(date);
}

// -------------- ENUMS
export const INPUTS = {
  dateTime: "dateTime",
  persons: "persons",
  name: "name",
  table: "table",
  more: "more",
};

export const FILTER = {
  all: 1,
  taken: 2,
  pending: 3,
  expired: 4,
};

export const DATE_FORMAT = "YYYY-MM-DD";

export const RESERVATION_STATUS = {
  pending: "PENDING",
  taken: "TAKEN",
  expired: "EXPIRED",
};

export const RESERVATION_STATUS_LIST = ["PENDING", "TAKEN", "EXPIRED"];
