import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

// Get all appointments for a user
export async function getAppointments(uid) {
  const appointmentsRef = collection(db, "users", uid, "appointments");

  const q = query(appointmentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Book a new appointment
export async function bookAppointment(uid, appointment) {
  const docRef = await addDoc(
    collection(db, "users", uid, "appointments"),
    {
      ...appointment,
      createdAt: new Date().toISOString(),
    }
  );

  return docRef.id;
}

// Cancel an appointment
export async function cancelAppointment(uid, appointmentId) {
  await deleteDoc(
    doc(db, "users", uid, "appointments", appointmentId)
  );
}