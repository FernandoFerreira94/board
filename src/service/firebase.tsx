// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzQcpdVnrHOJ-Pqvo6ixJ-rTbEMrMs8_s",
  authDomain: "listtask-a2135.firebaseapp.com",
  projectId: "listtask-a2135",
  storageBucket: "listtask-a2135.firebasestorage.app",
  messagingSenderId: "380189500976",
  appId: "1:380189500976:web:eb0318ffcc3588222c6ff5",
  measurementId: "G-JHVF5SQD8T",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
