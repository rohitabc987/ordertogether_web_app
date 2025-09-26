
'use client';

import { useActionState, useState } from 'react';
import { createPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function CreatePostForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(createPostAction, null);
  
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
              placeholder="e.g. Late night pizza run"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant">Delivery App / Restaurant</Label>
            <Input 
              id="restaurant" 
              name="restaurant"
              placeholder="e.g. Zomato, Truffles"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Order Amount (₹)</Label>
               <Input id="minAmount" name="minAmount" type="number" defaultValue={200} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Maximum Order Amount (₹)</Label>
               <Input id="maxAmount" name="maxAmount" type="number" defaultValue={500} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="e.g. Only vegetarian options" />
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
