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

    const fetchPosts = async () => {
      setIsLoading(true);

      // Try to load from cache first
      try {
        const cachedPostsJson = localStorage.getItem('myPosts');
        if (cachedPostsJson) {
          setPosts(JSON.parse(cachedPostsJson));
        }
      } catch (e) {
        console.error('Failed to load myPosts from cache', e);
      }
      
      const result = await getMyPostsAction(user.id);
      
      if (result.success) {
        setPosts(result.posts);
        try {
          localStorage.setItem('myPosts', JSON.stringify(result.posts));
        } catch (e) {
          console.error('Failed to cache myPosts', e);
        }
      } else {
        setError(result.message || 'Failed to load posts.');
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [user, router]);
  
  const handlePostDelete = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    try {
      localStorage.setItem('myPosts', JSON.stringify(updatedPosts));
    } catch(e) {
      console.error('Failed to update cache after delete', e);
    }
  };

  if (!user) {
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
