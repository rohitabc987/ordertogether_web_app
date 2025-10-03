
import { PricingCard } from '@/components/pricing-card';
import { getCurrentUser } from '@/lib/session';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    id: 'single-post' as const,
    name: 'Single Post Pass',
    price: '₹1',
    description: 'Quick access to view one contact.',
    features: ['View contacts for single post', 'No time limit to use', 'Perfect for a one-time need'],
  },
  {
    id: 'daily' as const,
    name: 'Daily Pass',
    price: '₹10',
    description: 'Perfect for a one-time need.',
    features: ['View contacts for 24 hours', 'Unlimited contact views'],
  },
  {
    id: 'weekly' as const,
    name: 'Weekly Pass',
    price: '₹50',
    description: 'Best for regular users.',
    features: ['View contacts for 7 days', 'Unlimited contact views', 'Priority support'],
  },
  {
    id: 'monthly' as const,
    name: 'Monthly Pass',
    price: '₹150',
    description: 'Save big with our best value plan.',
    features: ['View contacts for 30 days', 'Unlimited contact views', 'Priority support', 'Early access to new features'],
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const currentPlanId = user?.subscription?.plan;
  const isLoggedIn = !!user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground mt-2">Unlock contact details and connect with others.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map(plan => (
          <PricingCard 
            key={plan.id} 
            plan={plan} 
            isCurrentPlan={currentPlanId === plan.id}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
      
      {!isLoggedIn && (
        <Card className="mt-12 max-w-2xl mx-auto text-center bg-card/50">
           <CardHeader>
            <CardTitle>Ready to Subscribe?</CardTitle>
            <CardDescription>
                You must be signed in to choose a plan and start connecting with others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Subscribe
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
