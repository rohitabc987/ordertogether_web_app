'use client';

import { useState, useTransition } from 'react';
import { verifyAndSignInAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UtensilsCrossed } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as getAuthInstance } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function AuthForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
      const auth = getAuthInstance;
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
    <Card className="w-full max-w-sm shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center items-center">
        <div className="bg-primary/10 p-4 rounded-full border border-primary/20 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">Welcome to OrderlyGather</CardTitle>
        <CardDescription>Sign in with your Google account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-center text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button 
          className="w-full transition-transform hover:scale-105" 
          onClick={handleGoogleSignIn} 
          disabled={isPending}
          size="lg"
        >
          {isPending ? (
            'Signing in...'
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function LoginForm() {
  return <AuthForm />;
}
