import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBEPgAcUKrepdDAIwMj5mhDoHUY-d6EhM",
  authDomain: "wangku-ewallet.firebaseapp.com",
  projectId: "wangku-ewallet",
  storageBucket: "wangku-ewallet.firebasestorage.app",
  messagingSenderId: "884410986772",
  appId: "1:884410986772:web:558bb513434078bb6a1201",
  measurementId: "G-S5VVMEPVKZ"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);