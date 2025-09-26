'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Home, Phone, MessageSquare } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const isSubscribed = user?.subscription?.status === 'active';

  // Guard against invalid deadline
  const deadline = post.deadline ? new Date(post.deadline) : null;
  const deadlineInPast = deadline ? deadline < new Date() : true;
  const authorName = post.authorName || 'Anonymous';

  const locationParts = [];
  if (post.institutionType === 'College/University') {
    if (post.institutionName) locationParts.push(post.institutionName);
  } else {
    if (post.hostelOrPG) locationParts.push(post.hostelOrPG);
    if (post.area) locationParts.push(post.area);
  }
  if (post.city) locationParts.push(post.city);
  const locationString = locationParts.filter(Boolean).join(', ');
  
  // Safely generate author initials
  const authorInitials = authorName.split(' ').map(n => n[0]).join('');

  return (
    <Card className="flex flex-col bg-card/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:border-purple-400/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl font-headline break-words text-white">{post.restaurant || 'N/A'}</CardTitle>
                    <CardDescription className="flex items-center pt-1 text-gray-400">
                        {authorName}
                    </CardDescription>
                </div>
            </div>
            <Badge 
              variant={deadlineInPast ? "destructive" : "outline"}
              className={deadlineInPast ? "" : "border-teal-400 text-teal-400"}
            >
             {deadlineInPast ? 'Expired' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 text-gray-300">
        <div className="text-2xl font-bold bg-brand-gradient text-transparent bg-clip-text">
          {formatCurrency(post.minAmount)} - {formatCurrency(post.maxAmount)}
        </div>
        
        {post.notes && <p className="text-sm border-l-2 border-purple-400/50 pl-3 py-1 bg-black/20 rounded-r-md">{post.notes}</p>}

        <div className="space-y-2 text-sm">
            {deadline && (
              <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>Deadline: <span className="font-semibold text-white">{formatDistanceToNow(deadline, { addSuffix: true })}</span></span>
              </div>
            )}
            {locationString && (
              <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-teal-400" />
                  <span>{locationString}</span>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
                className="w-full bg-brand-gradient text-white font-bold transition-all duration-300 hover:shadow-[0_0_20px_#800080] disabled:opacity-50" 
                disabled={deadlineInPast || !user}
            >
                Join Order
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900/80 backdrop-blur-sm border-purple-500/50 text-white">
            {isSubscribed ? (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-headline bg-brand-gradient text-transparent bg-clip-text">Contact {authorName}</DialogTitle>
                        <DialogDescription className="text-gray-400">Please be respectful when contacting the poster to join their group order.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {post.contactNumber && (
                          <>
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-black/30">
                                <Phone className="w-6 h-6 text-teal-400" />
                                <a href={`tel:${post.contactNumber}`} className="font-mono text-lg tracking-wider">{post.contactNumber}</a>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-black/30">
                                <MessageSquare className="w-6 h-6 text-teal-400" />
                                <a href={`https://wa.me/${post.contactNumber}`} target="_blank" rel="noopener noreferrer" className="font-mono text-lg tracking-wider">WhatsApp</a>
                            </div>
                          </>
                        )}
                    </div>
                </>
            ) : (
                 <DialogHeader>
                    <DialogTitle className="text-2xl font-headline bg-brand-gradient text-transparent bg-clip-text">Subscribe to Join</DialogTitle>
                    <DialogDescription className="text-gray-400 pt-2">
                        You need to be a subscriber to view contact details and join orders.
                    </DialogDescription>
                     <Button asChild className="mt-4 bg-brand-gradient text-white font-bold">
                        <Link href="/pricing">View Pricing</Link>
                    </Button>
                </DialogHeader>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
