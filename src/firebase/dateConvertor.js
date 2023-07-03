import { Timestamp } from "firebase/firestore";

export function HTMLDateTimeToFirebase(date) {
  const jsDate = HTMLDateTimeToJS(date);
  return Timestamp.fromDate(jsDate);
}
export function HTMLDateTimeToJS(date) {
  return new Date(date);
}

export const jsToLocalStringTime = (jsDate) => {
  const localeTimeString = jsDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return localeTimeString;
};
export const timestampToJsDate = (timestamp) => {
  const jsStringDateTime = timestamp.toDate();
  const jsDate = new Date(jsStringDateTime);
  return jsDate;
};

export const jsDateToHTMLInput = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};
