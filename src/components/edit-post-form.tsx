'use client';

import { useActionState, useState } from 'react';
import { updatePostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function EditPostForm({ post }: { post: Post }) {
  const [state, formAction] = useActionState(updatePostAction, null);
  const [totalAmount, setTotalAmount] = useState(post.totalAmount);
  const [contributionAmount, setContributionAmount] = useState(post.contributionAmount);
  const [showOneTimeUpdateAlert, setShowOneTimeUpdateAlert] = useState(true);

  const remainingNeeded = Math.max(0, totalAmount - contributionAmount);
  
  // Format deadline for datetime-local input. Handles timezone offset.
  const deadlineForInput = post.deadline 
    ? new Date(post.deadline.getTime() - (post.deadline.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    : '';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Edit Order Post</CardTitle>
        <CardDescription>Update the details of your group order.</CardDescription>
      </CardHeader>
      <CardContent>
        {showOneTimeUpdateAlert && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-700 dark:text-yellow-300">One-Time Update Only</AlertTitle>
            <AlertDescription className="text-yellow-600 dark:text-yellow-500">
              You can only update your post once. Please double-check all details before saving.
            </Description>
          </Alert>
        )}
        <form 
          action={formAction} 
          className="space-y-6"
          onChange={() => showOneTimeUpdateAlert && setShowOneTimeUpdateAlert(false)}
        >
          <input type="hidden" name="postId" value={post.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title"
              defaultValue={post.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant">Delivery App / Restaurant Name</Label>
            <Input 
              id="restaurant" 
              name="restaurant"
              defaultValue={post.restaurant}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Minimum Order Amount (₹)</Label>
               <Input id="totalAmount" name="totalAmount" type="number" defaultValue={post.totalAmount} required onChange={(e) => setTotalAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Your Order Amount (₹)</Label>
               <Input id="contributionAmount" name="contributionAmount" type="number" defaultValue={post.contributionAmount} required onChange={(e) => setContributionAmount(Number(e.target.value))} />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="remainingNeeded">Remaining Needed (Auto-calculated)</Label>
              <Input id="remainingNeeded" name="remainingNeeded" value={formatCurrency(remainingNeeded)} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="datetime-local" defaultValue={deadlineForInput} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" defaultValue={post.notes || ''} />
          </div>
          
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}