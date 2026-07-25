import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ---------- Primary app: normal app usage (whoever is currently logged in) ----------
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// ---------- Secondary app: ONLY used to create new accounts (HOD / Principal) ----------
// Creating a user with the primary `auth` instance signs the browser in as that
// new user, which would kick Admin out of their own session. Firebase supports
// running a second, independent app instance purely for this purpose — we create
// the account there, immediately sign that instance back out, and the Admin's
// primary session is never touched.
const secondaryApp =
  getApps().find((a) => a.name === "Secondary") ||
  initializeApp(firebaseConfig, "Secondary");

export const secondaryAuth = getAuth(secondaryApp);

export default app;
