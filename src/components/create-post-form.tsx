'use client';

import { useActionState, useState } from 'react';
import { createPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '@/lib/utils';

export function CreatePostForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(createPostAction, null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [contributionAmount, setContributionAmount] = useState(0);

  const remainingNeeded = Math.max(0, totalAmount - contributionAmount);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create a New Order Post</CardTitle>
        <CardDescription>Let others in your building know you're ordering.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="authorId" value={user.id} />
          <input type="hidden" name="authorName" value={user.userProfile?.name || ''} />
          <input type="hidden" name="contactNumber" value={user.contact?.phone || ''} />
          <input type="hidden" name="institutionType" value={user.institution?.institutionType || ''} />
          <input type="hidden" name="institutionName" value={user.institution?.institutionName || ''} />
          <input type="hidden" name="area" value={user.location?.area || ''} />
          <input type="hidden" name="city" value={user.location?.city || ''} />
          <input type="hidden" name="pinCode" value={user.location?.pinCode || ''} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title"
              placeholder="e.g. Dominos 300 Coupon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant">Delivery App / Restaurant</Label>
            <Input 
              id="restaurant" 
              name="restaurant"
              placeholder="e.g. Dominos"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Minimum Order Amount (₹)</Label>
               <Input id="totalAmount" name="totalAmount" type="number" placeholder="300" required onChange={(e) => setTotalAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Your Contribution Amount (₹)</Label>
               <Input id="contributionAmount" name="contributionAmount" type="number" placeholder="120" required onChange={(e) => setContributionAmount(Number(e.target.value))} />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="remainingNeeded">Remaining Needed (Auto-calculated)</Label>
              <Input id="remainingNeeded" name="remainingNeeded" value={formatCurrency(remainingNeeded)} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="e.g. Only vegetarian options please" />
          </div>
          
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" className="w-full">
            Create Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
