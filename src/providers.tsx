
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/data';
import type { User } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

let unsubscribe: (() => void) | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in with Firebase, now get our app's user ID (document ID)
        // This is a workaround to get the session cookie value on the client
        const response = await fetch('/api/session');
        const session = await response.json();
        const userId = session.userId;
        
        if (userId) {
          if (unsubscribe) {
            unsubscribe();
          }
          const userDocRef = doc(db, 'users', userId);
          unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUser({ id: doc.id, ...doc.data() } as User);
            } else {
              setUser(null);
            }
            setLoading(false);
          });
        } else {
          setUser(null);
          setLoading(false);
        }
      } else {
        // User is signed out
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
