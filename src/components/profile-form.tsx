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
import { Info } from 'lucide-react';

function SubmitButton({ isLocked }: { isLocked: boolean }) {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLocked) {
      e.preventDefault();
      toast({
        title: 'Profile Locked',
        description: 'Changing the profile details is allowed only once a week.',
      });
    }
  };

  return (
    <Button type="submit" disabled={pending || isLocked} onClick={handleClick}>
      {pending ? 'Saving...' : isLocked ? 'Saved' : 'Save All Changes'}
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

  const lastUpdate = user.userProfile?.lastProfileUpdate ? new Date(user.userProfile.lastProfileUpdate) : null;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const canUpdate = !lastUpdate || (new Date().getTime() - lastUpdate.getTime()) > oneWeek;
  const nextUpdateDate = lastUpdate ? new Date(lastUpdate.getTime() + oneWeek) : null;

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.includes('success') ? 'Success' : 'Error',
        description: state.message.includes('success') 
          ? 'Your changes have been saved.' 
          : state.message,
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
      {!canUpdate && nextUpdateDate && (
        <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center gap-4">
                <Info className="w-6 h-6 text-amber-600"/>
                <div>
                    <p className="font-semibold text-amber-800">Profile Updates Locked — Only 1 Update per Week</p>
                    <p className="text-sm text-amber-700">
                    You’ll be able to update your profile again on  {nextUpdateDate.toLocaleDateString()}.
                    </p>
                </div>
            </CardContent>
        </Card>
      )}
      <input type="hidden" name="id" value={user.id} />
      <Card>
        <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal and location details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <RequiredLabel htmlFor="name">Full Name</RequiredLabel>
                <Input id="name" name="name" defaultValue={user.userProfile?.name || ''} required disabled={!canUpdate} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <RequiredLabel htmlFor="email">Email</RequiredLabel>
                    <Input id="email" name="email" defaultValue={user.contact?.email || ''} readOnly className="bg-muted cursor-not-allowed opacity-50" />
                </div>
                <div className="space-y-2">
                    <RequiredLabel htmlFor="gender">Gender</RequiredLabel>
                    <Input id="gender" name="gender" defaultValue={user.userProfile?.gender || 'prefer_not_to_say'} readOnly className="bg-muted cursor-not-allowed opacity-50" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" defaultValue={user.contact?.phone || ''} disabled={!canUpdate} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="shareContact" name="shareContact" defaultChecked={user.contact?.shareContact ?? true} disabled={!canUpdate} />
                <Label htmlFor="shareContact" className="cursor-pointer">Share contact publicly</Label>
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
                <Select name="institutionType" onValueChange={setInstitutionType} value={institutionType} required disabled={!canUpdate}>
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
                            disabled={!canUpdate}
                        />
                        <input type="hidden" name="institutionName" value={institutionName} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <RequiredLabel htmlFor="area">Area/Colony</RequiredLabel>
                            <Input id="area" name="area" defaultValue={user.location?.area || ''} required disabled={!canUpdate} />
                        </div>
                        <div className="space-y-2">
                            <RequiredLabel htmlFor="city">City</RequiredLabel>
                            <Input id="city" name="city" defaultValue={user.location?.city || ''} required disabled={!canUpdate} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <RequiredLabel htmlFor="pinCode">Pin Code</RequiredLabel>
                        <Input id="pinCode" name="pinCode" defaultValue={user.location?.pinCode || ''} required disabled={!canUpdate} />
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-center">
        <SubmitButton isLocked={!canUpdate} />
      </div>
    </form>
  );
}
