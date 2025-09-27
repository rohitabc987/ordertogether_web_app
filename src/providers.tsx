
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in with Firebase, fetch our app user data from the API
        try {
          const response = await fetch('/api/session');
          if (response.ok) {
            const session = await response.json();
            setUser(session.user || null);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch session:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribeAuth();
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
