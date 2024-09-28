// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// Import Dotenv
require("dotenv").config();
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: "55965291046",
  appId: process.env.FIREBASE_APPID,
  measurementId: "G-9TYQZH2F0R"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
