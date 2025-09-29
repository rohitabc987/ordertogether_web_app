

'use client';

import { useState, useMemo, useRef } from 'react';
import { PostCard } from './post-card';
import { PostFilters } from './post-filters';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { AboutSection } from './about-section';
import { Button } from './ui/button';

const POSTS_PER_PAGE = 10;

export function Dashboard({ initialPosts, bannerImageUrl }: { initialPosts: Post[], bannerImageUrl: string | null }) {
  const { user } = useAuth();
  const [posts] = useState<Post[]>(initialPosts);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'recent' | 'active' | 'expired'>('recent');
  const [timeFilter, setTimeFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState([0, 10000]);
  const [genderFilter, setGenderFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('iit-dharwad');

  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const now = new Date();
      const deadline = new Date(post.deadline);
      const isExpired = deadline < now;

      // Status Filter
      let statusMatch = false;
      if (statusFilter === 'active') {
        statusMatch = !isExpired;
      } else if (statusFilter === 'expired') {
        const today = now.toDateString();
        statusMatch = isExpired && deadline.toDateString() === today;
      } else { // 'recent'
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        statusMatch = deadline >= threeHoursAgo;
      }

      // Time Filter
      let timeMatch = true;
      if (timeFilter !== 'all') {
        const hours = parseInt(timeFilter);
        const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);
        timeMatch = deadline <= cutoff;
      }

      // Amount Filter
      const remainingNeeded = post.totalAmount - post.contributionAmount;
      const amountMatch = remainingNeeded >= amountFilter[0] && remainingNeeded <= amountFilter[1];

      // Gender Filter
      const genderMatch = genderFilter === 'all' || post.authorGender === genderFilter;

      // Restaurant Filter
      const restaurantMatch = restaurantFilter === '' || post.restaurant.toLowerCase().includes(restaurantFilter.toLowerCase());

      // Institution Filter (now filters on denormalized data)
      const institutionMatch = institutionFilter === '' || post.institutionName?.toLowerCase() === institutionFilter.toLowerCase();
      
      return statusMatch && timeMatch && amountMatch && genderMatch && restaurantMatch && institutionMatch;
    });
  }, [posts, statusFilter, timeFilter, amountFilter, genderFilter, restaurantFilter, institutionFilter]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const locationName = user?.institution?.institutionName || user?.location?.area || user?.location?.city || 'your area';

  const resetFilters = () => {
    setStatusFilter('recent');
    setTimeFilter('all');
    setAmountFilter([0, 10000]);
    setGenderFilter('all');
    setRestaurantFilter('');
    setInstitutionFilter('iit-dharwad');
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-8">
      <AboutSection bannerImageUrl={bannerImageUrl} />
      
      <div id="active-orders" className="scroll-mt-20 container mx-auto px-4">
        <div className="mb-6">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
              <PostFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                amountFilter={amountFilter}
                setAmountFilter={setAmountFilter}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                restaurantFilter={restaurantFilter}
                setRestaurantFilter={setRestaurantFilter}
                institutionFilter={institutionFilter}
                setInstitutionFilter={setInstitutionFilter}
                onReset={resetFilters}
              />
          </aside>

          <div className="lg:col-span-3">
            {paginatedPosts.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {paginatedPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
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
              <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card h-full flex flex-col justify-center">
                <div className="flex justify-center mb-4">
                  <img src="/images/empty-state.svg" alt="No Orders" className="w-48 h-48"/>
                </div>
                <h2 className="text-2xl font-headline text-primary">
                  No Matching Orders Found
                </h2>
                <p className="text-muted-foreground mt-2 mb-4">
                  Try adjusting or clearing your filters to see more results.
                </p>
                 <Button variant="outline" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
