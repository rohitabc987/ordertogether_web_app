// @ts-nocheck
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA00F2LyzvMPYTLN4SLjZ0aOPky8CcDyLA",
  authDomain: "studio-5219136729-6683e.firebaseapp.com",
  projectId: "studio-5219136729-6683e",
  storageBucket: "studio-5219136729-6683e.appspot.com",
  messagingSenderId: "183055801352",
  appId: "1:183055801352:web:495772bc4e16491fe6c5bd"
};

// We export a function that returns the auth instance.
// Components will call this, ensuring it only runs on the client.
export function auth() {
  if (typeof window === 'undefined') {
    // On the server, return null.
    // Auth is only needed on the client for the sign-in flow.
    return null;
  }
  
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return getAuth(app);
}
