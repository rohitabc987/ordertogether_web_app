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
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, AuthError } from 'firebase/auth';
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

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [googleError, setGoogleError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleRedirectResult = async () => {
      startGoogleTransition(async () => {
        try {
          const result = await getRedirectResult(auth);
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
    setGoogleError(null);
    startGoogleTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
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
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           <Button onClick={handleGoogleSignIn} disabled={isGooglePending} variant="outline" className="w-full">
            {isGooglePending ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
          {googleError && <p className="text-sm text-destructive">{googleError}</p>}
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
    const [isGooglePending, startGoogleTransition] = useTransition();
    const [googleError, setGoogleError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleRedirectResult = async () => {
        startGoogleTransition(async () => {
            try {
            const result = await getRedirectResult(auth);
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
        setGoogleError(null);
        startGoogleTransition(async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
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
          </CardTitle>
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
