
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { submitFeedbackAction } from '@/lib/actions';
import { useAuth } from '@/providers';
import { CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [state, formAction] = useActionState(submitFeedbackAction, null);

  return (
    <div className="container mx-auto px-4 py-12">
      {state?.success ? (
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
             <div className="mx-auto bg-green-100 p-4 rounded-full w-fit dark:bg-green-900/50">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-headline">Thank You!</CardTitle>
            <CardDescription>
              {state.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
                We appreciate you taking the time to share your thoughts. Your input helps us improve OrderlyGather for everyone.
            </p>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Give Feedback</CardTitle>
            <CardDescription>
              Your feedback is valuable to us. Let us know how we can improve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              {user ? (
                <input type="hidden" name="email" value={user.contact.email} />
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email (Optional)</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea id="feedback" name="feedback" placeholder="Tell us what you think..." rows={5} required />
              </div>
              
              {state?.message && !state.success && (
                <p className='text-sm text-destructive'>
                  {state.message}
                </p>
              )}

              <Button type="submit" className="w-full">Submit Feedback</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
