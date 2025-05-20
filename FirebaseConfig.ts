// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpwQc6G4eWfXGO_TCBC8Pqn5Zv8mqzZaA",
  authDomain: "wildlifesg-8d634.firebaseapp.com",
  projectId: "wildlifesg-8d634",
  storageBucket: "wildlifesg-8d634.firebasestorage.app",
  messagingSenderId: "67879099959",
  appId: "1:67879099959:web:bc7fd18fc2f39e2b6ca9b2",
  measurementId: "G-C4Z0VF953N"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH  = getAuth(FIREBASE_APP);