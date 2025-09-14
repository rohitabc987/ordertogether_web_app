import admin from 'firebase-admin';

// Important: You must generate a service account key in the Firebase console
// and set it as an environment variable.
// DO NOT hardcode the service account key in your code.
// For local development, you can create a `serviceAccountKey.json` file
// and set GOOGLE_APPLICATION_CREDENTIALS environment variable to its path.
// In a deployed environment, set these as environment variables.

const serviceAccount = {
  "type": process.env.FIREBASE_ADMIN_TYPE,
  "project_id": process.env.FIREBASE_ADMIN_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_ADMIN_AUTH_URI,
  "token_uri": process.env.FIREBASE_ADMIN_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
};


if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
