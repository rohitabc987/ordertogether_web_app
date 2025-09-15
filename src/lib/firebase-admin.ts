import admin from 'firebase-admin';

// Important: You must generate a service account key in the Firebase console
// and set it as an environment variable.
// DO NOT hardcode the service account key in your code.
// For local development, you can create a `.env` file with the variables.
// In a deployed environment, set these as environment variables.

function initializeAdminApp() {
   if (admin.apps.length > 0) {
    return admin.app();
  }

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

  if (!serviceAccount.project_id) {
    throw new Error('Firebase Admin environment variables not set. Please check your .env file.');
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    // Throw a more descriptive error to help with debugging.
    throw new Error(`Firebase admin initialization failed: ${error.message}`);
  }
}

const adminApp = initializeAdminApp();
export const db = adminApp.firestore();
export const auth = adminApp.auth();
