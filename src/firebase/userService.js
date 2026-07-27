import { auth, db } from './config'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore'
import { deleteUser, updatePassword } from 'firebase/auth'

// Load the signed-in user's Firestore profile.
export async function getUserProfile(uid) {
  const userReference = doc(db, 'users', uid)
  const snapshot = await getDoc(userReference)

  if (!snapshot.exists()) {
    throw new Error('User profile was not found.')
  }

  return {
    uid: snapshot.id,
    ...snapshot.data()
  }
}

// Save notification preferences in the user's Firestore document.
export async function updateNotificationPreferences(uid, preferences) {
  const userReference = doc(db, 'users', uid)

  await updateDoc(userReference, {
    notificationPreferences: preferences
  })
}

// Change the signed-in user's Firebase Authentication password.
export async function changeUserPassword(newPassword) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('No authenticated user was found.')
  }

  await updatePassword(currentUser, newPassword)
}

// Delete every document inside one user subcollection.
async function deleteSubcollection(uid, collectionName) {
  const collectionReference = collection(
    db,
    'users',
    uid,
    collectionName
  )

  const snapshot = await getDocs(collectionReference)

  await Promise.all(
    snapshot.docs.map((documentSnapshot) =>
      deleteDoc(documentSnapshot.ref)
    )
  )
}

// Delete the user's moods, appointments, Firestore profile,
// and Firebase Authentication account.
export async function eraseUserAccount(uid) {
  const currentUser = auth.currentUser

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('No authenticated user was found.')
  }

  await deleteSubcollection(uid, 'moods')
  await deleteSubcollection(uid, 'appointments')

  await deleteDoc(doc(db, 'users', uid))

  await deleteUser(currentUser)
}