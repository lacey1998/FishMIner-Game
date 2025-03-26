import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDCp_8TaKUev5H3bPdNcvI_bSD49jU-zdg",
  authDomain: "fishminer-game.firebaseapp.com",
  projectId: "fishminer-game",
  storageBucket: "fishminer-game.firebasestorage.app",
  messagingSenderId: "367013307299",
  appId: "1:367013307299:web:62768c67abbae2f94df016",
  measurementId: "G-XZ47Y0BYQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);