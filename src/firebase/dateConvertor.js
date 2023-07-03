import { Timestamp } from "firebase/firestore";

export function HTMLDateTimeToFirebase(date) {
  const jsDate = HTMLDateTimeToJS(date);
  return Timestamp.fromDate(jsDate);
}
export function HTMLDateTimeToJS(date) {
  return new Date(date);
}

export const jsToLocalStringTime = (jsDate) => {
  console.log(jsDate);
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
