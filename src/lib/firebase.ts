// @ts-nocheck
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA00F2LyzvMPYTLN4SLjZ0aOPky8CcDyLA",
  authDomain: "studio-5219136729-6683e.firebaseapp.com",
  projectId: "studio-5219136729-6683e",
  storageBucket: "studio-5219136729-6683e.appspot.com",
  messagingSenderId: "183055801352",
  appId: "1:183055801352:web:495772bc4e16491fe6c5bd"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with persistent cache
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});


export { app, auth, db };

    