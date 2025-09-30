
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Combobox } from './ui/combobox';
import { institutions } from '@/lib/institutions';
import { hostels } from '@/lib/hostels';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save All Changes'}
    </Button>
  );
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor}>
            {children} <span className="text-destructive">*</span>
        </Label>
    );
}

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, null);
  const { toast } = useToast();
  const [institutionType, setInstitutionType] = useState(user.institution?.institutionType || '');
  const [institutionName, setInstitutionName] = useState(user.institution?.institutionName || '');

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.includes('success') ? 'Success' : 'Error',
        description: state.message,
        variant: state.message.includes('success') ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  const institutionOptions = institutionType === 'College/University' ? institutions : hostels;
  const institutionLabel = institutionType === 'College/University' ? 'College/University Name' : 'Hostel/PG/Apartment Name';
  const institutionPlaceholder = institutionType === 'College/University' ? 'Select institution...' : 'Select hostel/PG...';
  const institutionSearchPlaceholder = institutionType === 'College/University' ? 'Search institution...' : 'Search hostel/PG...';

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={user.id} />
      <Card>
        <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal and location details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <RequiredLabel htmlFor="name">Full Name</RequiredLabel>
                <Input id="name" name="name" defaultValue={user.userProfile?.name} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" defaultValue={user.contact?.phone} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="shareContact" name="shareContact" defaultChecked={user.contact?.shareContact ?? true} />
                <Label htmlFor="shareContact" className="cursor-pointer">Share contact publicly</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <RequiredLabel htmlFor="email">Email</RequiredLabel>
                    <Input id="email" name="email" defaultValue={user.contact?.email} readOnly className="bg-muted cursor-not-allowed opacity-50" />
                </div>
                <div className="space-y-2">
                    <RequiredLabel htmlFor="gender">Gender</RequiredLabel>
                    <Select name="gender" defaultValue={user.userProfile?.gender || 'prefer_not_to_say'} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
            <div className="space-y-2">
                <RequiredLabel htmlFor="institutionType">Select your institution type</RequiredLabel>
                <Select name="institutionType" onValueChange={setInstitutionType} value={institutionType} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Please select your institution type." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="College/University">College/University</SelectItem>
                        <SelectItem value="Hostel/PG/Apartment">Hostel/PG/Apartment</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {institutionType && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <RequiredLabel htmlFor="institutionName">{institutionLabel}</RequiredLabel>
                        <Combobox
                            options={institutionOptions}
                            value={institutionName}
                            onChange={setInstitutionName}
                            placeholder={institutionPlaceholder}
                            searchPlaceholder={institutionSearchPlaceholder}
                            required
                        />
                        <input type="hidden" name="institutionName" value={institutionName} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <RequiredLabel htmlFor="area">Area/Colony</RequiredLabel>
                            <Input id="area" name="area" defaultValue={user.location?.area} required />
                        </div>
                        <div className="space-y-2">
                            <RequiredLabel htmlFor="city">City</RequiredLabel>
                            <Input id="city" name="city" defaultValue={user.location?.city} required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <RequiredLabel htmlFor="pinCode">Pin Code</RequiredLabel>
                        <Input id="pinCode" name="pinCode" defaultValue={user.location?.pinCode} required />
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
