'use client';

import { useState } from 'react';
import { Clock, Info, Utensils, Edit, Trash2, AlertTriangle } from 'lucide-react';
import type { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { deletePostAction } from '@/lib/actions';
import { useTransition } from 'react';
import { Modal } from './ui/modal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


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


export function MyPostCard({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const remainingNeeded = post.totalAmount - post.contributionAmount;
  const progressPercentage = (post.contributionAmount / post.totalAmount) * 100;
  const deadline = post.deadline ? new Date(post.deadline) : null;
  const allNotes = [post.title, post.notes].filter(Boolean).join(' - ');
  const hasBeenUpdated = !!post.updatedAt;

  const handleDelete = () => {
    startTransition(() => {
      deletePostAction(post.id);
      setShowDeleteConfirm(false);
    });
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm p-4 space-y-4 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-primary truncate">
             {post.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <Badge variant={hasBeenUpdated ? "secondary" : "outline"}>
              {hasBeenUpdated ? "Updated" : "Not updated"}
            </Badge>
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

      <div className="space-y-2 flex-grow">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{formatCurrency(post.contributionAmount)}</span>
              <span>{formatCurrency(post.totalAmount)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {allNotes && <p className="text-sm border-l-2 border-accent pl-3 mt-2 py-1 bg-background rounded-r-md flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-accent"/><span>{allNotes}</span></p>}
      </div>
      
      <div className="border-t pt-4 flex justify-end items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div tabIndex={0}> 
                        <Button asChild variant="outline" size="icon" disabled={hasBeenUpdated}>
                            <Link href={hasBeenUpdated ? '#' : `/edit-post/${post.id}`} aria-disabled={hasBeenUpdated}>
                                <Edit className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </TooltipTrigger>
                {hasBeenUpdated && (
                    <TooltipContent>
                        <p>This post has already been updated once.</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>

        <Button variant="destructive" size="icon" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4" />
        </Button>
      </div>

       {showDeleteConfirm && (
        <Modal open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <div className="text-center p-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Delete Post</h3>
            <p className="mb-6 mt-2 text-muted-foreground">
                Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
                 <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                    {isPending ? "Deleting..." : "Delete"}
                </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
