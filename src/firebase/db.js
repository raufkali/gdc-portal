import { db } from "./config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Generic fetch all documents from a collection
export const fetchCollection = async (collectionName, conditions = []) => {
  let q = collection(db, collectionName);
  if (conditions.length) {
    const constraints = conditions
      .map((c) =>
        c.type === "where"
          ? where(c.field, c.operator, c.value)
          : c.type === "orderBy"
            ? orderBy(c.field, c.direction || "asc")
            : null,
      )
      .filter(Boolean);
    if (constraints.length) q = query(q, ...constraints);
  }
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addDocument = (collectionName, data) =>
  addDoc(collection(db, collectionName), data);
export const updateDocument = (collectionName, id, data) =>
  updateDoc(doc(db, collectionName, id), data);
export const deleteDocument = (collectionName, id) =>
  deleteDoc(doc(db, collectionName, id));
