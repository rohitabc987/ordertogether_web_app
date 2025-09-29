

'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { updatePostViewCountAction } from '@/lib/actions';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

interface PostViewContextType {
  incrementViewCount: () => void;
}

export const PostViewContext = createContext<PostViewContextType>({
  incrementViewCount: () => {},
});

async function fetchWithRetry(url: string, retries = 3, delay = 300): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.clone().json();
        if (data.user) {
          return response;
        }
      }
      // Don't retry on 404 or other client errors that indicate no session
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
    } catch (error) {
       // Only retry on network errors
       console.warn(`Fetch attempt ${i + 1} failed. Retrying...`);
    }
    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
  }
  return fetch(url); // Final attempt
}

function PostViewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const viewCountRef = useRef(0);

  const incrementViewCount = () => {
    viewCountRef.current += 1;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && viewCountRef.current > 0) {
        if (user?.id) {
          updatePostViewCountAction(user.id, viewCountRef.current);
          viewCountRef.current = 0; // Reset after sending
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Fallback: try to update when the component unmounts
      if (viewCountRef.current > 0 && user?.id) {
        updatePostViewCountAction(user.id, viewCountRef.current);
      }
    };
  }, [user]);

  return (
    <PostViewContext.Provider value={{ incrementViewCount }}>
      {children}
    </PostViewContext.Provider>
  );
}


export function AuthProvider({ children, initialUser }: { children: React.ReactNode, initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  
  // No initial loading state if we have user data from the server
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // If the server didn't provide a user, we might need to fetch it.
        // This happens on client-side navigation after login.
        if (!user) {
          try {
            const response = await fetchWithRetry('/api/session');
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
            // User data is already present from server hydration
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
  }, [user]);

  // Don't render children until we have determined the auth state
  // to avoid flashing content.
  if (loading) {
      return null;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <PostViewProvider>{children}</PostViewProvider>
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

export function Providers({ children, initialUser }: { children: React.ReactNode, initialUser: User | null }) {
  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
