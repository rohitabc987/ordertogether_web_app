'use client';

import { useEffect, useContext } from 'react';
import { useAuth, PostViewContext } from '@/providers';
import { updatePostViewCountAction } from '@/lib/actions';

export function PostViewTracker() {
  const { user } = useAuth();
  const { getViewedPosts, clearViewedPosts } = useContext(PostViewContext);

  useEffect(() => {
    const sendUpdate = () => {
      if (user?.id) {
        const viewedPosts = getViewedPosts();
        if (viewedPosts.size > 0) {
          updatePostViewCountAction(user.id, viewedPosts.size);
          clearViewedPosts(); // Reset after sending
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendUpdate();
      }
    };

    // Add listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendUpdate);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendUpdate);
      // Final attempt to send data when the component unmounts or user navigates away
      sendUpdate();
    };
  }, [user, getViewedPosts, clearViewedPosts]);

  return null; // This component does not render anything
}
