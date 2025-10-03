
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MyPostCard } from '@/components/my-post-card';
import { Button } from '@/components/ui/button';
import { getMyPostsAction } from '@/lib/actions';
import { useAuth } from '@/providers';
import type { Post } from '@/lib/types';
import { PlusCircle, Info, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MyPostsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const message = searchParams.get('message');
  const isSuccessMessage = message?.includes('success');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    let isMounted = true;

    const fetchPosts = async () => {
      // 1. Try to load from cache first for an instant UI
      let cachedPosts: Post[] = [];
      try {
        const cachedPostsRaw = localStorage.getItem(`myPosts_${user.id}`);
        if (cachedPostsRaw) {
          cachedPosts = JSON.parse(cachedPostsRaw);
          if (isMounted) {
            setPosts(cachedPosts);
            setIsLoading(false); // We have something to show, stop initial loading indicator
          }
        }
      } catch (e) {
        console.warn("Could not load posts from cache", e);
      }

      // 2. Fetch from server to get the latest, definitive data
      const result = await getMyPostsAction(user.id);
      
      if (!isMounted) return;

      if (result.success) {
        const serverPosts = result.posts;
        
        // 3. Smartly merge server data with cached data to prevent flicker
        const serverPostIds = new Set(serverPosts.map(p => p.id));
        const newPostsFromCache = cachedPosts.filter(p => !serverPostIds.has(p.id));
        
        // The definitive list is the server's list plus any new posts from cache
        // that haven't shown up on the server yet.
        const finalPosts = [...newPostsFromCache, ...serverPosts];
        
        setPosts(finalPosts);
        setError(null);
        
        // 4. Update cache with the new definitive list
        try {
          localStorage.setItem(`myPosts_${user.id}`, JSON.stringify(finalPosts));
        } catch (e) {
          console.warn("Could not save posts to cache", e);
        }
      } else {
        setError(result.message || 'Failed to load posts.');
      }
      
      // Always set loading to false after server fetch is complete
      setIsLoading(false); 
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [user, router]);
  
  const handlePostDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    // The cache update logic is now inside MyPostCard
  };

  if (!user && !isLoading) {
    return null; // or a loading indicator while redirecting
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">My Posts</h1>
        <Button asChild>
          <Link href="/create-post">
            <PlusCircle />
            Create New Post
          </Link>
        </Button>
      </div>

       {message && (
        <Alert variant={isSuccessMessage ? 'success' : 'default'} className="mb-6">
          {isSuccessMessage ? <CheckCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          <AlertTitle>{isSuccessMessage ? 'Success' : 'Notification'}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader className="w-8 h-8 animate-spin" />
          <span className="ml-4 text-muted-foreground">Loading your posts...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <MyPostCard key={post.id} post={post} onDelete={handlePostDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
           <div className="flex justify-center mb-4">
            <img src="/images/empty-state.svg" alt="No Posts" className="w-48 h-48"/>
          </div>
          <h2 className="text-2xl font-headline text-primary">
            You haven't created any posts yet.
          </h2>
          <p className="text-muted-foreground mt-2">
          Want free delivery and great coupons? Create a group order today
          </p>
        </div>
      )}
    </div>
  );
}
