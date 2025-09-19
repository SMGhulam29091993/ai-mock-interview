// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8phZSoyhLpwjtYMdMQ2HYVGx1sqGIr2g",
  authDomain: "ai-interview-8e297.firebaseapp.com",
  projectId: "ai-interview-8e297",
  storageBucket: "ai-interview-8e297.firebasestorage.app",
  messagingSenderId: "725829678625",
  appId: "1:725829678625:web:9acf9d7508e3fb86b3d560",
  measurementId: "G-GYH0Q41G7J",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
