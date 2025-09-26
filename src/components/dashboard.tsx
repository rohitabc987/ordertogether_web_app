'use client';

import { useState, useMemo } from 'react';
import { PostCard } from './post-card';
import { PostFilters } from './post-filters';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { Button } from './ui/button';
import Link from 'next/link';
import { PlusCircle, LogIn } from 'lucide-react';

export function Dashboard({ initialPosts }: { initialPosts: Post[] }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [timeFilter, setTimeFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState([0, 2000]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const deadline = new Date(post.deadline);
      const now = new Date();
      
      let timeMatch = true;
      if (timeFilter !== 'all') {
        const hours = parseInt(timeFilter);
        const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);
        timeMatch = deadline <= cutoff;
      }

      const amountMatch = post.minAmount >= amountFilter[0] && post.maxAmount <= amountFilter[1];

      return timeMatch && amountMatch;
    });
  }, [posts, timeFilter, amountFilter]);

  const locationName = user?.institution?.institutionName || user?.location?.area || user?.location?.city || 'your area';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            {user ? 'Open Orders' : 'Latest Orders'}
          </h1>
          <p className="text-muted-foreground">
            {user ? (
              `Orders available in ${locationName}.`
            ) : (
              <span>
                See orders from your area.
              </span>
            )}
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/create-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>
      
      <PostFilters
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
      />

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No active orders found.</h2>
          {user ? (
            <p className="text-muted-foreground mt-2">Why not be the first to create one?</p>
          ) : (
            <p className="text-muted-foreground mt-2">Check back later or modify filter to see if there are orders in your area.</p>
          )}
        </div>
      )}
    </div>
  );
}
