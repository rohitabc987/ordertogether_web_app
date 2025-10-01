
'use client';

import { useState, useRef, useTransition, useContext, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Phone, MessageSquare, Info, ChevronDown, User as UserIcon, Mail, Utensils, ShieldOff, Pizza, Coffee } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth, PostViewContext } from '@/providers';
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns';
import { formatCurrency, generateCatchyTitle } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { useInView } from '@/hooks/use-in-view';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { deactivateSinglePostPassAction } from '@/lib/actions';

function convertFirestoreTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) {
    return null;
  }
  if (typeof timestamp.seconds === 'number' && typeof timestamp.nanoseconds === 'number') {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date;
  }
  return null;
}

const RestaurantIcon = ({ name }: { name: string }) => {
  const lowerCaseName = name.toLowerCase();

  // Food Delivery Apps
  if (['swiggy', 'zomato'].some(keyword => lowerCaseName.includes(keyword))) {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19C16.4696 19 15.9609 18.7893 15.5858 18.4142C15.2107 18.0391 15 17.5304 15 17C15 16.4696 15.2107 15.9609 15.5858 15.5858C15.9609 15.2107 16.4696 15 17 15C17.5304 15 18.0391 15.2107 18.4142 15.5858C18.7893 15.9609 19 16.4696 19 17Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 17C9 17.5304 8.78929 18.0391 8.41421 18.4142C8.03914 18.7893 7.53043 19 7 19C6.46957 19 5.96086 18.7893 5.58579 18.4142C5.21071 18.0391 5 17.5304 5 17C5 16.4696 5.21071 15.9609 5.58579 15.5858C5.96086 15.2107 6.46957 15 7 15C7.53043 15 8.03914 15.2107 8.41421 15.5858C8.78929 15.9609 9 16.4696 9 17Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 17H9.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 12V10H15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 12H19C19.5304 12 20.0391 11.7893 20.4142 11.4142C20.7893 11.0391 21 10.5304 21 10V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H14.5L12.5 8H5C4.46957 8 3.96086 8.21071 3.58579 8.58579C3.21071 8.96086 3 9.46957 3 10V17H5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // Pizza places
  if (['pizza', 'domino\'s', 'pizzahut'].some(keyword => lowerCaseName.includes(keyword))) {
     return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C12 2 8 12 12 12C16 12 12 2 12 2Z" fill="#FBBF24"/>
        <path d="M21.22 10.13C20.93 7.42 18.58 5.07 15.87 4.78C13.16 4.49 10.66 5.86 9.21 8H12L21.22 10.13Z" fill="#FBBF24"/>
        <path d="M2.78 10.13C3.07 7.42 5.42 5.07 8.13 4.78C10.84 4.49 13.34 5.86 14.79 8H12L2.78 10.13Z" fill="#FBBF24"/>
        <path d="M9.21 16C10.66 18.14 13.16 19.51 15.87 19.22C18.58 18.93 20.93 16.58 21.22 13.87H12L9.21 16Z" fill="#FB923C"/>
        <path d="M14.79 16C13.34 18.14 10.84 19.51 8.13 19.22C5.42 18.93 3.07 16.58 2.78 13.87H12L14.79 16Z" fill="#FB923C"/>
        <circle cx="15" cy="11" r="1" fill="#DC2626"/>
        <circle cx="9" cy="11" r="1" fill="#DC2626"/>
        <circle cx="12" cy="15" r="1" fill="#DC2626"/>
      </svg>
    );
  }

  // Fast Food like McD, KFC
  if (['mcdonald\'s', 'kfc'].some(keyword => lowerCaseName.includes(keyword))) {
      return <Utensils className="w-4 h-4 text-red-600" />;
  }
  
  // E-commerce
  if (['amazon', 'flipkart', 'jiomart', 'meesho'].some(keyword => lowerCaseName.includes(keyword))) {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.364 16.9998H5.63604C5.1965 16.9998 4.82176 16.7111 4.72147 16.2828L2.22147 6.28284C2.15541 5.99264 2.22033 5.68884 2.40058 5.46208C2.58083 5.23531 2.85964 5.10913 3.14929 5.10913H20.8507C21.1404 5.10913 21.4192 5.23531 21.5994 5.46208C21.7797 5.68884 21.8446 5.99264 21.7785 6.28284L19.2785 16.2828C19.1782 16.7111 18.8035 16.9998 18.364 16.9998Z" fill="#3B82F6"/>
        <path d="M9 9.99988C9 8.34299 10.3431 6.99988 12 6.99988C13.6569 6.99988 15 8.34299 15 9.99988" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  
  // Travel / Ride-sharing
  if (['uber', 'ola', 'rapido', 'redbus', 'makemytrip'].some(keyword => lowerCaseName.includes(keyword))) {
     return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5C3.89543 17 3 16.1046 3 15V12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12V15C21 16.1046 20.1046 17 19 17Z" fill="#10B981"/>
          <path d="M5 10V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="17" r="2" fill="white"/>
          <circle cx="17" cy="17" r="2" fill="white"/>
        </svg>
     );
  }

  // Coffee shops
  if (lowerCaseName.includes('cafe') || lowerCaseName.includes('starbucks')) {
    return <Coffee className="w-4 h-4 text-amber-800" />;
  }
  
  // Fallback icon
  return <Utensils className="w-4 h-4 text-gray-500" />;
};


export function PostCard({ post, index }: { post: Post; index: number }) {
  const { user } = useAuth();
  const { trackViewedPost } = useContext(PostViewContext);
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrompt, setShowPrompt] = useState<'login' | 'subscribe' | 'limit-reached' | null>(null);
  const [catchyTitle, setCatchyTitle] = useState(post.details?.title || "Group Order");

  const deadline = convertFirestoreTimestampToDate(post.timestamps.deadline);
  const deadlineInPast = deadline ? deadline < new Date() : true;
  const hoursLeft = deadline ? differenceInHours(deadline, new Date()) : null;
  const isUrgent = hoursLeft !== null && hoursLeft <= 6 && !deadlineInPast;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });

  useEffect(() => {
    // Generate the title on the client side after initial render to avoid hydration mismatch
    if (post.details) {
      setCatchyTitle(generateCatchyTitle(post));
    }
  }, [post]);


  const animateClass = isInView
    ? 'scale-100 opacity-100'
    : 'scale-0 opacity-0';

  if (!post.author) {
    return null;
  }

  // Use denormalized name for the main card for performance.
  const authorInitials = (post.authorInfo.authorName || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const progressPercentage = (post.order.contributionAmount / post.order.totalAmount) * 100;

  // Use the live, joined author name for the contact details to ensure it's up-to-date.
  const liveAuthorName = post.author.userProfile.name;
  const liveAuthorInitials = (liveAuthorName || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();


  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (!user) {
      setShowPrompt('login');
      return;
    }
    
    if (deadlineInPast) {
      return;
    }

    const subscription = user.subscription;
    const isSubscribed = subscription?.status === 'active';

    if (!isSubscribed) {
      setShowPrompt('subscribe');
      return;
    }

    // Handle single-post plan logic
    if (subscription.plan === 'single-post') {
      startTransition(async () => {
        const result = await deactivateSinglePostPassAction(user.id);
        if (result.success) {
          trackViewedPost(post.id);
          setIsExpanded(true);
        } else {
          // Handle error if deactivation fails
        }
      });
    } else {
      // For other active plans, just expand and count the view.
      trackViewedPost(post.id);
      setIsExpanded(true);
    }
  };

  const closePrompt = () => {
    setShowPrompt(null);
  };
  
  const getDeadlineText = () => {
    if (!deadline) return 'N/A';
    const now = new Date();
    const minutesLeft = differenceInMinutes(deadline, now);

    if (minutesLeft <= 0) {
      return formatDistanceToNow(deadline, { addSuffix: true });
    }
    if (minutesLeft < 60) {
        return `in ${minutesLeft} min`;
    }
    if (minutesLeft < 6 * 60) {
        const hours = Math.floor(minutesLeft / 60);
        const minutes = minutesLeft % 60;
        return `in ${hours}hr ${minutes}min`;
    }
    return formatDistanceToNow(deadline, { addSuffix: true });
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={cn(
        "bg-card/70 backdrop-blur-sm border rounded-lg overflow-hidden shadow-sm p-4 space-y-4",
        "transition-all duration-500 ease-out transform-gpu origin-center",
        animateClass,
        isUrgent && 'border-destructive/50 ring-2 ring-destructive/20',
        deadlineInPast && 'opacity-60 bg-muted/30'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar>
              <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="font-semibold text-base text-primary">{catchyTitle}</p>
              <p className="text-sm text-muted-foreground">(Min Order: {formatCurrency(post.order.totalAmount)})</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <p className="text-sm text-muted-foreground truncate">Contributing: {formatCurrency(post.order.contributionAmount)} </p>
              {post.authorInfo.gender && (
                 <Badge variant="outline" className="capitalize flex items-center gap-1">
                  <UserIcon className="w-3 h-3" />
                  {post.authorInfo.gender}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground text-right flex-shrink-0">
          <div className="flex items-center gap-1.5">
              <RestaurantIcon name={post.details.restaurant} />
              <span className="font-medium truncate">{post.details.restaurant}</span>
          </div>
           {isUrgent && (
              <Badge variant="destructive" className="text-base">
                Closes {getDeadlineText()} ⏳
              </Badge>
            )}
            {!isUrgent && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span> {getDeadlineText()}</span>
              </div>
            )}
        </div>
      </div>

      <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{formatCurrency(post.order.contributionAmount)}</span>
              <span>{formatCurrency(post.order.totalAmount)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {post.details.notes && <p className="text-sm border-l-2 border-accent pl-3 mt-2 py-1 bg-background rounded-r-md flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-accent"/><span>{post.details.notes}</span></p>}
      </div>

      <div className="flex justify-start">
        <Button 
            size="sm"
            onClick={handleToggle} 
            disabled={deadlineInPast || isPending}
            className="transition-transform duration-300 hover:scale-105"
          >
            {isPending ? 'Processing...' : deadlineInPast ? 'Expired' : 'Join'}
            {!deadlineInPast && !isPending && <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isExpanded && "rotate-180")} />}
          </Button>
      </div>
      
      {isExpanded && post.author && (
        <div className="border-t pt-4">
            <div>
              <h4 className="font-semibold mb-3">Contact {liveAuthorName} to Coordinate</h4>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author.userProfile.photoURL ?? undefined} />
                    <AvatarFallback className="text-2xl">{liveAuthorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow space-y-1 text-sm">
                    <p className="font-bold text-base">{liveAuthorName}</p>
                    {post.author.contact.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${post.author.contact.email}`} className="hover:underline">{post.author.contact.email}</a>
                      </div>
                    )}
                    {post.author.contact.shareContact && post.author.contact.phone ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${post.author.contact.phone}`} className="hover:underline">{post.author.contact.phone}</a>
                        </div>
                    ) : (
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <ShieldOff className="w-4 h-4 text-destructive" />
                          <span>Contact number is private</span>
                        </div>
                    )}
                  </div>
                    {post.author.contact.shareContact && post.author.contact.phone && (
                    <Button asChild variant="ghost" size="icon" className="h-12 w-12 flex-shrink-0">
                      <a href={`https://wa.me/${post.author.contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
                        <MessageSquare className="w-6 h-6 text-green-500" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
        </div>
      )}

      {showPrompt && (
        <Dialog open={!!showPrompt} onOpenChange={(open) => !open && closePrompt()}>
          <DialogContent>
            {showPrompt === 'login' && (
              <div className="text-center p-4">
                <DialogHeader>
                  <DialogTitle className="mb-4">Please Log In</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4">
                  You must log in to view contact details.
                </DialogDescription>
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
            )}
            {showPrompt === 'subscribe' && (
              <div className="text-center p-4">
                <DialogHeader>
                  <DialogTitle className="mb-4">Subscribe to View Details</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4">
                  You need an active subscription to view contact details. For just ₹1, you can view the details of a single post.
                </DialogDescription>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
             {showPrompt === 'limit-reached' && (
              <div className="text-center p-4">
                <DialogHeader>
                  <DialogTitle className="mb-4">Single Post View Used</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4">
                  You have already used your single post view for this subscription. Please subscribe again to see more posts.
                </DialogDescription>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    