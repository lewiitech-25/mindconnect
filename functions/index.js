const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {
  FieldValue,
  getFirestore,
} = require("firebase-admin/firestore");

initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

exports.createCounselorAccount = onCall(async (request) => {
  // 1. Ensure the caller is logged in
  if (!request.auth) {
    throw new HttpsError(
        "unauthenticated",
        "You must be logged in to perform this action.",
    );
  }

  const db = getFirestore();
  const callerUid = request.auth.uid;

  // 2. Verify that the caller is an admin
  const adminSnapshot = await db.collection("users").doc(callerUid).get();

  if (!adminSnapshot.exists) {
    throw new HttpsError(
        "permission-denied",
        "Your administrator profile was not found.",
    );
  }

  const adminData = adminSnapshot.data();

  if (adminData.role !== "admin") {
    throw new HttpsError(
        "permission-denied",
        "Only administrators can activate counselor accounts.",
    );
  }

  // 3. Validate the counselor document ID
  const counselorId = request.data?.counselorId;

  if (
    typeof counselorId !== "string" ||
    counselorId.trim().length === 0
  ) {
    throw new HttpsError(
        "invalid-argument",
        "A valid counselor document ID is required.",
    );
  }

  const counselorReference = db
      .collection("users")
      .doc(counselorId.trim());

  const counselorSnapshot = await counselorReference.get();

  if (!counselorSnapshot.exists) {
    throw new HttpsError(
        "not-found",
        "The counselor profile was not found.",
    );
  }

  const counselorData = counselorSnapshot.data();

  if (counselorData.role !== "counselor") {
    throw new HttpsError(
        "failed-precondition",
        "The selected profile is not a counselor profile.",
    );
  }

  const name =
    typeof counselorData.name === "string"
      ? counselorData.name.trim()
      : "";

  const email =
    typeof counselorData.email === "string"
      ? counselorData.email.trim().toLowerCase()
      : "";

  if (!name || !email) {
    throw new HttpsError(
        "failed-precondition",
        "The counselor must have a valid name and email address.",
    );
  }

  // Prevent accidentally activating the same profile twice
  if (counselorData.authUid) {
    throw new HttpsError(
        "already-exists",
        "This counselor already has an Authentication account.",
    );
  }

  let userRecord;

  try {
    // 4. Check whether the email already has a Firebase Auth account
    try {
      userRecord = await getAuth().getUserByEmail(email);

      throw new HttpsError(
          "already-exists",
          "An Authentication account already uses this email address.",
      );
    } catch (lookupError) {
      if (lookupError instanceof HttpsError) {
        throw lookupError;
      }

      if (lookupError.code !== "auth/user-not-found") {
        throw lookupError;
      }
    }

    // 5. Create the Firebase Authentication account
    //
    // A random password is used only to provision the account.
    // The counselor will receive a Firebase password-reset email
    // and choose their own password.
    const temporaryPassword = generateTemporaryPassword();

    userRecord = await getAuth().createUser({
      email,
      password: temporaryPassword,
      displayName: name,
      emailVerified: false,
      disabled: false,
    });

    // 6. Update the existing counselor Firestore profile
    await counselorReference.update({
      uid: userRecord.uid,
      authUid: userRecord.uid,
      accountStatus: "active",
      activatedAt: FieldValue.serverTimestamp(),
      activatedBy: callerUid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      counselorId: counselorSnapshot.id,
      authUid: userRecord.uid,
      email,
      message: "Counselor Authentication account created successfully.",
    };
  } catch (error) {
    console.error("createCounselorAccount failed:", error);

    // Remove the Auth account if Firestore updating failed
    if (
      userRecord?.uid &&
      !counselorData.authUid &&
      error.code !== "already-exists"
    ) {
      try {
        await getAuth().deleteUser(userRecord.uid);
      } catch (cleanupError) {
        console.error(
            "Unable to remove partially created Auth account:",
            cleanupError,
        );
      }
    }

    if (error instanceof HttpsError) {
      throw error;
    }

    if (error.code === "auth/email-already-exists") {
      throw new HttpsError(
          "already-exists",
          "An Authentication account already uses this email address.",
      );
    }

    if (error.code === "auth/invalid-email") {
      throw new HttpsError(
          "invalid-argument",
          "The counselor email address is invalid.",
      );
    }

    throw new HttpsError(
        "internal",
        "The counselor account could not be created.",
    );
  }
});

function generateTemporaryPassword() {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  const allCharacters = uppercase + lowercase + numbers + symbols;

  const requiredCharacters = [
    randomCharacter(uppercase),
    randomCharacter(lowercase),
    randomCharacter(numbers),
    randomCharacter(symbols),
  ];

  while (requiredCharacters.length < 20) {
    requiredCharacters.push(randomCharacter(allCharacters));
  }

  // Shuffle the generated password
  for (let index = requiredCharacters.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [requiredCharacters[index], requiredCharacters[randomIndex]] = [
      requiredCharacters[randomIndex],
      requiredCharacters[index],
    ];
  }

  return requiredCharacters.join("");
}

function randomCharacter(characters) {
  return characters[Math.floor(Math.random() * characters.length)];
}