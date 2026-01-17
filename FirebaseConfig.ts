import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCpwQc6G4eWfXGO_TCBC8Pqn5Zv8mqzZaA",
  authDomain: "wildlifesg-8d634.firebaseapp.com",
  databaseURL: "https://wildlifesg-8d634-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wildlifesg-8d634",
  storageBucket: "wildlifesg-8d634.firebasestorage.app",
  messagingSenderId: "67879099959",
  appId: "1:67879099959:web:bc7fd18fc2f39e2b6ca9b2",
  measurementId: "G-C4Z0VF953N"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH  = getAuth(FIREBASE_APP);
export const db = getDatabase(FIREBASE_APP);