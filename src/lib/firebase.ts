// @ts-nocheck
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA00F2LyzvMPYTLN4SLjZ0aOPky8CcDyLA",
  authDomain: "studio-5219136729-6683e.firebaseapp.com",
  projectId: "studio-5219136729-6683e",
  storageBucket: "studio-5219136729-6683e.appspot.com",
  messagingSenderId: "183055801352",
  appId: "1:183055801352:web:495772bc4e16491fe6c5bd"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
