import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7vvgC8MjfXDGvL6ZzAlHOlVIpzjZHKdI",
  authDomain: "resturant-reservation-d1a2e.firebaseapp.com",
  projectId: "resturant-reservation-d1a2e",
  storageBucket: "resturant-reservation-d1a2e.appspot.com",
  messagingSenderId: "87440285343",
  appId: "1:87440285343:web:72c5208808ed6e10608caa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
