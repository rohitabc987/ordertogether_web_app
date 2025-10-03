'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Edit,
  Trash2,
  Info,
} from 'lucide-react';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { formatDistanceToNow, differenceInSeconds, differenceInMinutes } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { deletePostAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
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
import { Progress } from './ui/progress';

function hasBeenEdited(createdAt: string, updatedAt?: string): boolean {
  if (!updatedAt) return false;
  const created = new Date(createdAt);
  const updated = new Date(updatedAt);
  // Consider edited if updated more than 2 seconds after creation
  return differenceInSeconds(updated, created) > 2;
}

export function MyPostCard({ post, onDelete }: { post: Post; onDelete: (postId: string) => void; }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();

  const deadline = new Date(post.timestamps.deadline);
  const isExpired = deadline < new Date();
  const wasEdited = hasBeenEdited(post.timestamps.createdAt, post.timestamps.updatedAt);
  const canEdit = !isExpired && !wasEdited;

  const handleDelete = () => {
    startTransition(async () => {
      if (!user) return;
      const result = await deletePostAction(post.id, user.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        // Update local cache
        try {
          const cachedPostsRaw = localStorage.getItem(`myPosts_${user.id}`);
          let cachedPosts: Post[] = cachedPostsRaw ? JSON.parse(cachedPostsRaw) : [];
          cachedPosts = cachedPosts.filter(p => p.id !== post.id);
          localStorage.setItem(`myPosts_${user.id}`, JSON.stringify(cachedPosts));
        } catch(e) {
          console.warn("Could not update cache on post delete", e);
        }
        onDelete(post.id); // Trigger callback to update UI state
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };
  
  const getDeadlineText = () => {
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

  const progressPercentage = (post.order.contributionAmount / post.order.totalAmount) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{post.details.title}</CardTitle>
        <CardDescription>From: {post.details.restaurant}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{formatCurrency(post.order.contributionAmount)}</span>
                <span>{formatCurrency(post.order.totalAmount)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-secondary" />
            <div className="flex justify-between items-center text-sm font-medium">
                <span>Your Contribution</span>
                <span>Total Needed</span>
            </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>Deadline: {getDeadlineText()}</span>
        </div>
        {wasEdited && (
           <div className="flex items-center text-sm text-amber-600 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <Info className="w-4 h-4 mr-2" />
            <span>This post has been edited once.</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline" disabled={!canEdit}>
          <Link href={`/edit-post/${post.id}`}>
            <Edit /> Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              <Trash2 /> {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post and remove it from our servers.
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
