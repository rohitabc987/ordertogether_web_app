'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User } from '@/lib/types';
import { updatePostViewCountAction } from '@/lib/actions';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

interface PostViewContextType {
  trackViewedPost: (postId: string) => void;
}

export const PostViewContext = createContext<PostViewContextType>({
  trackViewedPost: () => {},
});


function PostViewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const viewedPostIdsInSession = useRef(new Set<string>());

  const trackViewedPost = (postId: string) => {
    viewedPostIdsInSession.current.add(postId);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && viewedPostIdsInSession.current.size > 0) {
        if (user?.id) {
          updatePostViewCountAction(user.id, viewedPostIdsInSession.current.size);
          viewedPostIdsInSession.current.clear(); // Reset after sending
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Fallback: try to update when the component unmounts
      if (viewedPostIdsInSession.current.size > 0 && user?.id) {
        updatePostViewCountAction(user.id, viewedPostIdsInSession.current.size);
      }
    };
  }, [user]);

  return (
    <PostViewContext.Provider value={{ trackViewedPost }}>
      {children}
    </PostViewContext.Provider>
  );
}


export function AuthProvider({ children, initialUser }: { children: React.ReactNode, initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(() => {
    // Load initial user from localStorage if available
    try {
      const cachedUser = localStorage.getItem('cachedUser');
      return cachedUser ? JSON.parse(cachedUser) : initialUser;
    } catch (error) {
      console.error('Failed to load cached user', error);
      return initialUser;
    }
  });
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // If we have an initial user from server, update cache
    if (initialUser) {
      try {
        localStorage.setItem('cachedUser', JSON.stringify(initialUser));
      } catch (error) {
        console.error('Failed to cache initial user', error);
      }
      if (JSON.stringify(user) !== JSON.stringify(initialUser)) {
        setUser(initialUser);
      }
      setLoading(false);
      return;
    }

    // If no initial user, this might be a client-side navigation or first load with no session.
    let isMounted = true;
    
    async function fetchSession() {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const session = await response.json();
          const fetchedUser = session.user || null;
          if (isMounted) {
            setUser(fetchedUser);
            if (fetchedUser) {
              localStorage.setItem('cachedUser', JSON.stringify(fetchedUser));
            } else {
              localStorage.removeItem('cachedUser');
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            localStorage.removeItem('cachedUser');
          }
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('cachedUser');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [initialUser, user]);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? null : <PostViewProvider>{children}</PostViewProvider>}
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
