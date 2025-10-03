
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { updatePostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Post } from '@/lib/types';
import { useAuth } from '@/providers';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// Helper to format date for datetime-local input
const formatDateForInput = (date: string | { _seconds: number, _nanoseconds: number }) => {
  if (!date) return '';
  
  let dateObj;
  // Check if it's a Firestore-like timestamp object from server-side rendering
  if (typeof date === 'object' && '_seconds' in date) {
    dateObj = new Date(date._seconds * 1000 + date._nanoseconds / 1000000);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '';
  }
  
  if (isNaN(dateObj.getTime())) return '';

  // The 'T' needs to be there, and we slice off the milliseconds and 'Z'
  return dateObj.toISOString().substring(0, 16); 
};


export function EditPostForm({ post }: { post: Post }) {
  const [state, formAction] = useActionState(updatePostAction, null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;

    if (state.success && state.post && user) {
      // Update cache
      try {
        const cachedPostsRaw = localStorage.getItem(`myPosts_${user.id}`);
        const cachedPosts: Post[] = cachedPostsRaw ? JSON.parse(cachedPostsRaw) : [];
        const updatedPosts = cachedPosts.map(p => p.id === state.post.id ? state.post : p);
        localStorage.setItem(`myPosts_${user.id}`, JSON.stringify(updatedPosts));
      } catch (e) {
        console.warn("Could not update cache with edited post", e);
      }

      toast({
        title: 'Success!',
        description: state.message,
      });
      // Redirect to a page that will show the "locked" message
      router.push(`/my-posts?message=Post updated successfully!`);
    } else if (!state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, router, post.id, user]);

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center bg-primary/5 rounded-t-lg p-6">
        <CardTitle className="text-3xl font-headline text-primary">Edit Your Order Post</CardTitle>
        <CardDescription>Update the details of your group order.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="postId" value={post.id} />
          {user && <input type="hidden" name="userId" value={user.id} />}

          <div className="space-y-2">
            <Label htmlFor="title">Post Title / Main Discount</Label>
            <Input
              id="title"
              name="details.title"
              defaultValue={post.details.title}
              placeholder="e.g. ₹100 Off, Free Delivery, BOGO"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant">Restaurant</Label>
              <Input
                id="restaurant"
                name="details.restaurant"
                defaultValue={post.details.restaurant}
                placeholder="e.g. Domino's, Zomato, Swiggy"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Order Deadline</Label>
              <Input
                id="deadline"
                name="timestamps.deadline"
                type="datetime-local"
                defaultValue={formatDateForInput(post.timestamps.deadline)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Order Amount (₹)</Label>
              <Input
                id="totalAmount"
                name="order.totalAmount"
                type="number"
                defaultValue={post.order.totalAmount}
                placeholder="e.g. 399"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Your Contribution (₹)</Label>
              <Input
                id="contributionAmount"
                name="order.contributionAmount"
                type="number"
                defaultValue={post.order.contributionAmount}
                placeholder="e.g. 199"
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="details.notes"
              defaultValue={post.details.notes}
              placeholder="e.g. Only veg allowed, I'm ordering a Medium Pizza"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
