'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Home, Building, User, Phone, MessageSquare } from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const isSubscribed = user?.subscription?.status === 'active';

  const deadlineInPast = new Date(post.deadline) < new Date();
  
  return (
    <Card className="flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline break-words">{post.restaurant}</CardTitle>
          <Badge variant={deadlineInPast ? "destructive" : "secondary"}>
             {deadlineInPast ? 'Expired' : 'Active'}
          </Badge>
        </div>
        <CardDescription className="flex items-center pt-1">
          <User className="w-4 h-4 mr-2" />
          Posted by {post.authorName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-lg font-semibold text-primary">
          {formatCurrency(post.minAmount)} - {formatCurrency(post.maxAmount)}
        </div>
        <p className="text-sm text-muted-foreground">{post.notes}</p>
        <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Deadline: {formatDistanceToNow(new Date(post.deadline), { addSuffix: true })}
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
            <Home className="w-4 h-4 mr-2" />
            {post.location.hostel}, {post.location.society}
        </div>
      </CardContent>
      <CardFooter>
        {isSubscribed ? (
           <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={deadlineInPast}>View Contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Details for {post.authorName}</DialogTitle>
                <DialogDescription>Please be respectful when contacting the poster.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${post.contact.phone}`} className="font-mono text-lg">{post.contact.phone}</a>
                </div>
                <div className="flex items-center gap-4">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <a href={`https://wa.me/${post.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-mono text-lg">{post.contact.whatsapp}</a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                   <Button className="w-full" disabled>View Contact</Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <Link href="/pricing" className="underline font-semibold">Subscribe</Link> to view contact details.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
