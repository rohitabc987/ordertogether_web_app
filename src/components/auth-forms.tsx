'use client';

import { useState, useTransition, useEffect } from 'react';
import { verifyAndSignInAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [googleError, setGoogleError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInstance = auth();
    if (!authInstance) return;

    const handleRedirectResult = async () => {
      startGoogleTransition(async () => {
        try {
          const result = await getRedirectResult(authInstance);
          if (result && result.user) {
            const idToken = await result.user.getIdToken();
            const actionResult = await verifyAndSignInAction(idToken);
            if (actionResult.success) {
              router.push('/');
            } else {
              setGoogleError(actionResult.message ?? 'Sign in failed after redirect.');
            }
          }
        } catch (e: any) {
          setGoogleError(e.message ?? 'Error during redirect flow.');
        }
      });
    };
    handleRedirectResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleGoogleSignIn = async () => {
    const authInstance = auth();
    if (!authInstance) return;
    setGoogleError(null);
    startGoogleTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(authInstance, provider);
      } catch (e: any) {
        setGoogleError(e.message ?? 'Failed to start Google sign in.');
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
           <Button onClick={handleGoogleSignIn} disabled={isGooglePending} variant="outline" className="w-full">
            {isGooglePending ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
          {googleError && <p className="text-sm text-destructive">{googleError}</p>}
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
    const [isGooglePending, startGoogleTransition] = useTransition();
    const [googleError, setGoogleError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
      const authInstance = auth();
      if (!authInstance) return;

      const handleRedirectResult = async () => {
        startGoogleTransition(async () => {
            try {
              const result = await getRedirectResult(authInstance);
              if (result && result.user) {
                  const idToken = await result.user.getIdToken();
                  const actionResult = await verifyAndSignInAction(idToken);
                  if (actionResult.success) {
                    router.push('/');
                  } else {
                    setGoogleError(actionResult.message ?? 'Sign in failed after redirect.');
                  }
              }
            } catch (e: any) {
                setGoogleError(e.message ?? 'Error during redirect flow.');
            }
        });
      };
      handleRedirectResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const handleGoogleSignIn = async () => {
        const authInstance = auth();
        if (!authInstance) return;
        setGoogleError(null);
        startGoogleTransition(async () => {
          try {
              const provider = new GoogleAuthProvider();
              await signInWithRedirect(authInstance, provider);
          } catch (e: any) {
              setGoogleError(e.message ?? 'Failed to start Google sign in.');
          }
        });
    };

    return (
      <Card className="w-full max-w-md">
         <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Create an Account
          </Title>
          <CardDescription>Join OrderlyGather by signing in with your Google account. Only accounts with an @iitdh.ac.in email are allowed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleSignIn} disabled={isGooglePending} variant="outline" className="w-full">
            {isGooglePending ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
          {googleError && <p className="text-sm text-destructive">{googleError}</p>}
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