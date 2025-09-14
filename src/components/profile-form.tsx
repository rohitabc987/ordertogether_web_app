'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/types';
import { useEffect } from 'react';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.includes('success') ? 'Success' : 'Error',
        description: state.message,
        variant: state.message.includes('success') ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={user.id} />
      <Card>
        <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={user.contact.phone} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" name="whatsapp" defaultValue={user.contact.whatsapp} required />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>This helps you see orders from people nearby.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="hostel">Hostel / PG Name</Label>
                    <Input id="hostel" name="hostel" defaultValue={user.location.hostel} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="society">Society / Area</Label>
                    <Input id="society" name="society" defaultValue={user.location.society} required />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
