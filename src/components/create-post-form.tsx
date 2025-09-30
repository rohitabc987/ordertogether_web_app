
'use client';

import { useActionState, useState, useMemo } from 'react';
import { createPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, generateCatchyTitle } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export function CreatePostForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(createPostAction, null);
  const [formData, setFormData] = useState({
    title: '',
    restaurant: '',
    totalAmount: 0,
    contributionAmount: 0,
    deadline: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' || name === 'contributionAmount' ? Number(value) : value
    }));
  };

  const remainingNeeded = useMemo(() => Math.max(0, formData.totalAmount - formData.contributionAmount), [formData.totalAmount, formData.contributionAmount]);

  const catchyTitlePreview = useMemo(() => {
    return generateCatchyTitle({
      title: formData.title,
      restaurant: formData.restaurant,
      totalAmount: formData.totalAmount,
      contributionAmount: formData.contributionAmount,
      deadline: formData.deadline ? new Date(formData.deadline) : new Date(),
      notes: formData.notes,
    });
  }, [formData]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create a New Order Post</CardTitle>
        <CardDescription>Let others in your building know you're ordering.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="authorId" value={user.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Post Title / Main Discount</Label>
            <Input 
              id="title" 
              name="title"
              placeholder="e.g. ₹100 Off, Free Delivery, BOGO"
              required
              value={formData.title}
              onChange={handleInputChange}
            />
             <p className="text-xs text-muted-foreground">Helps auto-generate a better title for your post</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant">Delivery App / Restaurant Name</Label>
            <Input 
              id="restaurant" 
              name="restaurant"
              placeholder="e.g. Dominos / Zomato / Swiggy"
              required
              value={formData.restaurant}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Minimum Order Amount (₹)</Label>
               <Input id="totalAmount" name="totalAmount" type="number" placeholder="300" required value={formData.totalAmount || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Your Order Amount (₹)</Label>
               <Input id="contributionAmount" name="contributionAmount" type="number" placeholder="120" required value={formData.contributionAmount || ''} onChange={handleInputChange} />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="remainingNeeded">Remaining Needed (Auto-calculated)</Label>
              <Input id="remainingNeeded" name="remainingNeeded" value={formatCurrency(remainingNeeded)} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="datetime-local" required value={formData.deadline} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="e.g. Only vegetarian items" value={formData.notes} onChange={handleInputChange} />
          </div>
          
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          {catchyTitlePreview && (
            <div className="p-3 rounded-lg bg-accent/20 border border-accent/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Title preview for your post</h4>
                  <p className="text-sm text-accent-foreground font-medium">{catchyTitlePreview}</p>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Create Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
