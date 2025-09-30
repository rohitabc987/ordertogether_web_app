
'use client';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating Post...' : 'Create Post'}
    </Button>
  );
}

export function CreatePostForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(createPostAction, null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    restaurant: '',
    totalAmount: '',
    contributionAmount: '',
    deadline: '',
    notes: ''
  });

  const [generatedTitle, setGeneratedTitle] = useState('Group order');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.includes('success') ? 'Success' : 'Error',
        description: state.message,
        variant: state.message.includes('success') ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  useEffect(() => {
    const { title, restaurant } = formData;
    if (title && restaurant) {
      setGeneratedTitle(`${title} at ${restaurant}`);
    } else if (title) {
      setGeneratedTitle(title);
    } else if (restaurant) {
      setGeneratedTitle(`Group order at ${restaurant}`);
    } else {
      setGeneratedTitle('Group order');
    }
  }, [formData.title, formData.restaurant]);

    return (
        <Card className="w-full max-w-2xl mx-auto border-2 border-teal-100 shadow-lg"> 
          <CardHeader className="text-center bg-teal-50 rounded-t-lg p-6">
            <CardTitle className="text-3xl font-headline text-teal-800">🎉 Create a New Order Post</CardTitle>
            <CardDescription className="text-teal-600">Let others in your building know you're ordering.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
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
                 <p className="text-xs text-muted-foreground">This helps auto-generate a better title for your post.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurant">Restaurant</Label>
                  <Input 
                    id="restaurant" 
                    name="restaurant"
                    placeholder="e.g. Domino's, McDonald's"
                    required 
                    value={formData.restaurant}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline">Order Deadline</Label>
                    <Input 
                        id="deadline" 
                        name="deadline" 
                        type="datetime-local" 
                        required 
                        value={formData.deadline}
                        onChange={handleInputChange}
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Order Amount (₹)</Label>
                  <Input 
                    id="totalAmount" 
                    name="totalAmount" 
                    type="number" 
                    placeholder="e.g. 1000"
                    required 
                    min="0"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Contribution (₹)</Label>
                  <Input _id="contributionAmount" 
                    name="contributionAmount"
                    type="number" 
                    placeholder="e.g. 250"
                    required 
                    min="0"
                    value={formData.contributionAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  placeholder="e.g. I'm ordering a Medium Pizza. Join in to save on delivery!"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Share what you are ordering, any special instructions, or how to coordinate.
                </p>
              </div>
              
              <div className="space-y-2 mt-6">
                  <Label>Title Preview</Label>
                  <div className="p-4 border rounded-md bg-muted text-muted-foreground">
                      <p className="font-semibold text-lg">{generatedTitle}</p>
                  </div>
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
    );
  }
