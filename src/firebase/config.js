import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
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

// Primary app
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

//  Enable offline persistence (FREE)
enableIndexedDbPersistence(db, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})
  .then(() => {
    console.log("🔥 Firestore persistence enabled");
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("⚠️ Multiple tabs open, persistence only in one tab");
    } else if (err.code === "unimplemented") {
      console.warn("⚠️ Browser doesn't support persistence");
    }
  });

// Secondary app
const secondaryApp =
  getApps().find((a) => a.name === "Secondary") ||
  initializeApp(firebaseConfig, "Secondary");

export const secondaryAuth = getAuth(secondaryApp);

export default app;
