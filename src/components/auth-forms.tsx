'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, verifyAndSignInAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        // This means a user has successfully signed in with the popup.
        // Now, we get the ID token and send it to the server to be verified.
        startTransition(async () => {
          try {
            const idToken = await firebaseUser.getIdToken();
            const result = await verifyAndSignInAction(idToken);
            
            if (result.success) {
              // The server has verified the token, created the user, and set the cookie.
              // Now we can safely redirect.
              router.push('/');
            } else {
              setError(result.message || 'An unknown error occurred on the server.');
            }
          } catch (e: any) {
             setError(`An error occurred during server verification: ${e.message}`);
          }
        });
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);


  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      // We are only opening the popup here.
      // The onAuthStateChanged listener above will handle the result.
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // This is a normal flow, no need to show an error.
        // The user intentionally closed the popup.
        console.log('Sign-in cancelled by user.');
      } else if (error.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized for Google Sign-In. Please contact support and add it to the Firebase console.');
      } else {
        console.error("Google sign-in error", error);
        setError(`Failed to sign in with Google. ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        {isPending ? 'Verifying...' : 'Sign in with Google'}
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