
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { updateProfileAction } from '@/lib/actions';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from './ui/switch';
import { Combobox } from './ui/combobox';
import { institutions } from '@/lib/institutions';
import { hostels } from '@/lib/hostels';

const initialState = {
    message: '',
    status: 'success',
};

function RequiredLabel({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor}>
            {children} <span className="text-destructive">*</span>
        </Label>
    );
}

export function ProfileForm({ user }: { user: User }) {
    const [state, formAction] = useActionState(updateProfileAction, initialState);
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    // State to manage the combobox value separately
    const [institutionName, setInstitutionName] = useState(user.institution?.institutionName || '');

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.status === 'success' ? 'Success' : 'Error',
                description: state.message,
                variant: state.status === 'success' ? 'default' : 'destructive',
            });
        }
    }, [state, toast]);

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form action={handleSubmit}>
          <input type="hidden" name="id" value={user.id} />
          
          <div className="space-y-6">
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
                      <RequiredLabel htmlFor="email">Email</RequiredLabel>
                      <Input id="email" name="email" defaultValue={user.contact?.email} readOnly className="bg-muted cursor-not-allowed opacity-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <RequiredLabel htmlFor="contactNumber">Phone Number</RequiredLabel>
                        <Input id="contactNumber" name="contactNumber" type="tel" defaultValue={user.contact?.phone || ''} required />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch id="shareContact" name="shareContact" defaultChecked={user.contact?.shareContact ?? true} />
                      <Label htmlFor="shareContact" className="cursor-pointer">Share contact number publicly on posts</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" defaultValue={user.userProfile?.gender}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>This information is required to help you find group orders near you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                   <div className="space-y-2">
                      <RequiredLabel htmlFor="institutionName">Institution</RequiredLabel>
                      <Combobox
                          options={institutions}
                          value={institutionName}
                          onChange={setInstitutionName}
                          placeholder="Select institution..."
                          searchPlaceholder="Search institution..."
                      />
                      <input type="hidden" name="institutionName" value={institutionName} />
                  </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hostel/PG (Optional)</CardTitle>
                <CardDescription>If you live in a hostel or PG, specify it here to find more relevant orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="hostelOrPG">Hostel/PG Name</Label>
                      <Combobox
                          options={hostels}
                          value={user.institution?.hostelOrPG || ''}
                          onChange={(value) => {
                              const e = { target: { name: 'hostelOrPG', value } } as any;
                          }}
                          placeholder="Select hostel/PG..."
                          searchPlaceholder="Search..."
                      />
                      <input type="hidden" name="hostelOrPG" value={user.institution?.hostelOrPG || ''} />
                  </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </div>
        </form>
    );
}
