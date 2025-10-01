


'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createPostAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Post } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Info, CheckCircle2 } from 'lucide-react';
import { generateCatchyTitle } from '@/lib/utils';

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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [formData, setFormData] = useState({
    details: {
      title: '',
      restaurant: '',
      notes: ''
    },
    order: {
      totalAmount: '',
      contributionAmount: '',
    },
    timestamps: {
      deadline: '',
    }
  });

  const [generatedTitle, setGeneratedTitle] = useState('Group order');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    setFormData(prev => ({
      ...prev,
      [section]: {
        // @ts-ignore
        ...prev[section],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (!state?.message) return;

    if (state.message.includes('successfully')) {
      setShowSuccessDialog(true);
    } else {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
        setShowSuccessDialog(false);
        formRef.current?.reset();
        setFormData({
            details: { title: '', restaurant: '', notes: '' },
            order: { totalAmount: '', contributionAmount: '' },
            timestamps: { deadline: '' },
        });
    }
  }

  useEffect(() => {
    const deadlineStr = formData.timestamps.deadline;
    let formattedDeadline = '';

    if (deadlineStr) {
      const date = new Date(deadlineStr);

      if (!isNaN(date.getTime())) {
        const datePart = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const timePart = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        
        const offset = -date.getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const timezonePart = `UTC${sign}${String(offsetMinutes).padStart(2, '0')}`;

        formattedDeadline = `${datePart} at ${timePart} ${timezonePart}`;
      }
    }

    const partialPost: Partial<Post> = {
      details: {
        title: formData.details.title,
        restaurant: formData.details.restaurant,
        notes: formData.details.notes
      },
      order: {
        totalAmount: parseFloat(formData.order.totalAmount) || 0,
        contributionAmount: parseFloat(formData.order.contributionAmount) || 0,
      },
      timestamps: {
        createdAt: new Date().toISOString(),
        deadline: formattedDeadline,
      }
    };
    setGeneratedTitle(generateCatchyTitle(partialPost));
  }, [
    formData.details.title,
    formData.details.restaurant,
    formData.details.notes,
    formData.order.totalAmount,
    formData.order.contributionAmount,
    formData.timestamps.deadline
  ]);

  return (
      <>
    <Card className="w-full max-w-2xl mx-auto border-2 border-teal-100 shadow-lg">
      <CardHeader className="text-center bg-teal-50 rounded-t-lg p-6">
        <CardTitle className="text-3xl font-headline text-teal-800">🎉 Create a New Order Post</CardTitle>
        <CardDescription className="text-teal-600">Let others in your building know you're ordering.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="authorId" value={user.id} />

          <div className="space-y-2">
            <Label htmlFor="title">Post Title / Main Discount</Label>
            <Input
              id="title"
              name="details.title"
              placeholder="e.g. ₹100 Off, Free Delivery, BOGO"
              required
              value={formData.details.title}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">This helps auto-generate a better title for your post.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant">Restaurant</Label>
              <Input
                id="restaurant"
                name="details.restaurant"
                placeholder="e.g. Domino's, Zomato, Swiggy"
                required
                value={formData.details.restaurant}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Order Deadline</Label>
              <Input
                id="deadline"
                name="timestamps.deadline"
                type="datetime-local"
                required
                value={formData.timestamps.deadline}
                onChange={handleInputChange}
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
                placeholder="e.g. 399"
                required
                min="0"
                value={formData.order.totalAmount}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Your Contribution (₹)</Label>
              <Input
                id="contributionAmount"
                name="order.contributionAmount"
                type="number"
                placeholder="e.g. 250"
                required
                min="0"
                value={formData.order.contributionAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="details.notes"
              placeholder="e.g. Only veg allowed, I'm ordering a Medium Pizza"
              value={formData.details.notes}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Share what you are ordering, any special instructions, or how to coordinate.
            </p>
          </div>

          <div className="space-y-4">
            <Label>Title Preview of your Post</Label>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center gap-4">
                <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800">{generatedTitle}</p>
                  <p className="text-sm text-amber-700">
                    This is how your post title will appear on the dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
    
    <Dialog open={showSuccessDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
            <DialogHeader className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Post Created Successfully!</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    Your group order has been posted. You can manage it in the 'My Posts' section of your profile.
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-around p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                <Button variant="outline" className="w-full mr-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                </Button>
                <Button className="w-full ml-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/profile')}>
                    View My Posts
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
