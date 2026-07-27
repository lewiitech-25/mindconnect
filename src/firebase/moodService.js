import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

export async function getMoods(uid) {
  const moodsQuery = query(
    collection(db, "users", uid, "moods"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(moodsQuery);

  return snapshot.docs.map((moodDocument) => ({
    id: moodDocument.id,
    ...moodDocument.data()
  }));
}

export async function addMood(uid, mood, note) {
  const moodReference = collection(
    db,
    "users",
    uid,
    "moods"
  );

  await addDoc(moodReference, {
    mood,
    note,
    date: new Date().toISOString()
  });
}

export async function deleteMood(uid, moodId) {
  const moodReference = doc(
    db,
    "users",
    uid,
    "moods",
    moodId
  );

  await deleteDoc(moodReference);
}

export async function clearMoods(uid) {
  const moodsReference = collection(
    db,
    "users",
    uid,
    "moods"
  );

  const snapshot = await getDocs(moodsReference);

  await Promise.all(
    snapshot.docs.map((moodDocument) =>
      deleteDoc(moodDocument.ref)
    )
  );
}