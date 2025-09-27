
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Phone, MessageSquare, Info, ChevronDown, User as UserIcon } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const isSubscribed = user?.subscription?.status === 'active';

  const deadline = post.deadline ? new Date(post.deadline) : null;
  const deadlineInPast = deadline ? deadline < new Date() : true;
  const authorName = post.authorName || 'Anonymous';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('');

  const remainingNeeded = post.totalAmount - post.contributionAmount;

  const toggleExpand = () => {
    if (!deadlineInPast && user) {
      setIsExpanded(!isExpanded);
    } else if (!user) {
      // Potentially redirect to login or show a message
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border rounded-lg overflow-hidden shadow-sm transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-base text-primary">Save {formatCurrency(remainingNeeded)} on {post.restaurant}</p>
              <p className="text-sm text-muted-foreground truncate">{post.title}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">
                <UserIcon className="w-3 h-3 mr-1" />
                {post.gender}
            </Badge>
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{deadline ? formatDistanceToNow(deadline, { addSuffix: true }) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button 
              size="sm"
              onClick={toggleExpand} 
              disabled={deadlineInPast || !user}
              className="transition-transform duration-300"
            >
              Join
              <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isExpanded && "rotate-180")} />
            </Button>
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4 border-t mt-2 pt-4">
          {isSubscribed ? (
            <div>
              <h4 className="font-semibold mb-3">Contact {authorName} to Coordinate</h4>
              <div className="space-y-3 text-sm">
                {post.contact?.phone && (
                  <>
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                        <Phone className="w-4 h-4 text-primary" />
                        <a href={`tel:${post.contact.phone}`} className="font-mono tracking-wider">{post.contact.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <a href={`https://wa.me/${post.contact.phone}`} target="_blank" rel="noopener noreferrer" className="font-mono tracking-wider">WhatsApp</a>
                    </div>
                  </>
                )}
                {post.notes && <p className="text-sm border-l-2 border-accent pl-3 mt-3 py-1 bg-background rounded-r-md flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-accent"/><span>{post.notes}</span></p>}
              </div>
            </div>
          ) : (
             <div className="text-center">
                <h4 className="font-semibold">Subscribe to Join Orders</h4>
                <p className="text-muted-foreground text-sm mt-1 mb-3">
                    You need an active subscription to view contact details.
                </p>
                 <Button asChild size="sm">
                    <Link href="/pricing">View Plans</Link>
                </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
