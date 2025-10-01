
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { updatePostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </Button>
  );
}

// Helper to format date string for datetime-local input
const formatForDateTimeLocal = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Adjust for timezone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};


export function EditPostForm({ post }: { post: Post }) {
  const [state, formAction] = useActionState(updatePostAction, null);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
      const isSuccess = state.message.includes('successfully');
      toast({
        title: isSuccess ? 'Success!' : 'Error',
        description: state.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) {
        // Redirect to my-posts page on success
        router.push('/my-posts?message=Post updated successfully!');
      }
    }
  }, [state, toast, router]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Edit Your Post</CardTitle>
        <CardDescription>Make changes to your group order details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="postId" value={post.id} />
          
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
                defaultValue={formatForDateTimeLocal(post.timestamps.deadline)}
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
                placeholder="e.g. 250"
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
            <p className="text-xs text-muted-foreground">
              Share what you are ordering, any special instructions, or how to coordinate.
            </p>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
