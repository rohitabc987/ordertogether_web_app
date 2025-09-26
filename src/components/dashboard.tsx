
'use client';

import { useState, useMemo } from 'react';
import { PostCard } from './post-card';
import { PostFilters } from './post-filters';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';

export function Dashboard({ initialPosts }: { initialPosts: Post[] }) {
  const { user } = useAuth();
  const [posts] = useState<Post[]>(initialPosts);
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
          <h1 className="text-4xl font-headline bg-brand-gradient text-transparent bg-clip-text pb-2">
            Active Group Orders
          </h1>
          <p className="text-muted-foreground">
            {user ? (
              `Orders available in ${locationName}. Join one or create your own!`
            ) : (
              'Discover group orders near you. Log in to create your own.'
            )}
          </p>
        </div>
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
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
          <div className="flex justify-center mb-4">
            <img src="/images/empty-state.svg" alt="No Orders" className="w-48 h-48"/>
          </div>
          <h2 className="text-2xl font-headline text-primary">
            {user ? `No active orders in ${locationName} yet.` : 'No orders found'}
          </h2>
          <p className="text-muted-foreground mt-2">
            {user ? (
              'Be the first to start a group order!'
            ) : (
              'Check back later or adjust the filters to see if there are orders in your area.'
            )}
          </p>
        </div>
      )}
    </div>
  );
}
