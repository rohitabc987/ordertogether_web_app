
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
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.userProfile?.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={user.contact?.email} readOnly />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" defaultValue={user.contact?.phone} required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
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
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>This helps you see orders from people nearby.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="institutionType">Select your institution type</Label>
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
                        <Label htmlFor="institutionName">{institutionLabel}</Label>
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
