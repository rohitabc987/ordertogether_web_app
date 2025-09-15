'use client';

import { useState, useTransition } from 'react';
import { verifyAndSignInAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as getAuthInstance } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const auth = getAuthInstance();
    if (!auth) {
      setError("Authentication service is not available. Please try again later.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        const actionResult = await verifyAndSignInAction(idToken);
        if (actionResult.success) {
          router.push('/');
        } else {
          setError(actionResult.message ?? 'Sign in failed after authentication.');
        }
      } catch (e: any) {
        if (e.code === 'auth/popup-closed-by-user') {
          setError('Sign-in popup closed before completion.');
        } else {
          setError(e.message ?? 'An unexpected error occurred during sign-in.');
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <LogIn className="w-6 h-6" />
          Login to OrderlyGather
        </CardTitle>
        <CardDescription>Use your Google account to sign in. Only accounts with an @iitdh.ac.in email are allowed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           <Button onClick={handleGoogleSignIn} disabled={isPending} variant="outline" className="w-full">
            {isPending ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SignupForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
      const auth = getAuthInstance();
      if (!auth) {
        setError("Authentication service is not available. Please try again later.");
        return;
      }
      setError(null);
      startTransition(async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const idToken = await result.user.getIdToken();
          const actionResult = await verifyAndSignInAction(idToken);
          if (actionResult.success) {
            router.push('/');
          } else {
            setError(actionResult.message ?? 'Sign up failed after authentication.');
          }
        } catch (e: any) {
          if (e.code === 'auth/popup-closed-by-user') {
            setError('Sign-up popup closed before completion.');
          } else {
            setError(e.message ?? 'An unexpected error occurred during sign-up.');
          }
        }
      });
    };

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
          <Button onClick={handleGoogleSignIn} disabled={isPending} variant="outline" className="w-full">
            {isPending ? 'Signing up...' : 'Sign up with Google'}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
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
