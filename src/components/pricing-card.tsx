
'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check, LogIn } from 'lucide-react';
import { subscribeAction } from '@/lib/actions';
import { useAuth } from '@/providers';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PricingCardProps {
  plan: {
    id: 'single-post' | 'daily' | 'weekly' | 'monthly';
    name: string;
    price: string;
    description: string;
    features: string[];
  };
  isCurrentPlan: boolean;
  isLoggedIn: boolean;
}

export function PricingCard({ plan, isCurrentPlan, isLoggedIn }: PricingCardProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubscribe = () => {
    if (!user) return;
    startTransition(async () => {
      const result = await subscribeAction(plan.id, user.id);
      if (result.success) {
        toast({
          title: 'Subscription Successful!',
          description: `Your ${plan.name} is now active.`,
        });
        router.push('/profile');
        router.refresh(); 
      } else {
        toast({
          title: 'Subscription Failed',
          description: result.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className={cn("flex flex-col", isCurrentPlan && "border-primary ring-2 ring-primary")}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-4xl font-bold font-headline">{plan.price}</div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        {isLoggedIn ? (
          <Button
            className="w-full"
            onClick={handleSubscribe}
            disabled={isPending || isCurrentPlan}
          >
            {isPending
              ? 'Processing...'
              : isCurrentPlan
              ? 'Current Plan'
              : 'Subscribe'}
          </Button>
        ) : (
          <div className="space-y-4 text-center">
            <Button className="w-full" disabled>Subscribe</Button>
            <p className="text-sm text-muted-foreground">
              You must be signed in to subscribe.
            </p>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/login">
                <LogIn />
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
