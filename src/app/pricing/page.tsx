import { PricingCard } from '@/components/pricing-card';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

const plans = [
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
  
  if(!user){
    redirect('/login');
  }

  const currentPlanId = user?.subscription?.plan;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground mt-2">Unlock contact details and connect with others.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {plans.map(plan => (
          <PricingCard key={plan.id} plan={plan} isCurrentPlan={currentPlanId === plan.id} />
        ))}
      </div>
    </div>
  );
}
