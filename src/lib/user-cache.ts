// @ts-nocheck
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from './types';

let inMemoryUser: User | null = null;
const USER_CACHE_KEY = 'userProfileCache';

// Function to get the user profile from cache (in-memory or localStorage)
export function getCachedProfile(): User | null {
  if (inMemoryUser) {
    return inMemoryUser;
  }

  try {
    const cachedUserStr = localStorage.getItem(USER_CACHE_KEY);
    if (cachedUserStr) {
      inMemoryUser = JSON.parse(cachedUserStr);
      return inMemoryUser;
    }
  } catch (error) {
    console.error("Failed to read from localStorage", error);
  }

  return null;
}

// Function to update the user profile in the local cache
export function updateProfileLocally(updates: Partial<User>) {
  const currentUser = getCachedProfile();
  if (currentUser) {
    const updatedUser = { 
      ...currentUser, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    inMemoryUser = updatedUser;
    try {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  }
}

// Function to clear the user profile from cache
export function clearProfileCache() {
  inMemoryUser = null;
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage", error);
  }
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

let unsubscribe: (() => void) | null = null;

// Initialize the real-time listener for the user profile
export function initUserProfileCache(userId: string, callback: (user: User) => void) {
  if (unsubscribe) {
    unsubscribe();
  }

  const userDocRef = doc(db, 'users', userId);

  // Immediately fetch the document to populate the cache quickly
  getDoc(userDocRef).then(doc => {
    if (doc.exists()) {
      const serverUser = { id: doc.id, ...doc.data(), updatedAt: new Date().toISOString() } as User;
      const localUser = getCachedProfile();

      if (!localUser || !localUser.updatedAt || new Date(serverUser.updatedAt) > new Date(localUser.updatedAt)) {
        inMemoryUser = serverUser;
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(serverUser));
        callback(serverUser);
      }
    }
  });

  // Set up the real-time listener
  unsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const serverUser = { id: doc.id, ...doc.data(), updatedAt: new Date().toISOString() } as User;
      inMemoryUser = serverUser;
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(serverUser));
      callback(serverUser);
    }
  }, (error) => {
    console.error("Error listening to user profile changes:", error);
    // When offline, onSnapshot will error out. We can rely on the cached data.
  });

  return unsubscribe;
}
