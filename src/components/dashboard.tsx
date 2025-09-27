
'use client';

import { useState, useMemo } from 'react';
import { PostCard } from './post-card';
import { PostFilters } from './post-filters';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { AboutSection } from './about-section';
import { Button } from './ui/button';

const POSTS_PER_PAGE = 10;

export function Dashboard({ initialPosts }: { initialPosts: Post[] }) {
  const { user } = useAuth();
  const [posts] = useState<Post[]>(initialPosts);
  const [timeFilter, setTimeFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);

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

      const remainingNeeded = post.totalAmount - post.contributionAmount;
      const amountMatch = remainingNeeded >= amountFilter[0] && remainingNeeded <= amountFilter[1];

      return timeMatch && amountMatch;
    });
  }, [posts, timeFilter, amountFilter]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);


  const locationName = user?.institution?.institutionName || user?.location?.area || user?.location?.city || 'your area';

  return (
    <div className="space-y-8">
      <AboutSection />
      
      <div id="active-orders" className="scroll-mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold font-headline">
              Active Group Orders
            </h2>
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

        {paginatedPosts.length > 0 ? (
          <div className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-4">
              {paginatedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card mt-6">
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
    </div>
  );
}
