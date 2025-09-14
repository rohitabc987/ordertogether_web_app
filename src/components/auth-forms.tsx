'use client';

import { useActionState, useState, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, socialSignInAction } from '@/lib/actions';
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

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Use signInWithRedirect to avoid popup blockers and handle mobile UX better.
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
        console.error("Google sign-in initiation error", error);
        setError(`Failed to start Google sign-in. ${error.message}`);
    }
  };
  
  // This effect runs on the login/signup page after the user is redirected back from Google.
  useEffect(() => {
    const processRedirectResult = async () => {
      startTransition(async () => {
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            // User successfully signed in with Google.
            const user = result.user;
            const actionResult = await socialSignInAction('google', { email: user.email, name: user.displayName, photoURL: user.photoURL });
            
            if (actionResult?.success) {
              // On success, redirect to the home page.
              router.push('/');
            } else if(actionResult?.message) {
              // If the server action fails (e.g., domain not allowed), show the error.
              setError(actionResult.message);
            }
          }
          // If 'result' is null, it means the user just landed on the page without a sign-in redirect.
          // In this case, we do nothing and just wait for them to click the button.
        } catch (error: any) {
          console.error("Google sign-in result error", error);
          if (error.code === 'auth/unauthorized-domain') {
            setError('This domain is not authorized for Google Sign-In. Please contact support and add it to the Firebase console.');
          } else {
            setError(`Failed to sign in with Google. ${error.message}`);
          }
        }
      });
    };
    
    processRedirectResult();
    // The empty dependency array is correct here. We only want this to run once when the component mounts
    // on the redirect page to check for the sign-in result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        {isPending ? 'Signing in...' : 'Sign in with Google'}
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
        <CardDescription>Join OrderlyGather by signing in with your Google account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleSignInButton />
        <p className="px-8 text-center text-sm text-muted-foreground">
            Only accounts with an @iitdh.ac.in email are allowed.
        </p>
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
