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

function getClientAuth() {
  if (typeof window === 'undefined') {
    // On the server, return a dummy auth object or handle as needed
    // For this app, auth is primarily used on the client for sign-in flows.
    return null;
  }
  
  // Dynamically set authDomain on the client-side to handle preview domains
  firebaseConfig.authDomain = window.location.hostname;

  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return getAuth(app);
}

// We export a function that returns the auth instance.
// Components will call this, ensuring it only runs on the client.
export const auth = getClientAuth();
