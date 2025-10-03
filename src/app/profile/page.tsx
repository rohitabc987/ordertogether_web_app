
import { ProfileForm } from '@/components/profile-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/session';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Crown } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }
  
  const message = searchParams?.message;

  const isSubscribed = user.subscription?.status === 'active';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">My Profile</h1>
      
      {message && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfileForm user={user} />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isSubscribed && user.subscription ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-semibold">Active</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plan: <span className="capitalize font-medium text-foreground">{user.subscription.plan}</span>
                  </p>
                  {user.subscription.expiry && (
                    <p className="text-sm text-muted-foreground">
                      Expires on: <span className="font-medium text-foreground">{format(new Date(user.subscription.expiry), 'PPP')}</span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">You are not currently subscribed.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
