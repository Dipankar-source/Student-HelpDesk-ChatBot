import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

console.log("🔥 Firebase project ID:", getApp().options.projectId);


const firebaseConfig = {
    apiKey: "AIzaSyAk7EOUaBhAbPsF3t5oBItWprze6IZH_OY",
    authDomain: "to-do-707f2.firebaseapp.com",
    databaseURL: "https://to-do-707f2-default-rtdb.firebaseio.com",
    projectId: "to-do-707f2",
    storageBucket: "to-do-707f2.firebasestorage.app",
    messagingSenderId: "239382297060",
    appId: "1:239382297060:web:a0d49a4aa9c8cff59a6ff1",
    measurementId: "G-SL7F0W0WQN"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);