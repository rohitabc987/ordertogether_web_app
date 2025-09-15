import admin from 'firebase-admin';

// Important: You must generate a service account key in the Firebase console,
// Base64-encode the entire JSON file, and set it as a single environment variable.
// DO NOT hardcode the service account key in your code.
// For local development, you can create a `.env` file with the variable.

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable not set. Please check your .env file.');
  }

  try {
    // Decode the Base64 string to get the JSON string
    const serviceAccountJson = Buffer.from(base64ServiceAccount, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    // Throw a more descriptive error to help with debugging.
    throw new Error(`Firebase admin initialization failed: ${error.message}. Ensure FIREBASE_SERVICE_ACCOUNT_BASE64 is a valid Base64-encoded service account JSON.`);
  }
}

const adminApp = initializeAdminApp();
export const db = adminApp.firestore();
export const auth = adminApp.auth();
