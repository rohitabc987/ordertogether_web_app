'use client';

import { useTransition } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check } from 'lucide-react';
import { subscribeAction } from '@/lib/actions';
import { useAuth } from '@/providers';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: {
    id: 'daily' | 'weekly' | 'monthly';
    name: string;
    price: string;
    description: string;
    features: string[];
  };
  isCurrentPlan: boolean;
}

export function PricingCard({ plan, isCurrentPlan }: PricingCardProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    if (!user) return;
    startTransition(() => {
      subscribeAction(plan.id, user.id);
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
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
