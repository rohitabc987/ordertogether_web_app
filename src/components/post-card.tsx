

'use client';

import { useState, useRef, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Phone, MessageSquare, Info, ChevronDown, User as UserIcon, Mail, Utensils } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
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


const RestaurantIcon = ({ name }: { name: string }) => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes('zomato')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.2311 3.52222C11.3911 2.52222 9.79111 2.52222 8.95111 3.52222C8.11111 4.52222 8.11111 6.12222 8.95111 7.12222C9.79111 8.12222 11.3911 8.12222 12.2311 7.12222C13.0711 6.12222 13.0711 4.52222 12.2311 3.52222ZM17.16 3.5C16.32 2.5 14.72 2.5 13.88 3.5C13.04 4.5 13.04 6.1 13.88 7.1C14.72 8.1 16.32 8.1 17.16 7.1C18 6.1 18 4.5 17.16 3.5ZM17.2 9.54C16.5 9.17 15.65 9.32 15.06 9.91L12.56 12.41C11.97 13 11.02 12.85 10.65 12.15L8.2 8.01999C7.83 7.31999 6.86 7.02999 6.07 7.42999C4.48 8.22999 4.34 10.51 5.72 11.89L9.34 15.51C10.15 16.32 10.02 17.65 9.10 18.3L7.33 19.6C6.70 20.04 6.86 21.01 7.55 21.25C13.29 23.23 18.38 18.2 20.43 12.3C20.68 11.61 19.72 11.16 19.29 11.79L17.52 13.56C16.87 14.21 15.77 14.13 15.22 13.38L16.27 11.04C16.82 10.29 17.92 9.91 17.2 9.54Z" fill="#E23744"/>
      </svg>
    );
  }
  if (lowerCaseName.includes('swiggy')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#FC8019"/>
        <path d="M15.89 10.76C15.61 10.23 15.14 9.87 14.58 9.75C14.02 9.63 13.43 9.76 12.97 10.10L11.31 11.45C10.95 11.73 10.46 11.79 10.04 11.60C9.62 11.41 9.31 11.01 9.24 10.55L8.93 8.35C8.84 7.78 8.32 7.35 7.75 7.44C7.18 7.53 6.75 8.05 6.84 8.62L7.33 12.27C7.45 13.06 8.01 13.72 8.75 13.97C9.49 14.22 10.28 14.02 10.84 13.49L12.50 12.14C12.86 11.86 13.35 11.80 13.77 11.99C14.19 12.18 14.50 12.58 14.57 13.04L14.88 15.24C14.97 15.81 15.49 16.24 16.06 16.15C16.63 16.06 17.06 15.54 16.97 14.97L16.48 11.32C16.36 10.53 15.89 10.76 15.89 10.76Z" fill="#FC8019"/>
      </svg>
    );
  }
  return <Utensils className="w-4 h-4" />;
};

export function PostCard({ post, index }: { post: Post; index: number }) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrompt, setShowPrompt] = useState<'login' | 'subscribe' | null>(null);

  const deadline = post.deadline ? new Date(post.deadline) : null;
  const deadlineInPast = deadline ? deadline < new Date() : true;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });

  const animateClass = isInView
    ? 'scale-100 opacity-100'
    : 'scale-0 opacity-0';

  if (!post.author) {
    return null;
  }

  // Use denormalized name for the main card for performance.
  const authorInitials = (post.authorName || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const remainingNeeded = post.totalAmount - post.contributionAmount;
  const progressPercentage = (post.contributionAmount / post.totalAmount) * 100;

  const allNotes = [post.title, post.notes].filter(Boolean).join(' - ');

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
    
    // If the user has a single-post plan, deactivate it after use.
    if (subscription.plan === 'single-post') {
      startTransition(async () => {
        await deactivateSinglePostPassAction(user.id);
      });
    }

    setIsExpanded(true);
  };

  const closePrompt = () => {
    setShowPrompt(null);
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={cn(
        "bg-card/70 backdrop-blur-sm border rounded-lg overflow-hidden shadow-sm p-4 space-y-4",
        "transition-all duration-500 ease-out transform-gpu origin-center",
        animateClass,
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
              <p className="font-semibold text-base text-primary">Save {formatCurrency(remainingNeeded)} with a group order!</p>
              <p className="text-sm text-muted-foreground">(Min Order: {formatCurrency(post.totalAmount)})</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
                <Badge variant="outline" className="capitalize">
                  <UserIcon className="w-3 h-3 mr-1" />
                  {post.authorGender}
              </Badge>
              <p className="text-sm text-muted-foreground truncate">Contributing: {formatCurrency(post.contributionAmount)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground text-right flex-shrink-0">
          <div className="flex items-center gap-1.5">
              <RestaurantIcon name={post.restaurant} />
              <span className="font-medium truncate">{post.restaurant}</span>
          </div>
          <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{deadline ? formatDistanceToNow(deadline, { addSuffix: true }) : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{formatCurrency(post.contributionAmount)}</span>
              <span>{formatCurrency(post.totalAmount)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {allNotes && <p className="text-sm border-l-2 border-accent pl-3 mt-2 py-1 bg-background rounded-r-md flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-accent"/><span>{allNotes}</span></p>}
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
      
      {isExpanded && (
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
                    {post.author.contact.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${post.author.contact.phone}`} className="hover:underline">{post.author.contact.phone}</a>
                      </div>
                    )}
                  </div>
                    {post.author.contact.phone && (
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    