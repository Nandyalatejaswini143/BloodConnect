
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAxXq7KNNbaF7AS2jEjWrUNB-t45wLYsms",
  authDomain: "bloodconnect-d965b.firebaseapp.com",
  projectId: "bloodconnect-d965b",
  storageBucket: "bloodconnect-d965b.firebasestorage.app",
  messagingSenderId: "587910461554",
  appId: "1:587910461554:web:26d957f77fa940812c2aeb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
