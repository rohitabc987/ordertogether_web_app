
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
import { Combobox } from './ui/combobox';
import { institutions } from '@/lib/institutions';
import { hostels } from '@/lib/hostels';
import { Switch } from './ui/switch';

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
  const [institutionType, setInstitutionType] = useState(user.institution?.institutionType || '');
  const [institutionName, setInstitutionName] = useState(user.institution?.institutionName || '');
  const [gender, setGender] = useState(user.userProfile?.gender || '');
  const [shareContact, setShareContact] = useState(user.contact?.shareContact ?? true);

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

  const RequiredLabel = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-destructive">*</span>
    </Label>
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={user.id} />
      <Card>
        <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <RequiredLabel htmlFor="name">Full Name</RequiredLabel>
                <Input id="name" name="name" defaultValue={user.userProfile?.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email (Cannot be changed)</Label>
                <Input id="email" name="email" defaultValue={user.contact?.email} readOnly className="bg-muted cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <RequiredLabel htmlFor="contactNumber">Contact Number</RequiredLabel>
                  <Input id="contactNumber" name="contactNumber" defaultValue={user.contact?.phone} required/>
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="gender">Gender</RequiredLabel>
                <Select name="gender" onValueChange={setGender} value={gender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2 !mt-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="share-contact">Share Contact Number</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow others to see your phone number when you post.
                      </p>
                    </div>
                    <Switch
                      id="share-contact"
                      name="shareContact"
                      checked={shareContact}
                      onCheckedChange={setShareContact}
                    />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>This information is required to help you find relevant group orders in your area.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <RequiredLabel htmlFor="institutionType">Select your institution type</RequiredLabel>
                <Select name="institutionType" onValueChange={setInstitutionType} value={institutionType}>
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
                        />
                        <input type="hidden" name="institutionName" value={institutionName} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="area">Area/Colony</Label>
                            <Input id="area" name="area" defaultValue={user.location?.area} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" defaultValue={user.location?.city} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pinCode">Pin Code</Label>
                        <Input id="pinCode" name="pinCode" defaultValue={user.location?.pinCode} />
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
