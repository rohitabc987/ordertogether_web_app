
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { submitFeedbackAction } from '@/lib/actions';
import { useAuth } from '@/providers';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [state, formAction] = useActionState(submitFeedbackAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Give Feedback</CardTitle>
          <CardDescription>
            Your feedback is valuable to us. Let us know how we can improve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
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
            
            {state?.message && (
              <p className={state.success ? 'text-sm text-green-600' : 'text-sm text-destructive'}>
                {state.message}
              </p>
            )}

            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
