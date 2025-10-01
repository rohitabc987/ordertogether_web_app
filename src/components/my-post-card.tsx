
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Edit, Trash2, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { deletePostAction } from '@/lib/actions';
import { Progress } from './ui/progress';

function convertFirestoreTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) {
    return null;
  }
  // Firestore timestamps are serialized to objects with seconds and nanoseconds
  // when passed from server to client components.
  if (typeof timestamp.seconds === 'number' && typeof timestamp.nanoseconds === 'number') {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  // Fallback for cases where it might be a string (e.g., from `new Date().toISOString()`)
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date;
  }
  return null;
}

export function MyPostCard({ post }: { post: Post }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deadline = convertFirestoreTimestampToDate(post.timestamps?.deadline);
  const deadlineInPast = deadline ? deadline < new Date() : true;
  
  // A post is considered edited only if updatedAt exists and is more than
  // 2 seconds after createdAt to account for creation time.
  const createdAt = convertFirestoreTimestampToDate(post.timestamps?.createdAt);
  const updatedAt = convertFirestoreTimestampToDate(post.timestamps?.updatedAt);
  const hasBeenEdited = createdAt && updatedAt && (updatedAt.getTime() - createdAt.getTime() > 2000);

  const remainingNeeded = post.order.totalAmount - post.order.contributionAmount;
  const progressPercentage = (post.order.contributionAmount / post.order.totalAmount) * 100;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deletePostAction(post.id);
  };
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{post.details.title}</CardTitle>
        <CardDescription>From: {post.details.restaurant}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{formatCurrency(post.order.contributionAmount)} contributed</span>
                <span>{formatCurrency(post.order.totalAmount)} total</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm font-medium text-primary text-center">
              {formatCurrency(remainingNeeded)} needed to complete the order.
            </p>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>Deadline: {deadline ? formatDistanceToNow(deadline, { addSuffix: true }) : 'N/A'}</span>
        </div>
        
        {post.details.notes && <p className="text-sm border-l-2 border-accent pl-3 py-1 bg-background rounded-r-md">{post.details.notes}</p>}

        {hasBeenEdited && (
           <Badge variant="outline" className="flex items-center gap-2">
              <Info className="w-3 h-3"/>
              This post has been edited once and cannot be changed again.
            </Badge>
        )}

      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm" disabled={hasBeenEdited || deadlineInPast}>
            <Link href={`/edit-post/${post.id}`}>
              <Edit />
              Edit
            </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
