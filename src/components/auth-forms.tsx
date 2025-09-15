'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, verifyAndSignInAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  );
}

function GoogleSignInButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // This effect will run when the component mounts and after a redirect from Google.
  useEffect(() => {
    const processRedirectResult = async () => {
      startTransition(async () => {
        try {
          const result = await getRedirectResult(auth);
          if (result && result.user) {
            console.log('auth-forms: Redirect result received for user:', result.user.displayName);
            const idToken = await result.user.getIdToken();
            console.log('auth-forms: ID token received. Calling server action...');
            
            const actionResult = await verifyAndSignInAction(idToken);
            
            console.log('auth-forms: Server action result:', actionResult);
            if (actionResult.success) {
              console.log('auth-forms: Server verification successful. Redirecting to /');
              router.push('/');
            } else {
              setError(actionResult.message || 'An unknown error occurred during server verification.');
            }
          }
        } catch (error: any) {
          console.error("auth-forms: Error processing redirect result", error);
          if (error.code !== 'auth/no-user-found') { // Ignore error if no redirect operation was in progress
              setError(`Failed to sign in with Google. ${error.message}`);
          }
        }
      });
    };
    
    processRedirectResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);


  const handleGoogleSignIn = async () => {
    setError(null);
    startTransition(async () => {
      const provider = new GoogleAuthProvider();
      // We are now using signInWithRedirect instead of signInWithPopup
      await signInWithRedirect(auth, provider);
      // The user will be redirected to Google and then back to this page.
      // The useEffect hook above will handle the result.
    });
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        {isPending ? 'Redirecting...' : 'Sign in with Google'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}


export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <LogIn className="w-6 h-6" />
          Login to OrderlyGather
        </CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <GoogleSignInButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
            <SubmitButton>Login with Email</SubmitButton>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export function SignupForm() {
    return (
      <Card className="w-full max-w-md">
         <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Create an Account
          </CardTitle>
          <CardDescription>Join OrderlyGather by signing in with your Google account. Only accounts with an @iitdh.ac.in email are allowed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInButton />
           <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
