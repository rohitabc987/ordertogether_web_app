
'use client';

import { useState, useRef, useTransition, useContext, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Phone, MessageSquare, Info, ChevronDown, User as UserIcon, Mail, Utensils, ShieldOff } from 'lucide-react';
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
import { deactivateSinglePostPassAction, startOrGetChatAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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

const getRestaurantEmoji = (name: string): string => {
  const lowerCaseName = name.toLowerCase();

  // Food Delivery Apps (unique)
  if (lowerCaseName.includes('zomato')) return '🍔';
  if (lowerCaseName.includes('swiggy')) return '🥘';
  if (lowerCaseName.includes('ubereats') || lowerCaseName.includes('uber eats')) return '🥗';
  if (lowerCaseName.includes('blinkit')) return '🛒';
  if (lowerCaseName.includes('dunzo')) return '📦';

  // Pizza Chains
  if (lowerCaseName.includes('domino')) return '🍕';
  if (lowerCaseName.includes('pizza hut')) return '🍕🔥';
  if (lowerCaseName.includes('pizzahut')) return '🍕🔥';

  // Burgers & Fast Food
  if (lowerCaseName.includes('mcdonald')) return '🍟';
  if (lowerCaseName.includes('kfc')) return '🍗';
  if (lowerCaseName.includes('burger king')) return '👑🍔';

  // Coffee & Cafes
  if (lowerCaseName.includes('starbucks')) return '🧋';
  if (lowerCaseName.includes('cafe')) return '☕';

  // E-commerce / Grocery
  if (lowerCaseName.includes('amazon')) return '📦';
  if (lowerCaseName.includes('flipkart')) return '🛍️';
  if (lowerCaseName.includes('jiomart')) return '🛒';
  if (lowerCaseName.includes('meesho')) return '🎀';

  // Travel / Ride-sharing
  if (lowerCaseName.includes('ola')) return '🚖';
  if (lowerCaseName.includes('uber')) return '🚕';
  if (lowerCaseName.includes('rapido')) return '🏍️';
  if (lowerCaseName.includes('redbus')) return '🚌';
  if (lowerCaseName.includes('makemytrip')) return '✈️';

  // Dessert / Ice Cream (bonus example)
  if (lowerCaseName.includes('cream') || lowerCaseName.includes('icecream')) return '🍦';

  // Fallback (generic restaurant)
  return '🍽️';
};

export function PostCard({ post, index }: { post: Post; index: number }) {
  const { user } = useAuth();
  const { trackViewedPost } = useContext(PostViewContext);
  const [isContactPending, startContactTransition] = useTransition();
  const [isChatPending, startChatTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrompt, setShowPrompt] = useState<'login' | 'subscribe' | 'limit-reached' | null>(null);
  const [catchyTitle, setCatchyTitle] = useState(post.details?.title || "Group Order");
  const router = useRouter();
  const { toast } = useToast();

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


  const handleToggleContact = () => {
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
      startContactTransition(async () => {
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

  const handleStartChat = () => {
     if (!user) {
      setShowPrompt('login');
      return;
    }
    if (deadlineInPast) {
      toast({ title: 'This order has expired and chat is disabled.', variant: 'destructive' });
      return;
    }
    
    startChatTransition(async () => {
      const result = await startOrGetChatAction(user.id, post.authorId, post.id, catchyTitle);
      if (result.success && result.chatId) {
        router.push(`/chat/${result.chatId}`);
      } else {
        toast({ title: 'Could not start chat.', description: result.message, variant: 'destructive' });
      }
    });
  }

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
              <span className="text-lg">{getRestaurantEmoji(post.details.restaurant)}</span>
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

       <div className="flex justify-start gap-2">
        <Button 
            size="sm"
            onClick={handleStartChat} 
            disabled={deadlineInPast || isChatPending}
            className="transition-transform duration-300 hover:scale-105"
          >
            {isChatPending ? 'Starting...' : deadlineInPast ? 'Expired' : 'Chat to Join'}
            {!deadlineInPast && !isChatPending && <MessageSquare className="w-4 h-4 ml-1" />}
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={handleToggleContact} 
            disabled={deadlineInPast || isContactPending}
            className="transition-transform duration-300 hover:scale-105"
          >
            {isContactPending ? '...' : 'View Contact'}
            <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isExpanded && "rotate-180")} />
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
                  You must log in to view contact details or start a chat.
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
