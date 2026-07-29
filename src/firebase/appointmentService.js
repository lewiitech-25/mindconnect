import { db } from './config'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  runTransaction,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'

// Get appointments belonging to one student
export async function getAppointments(studentUid) {
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('studentUid', '==', studentUid)
  )

  const snapshot = await getDocs(appointmentsQuery)

  const createSlotId = ({
    counselorId,
    dateValue,
    timeSlot
  }) => {
    const safeTime = timeSlot
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/:/g, '-')

    return `${counselorId}_${dateValue}_${safeTime}`
  }

  const appointments = snapshot.docs.map((appointmentDoc) => ({
    id: appointmentDoc.id,
    ...appointmentDoc.data()
  }))

  return appointments.sort((first, second) => {
    const firstDate =
      first.createdAt?.toMillis?.() ||
      new Date(first.createdAt || 0).getTime()

    const secondDate =
      second.createdAt?.toMillis?.() ||
      new Date(second.createdAt || 0).getTime()

    return secondDate - firstDate
  })
}

// Get appointments assigned to one counsellor
export async function getCounselorAppointments(counselorId) {
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('counselorId', '==', counselorId)
  )

  const snapshot = await getDocs(appointmentsQuery)

  const appointments = snapshot.docs.map((appointmentDoc) => ({
    id: appointmentDoc.id,
    ...appointmentDoc.data()
  }))

  return appointments.sort((first, second) => {
    const firstDate =
      first.createdAt?.toMillis?.() ||
      new Date(first.createdAt || 0).getTime()

    const secondDate =
      second.createdAt?.toMillis?.() ||
      new Date(second.createdAt || 0).getTime()

    return secondDate - firstDate
  })
}

const createSlotId = ({
  counselorId,
  dateValue,
  timeSlot
}) => {

  const safeTime = timeSlot
    .replace(/:/g,'-')
    .replace(/\s+/g,'-')
    .toLowerCase()

  return `${counselorId}_${dateValue}_${safeTime}`
}
// Book a new appointment
export const bookAppointment = async (
  studentUid,
  appointmentData
) => {
  if (!studentUid) {
    throw new Error(
      'You must be logged in to book an appointment.'
    )
  }

  const {
    counselorId,
    dateValue,
    timeSlot
  } = appointmentData

  if (
    !counselorId ||
    !dateValue ||
    !timeSlot
  ) {
    throw new Error(
      'Counselor, date and time are required.'
    )
  }

  const slotId = createSlotId({
    counselorId,
    dateValue,
    timeSlot
  })

  const slotReference = doc(
    db,
    'appointmentSlots',
    slotId
  )

  const appointmentReference = doc(
    collection(db, 'appointments')
  )

  await runTransaction(
    db,
    async (transaction) => {
      const slotSnapshot =
        await transaction.get(
          slotReference
        )

      if (slotSnapshot.exists()) {
        const slotData =
          slotSnapshot.data()

        if (
          slotData.status !==
          'Cancelled'
        ) {
          const slotError =
            new Error(
              'This time slot has just been booked by another student. Please choose another time.'
            )

          slotError.code =
            'slot-already-booked'

          throw slotError
        }
      }

      const appointment = {
        ...appointmentData,
        studentUid,
        status:
          appointmentData.status ||
          'Confirmed',
        slotId,
        createdAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp()
      }

      transaction.set(
        appointmentReference,
        appointment
      )

      transaction.set(
        slotReference,
        {
          appointmentId:
            appointmentReference.id,
          counselorId,
          dateValue,
          timeSlot,
          studentUid,
          status: 'Confirmed',
          createdAt:
            serverTimestamp(),
          updatedAt:
            serverTimestamp()
        }
      )
    }
  )

  return {
    id: appointmentReference.id,
    ...appointmentData,
    studentUid,
    slotId,
    status:
      appointmentData.status ||
      'Confirmed'
  }
}



// Update appointment status
export async function updateAppointmentStatus(
  appointmentId,
  status
) {
  await updateDoc(
    doc(db, 'appointments', appointmentId),
    {
      status,
      updatedAt: serverTimestamp()
    }
  )
}

// Save a counsellor's clinical note
export async function saveAppointmentClinicalNote(
  appointmentId,
  clinicalNote
) {
  await updateDoc(
    doc(db, 'appointments', appointmentId),
    {
      clinicalNote,
      status: 'Completed',
      updatedAt: serverTimestamp()
    }
  )
}

// Cancel an appointment
export const cancelAppointment = async (
  appointmentId
) => {
  const appointmentReference = doc(
    db,
    'appointments',
    appointmentId
  )

  await runTransaction(
    db,
    async (transaction) => {
      const appointmentSnapshot =
        await transaction.get(
          appointmentReference
        )

      if (
        !appointmentSnapshot.exists()
      ) {
        throw new Error(
          'Appointment not found.'
        )
      }

      const appointment =
        appointmentSnapshot.data()

      transaction.update(
        appointmentReference,
        {
          status: 'Cancelled',
          updatedAt:
            serverTimestamp()
        }
      )

      if (appointment.slotId) {
        transaction.delete(
          doc(
            db,
            'appointmentSlots',
            appointment.slotId
          )
        )
      }
    }
  )
}