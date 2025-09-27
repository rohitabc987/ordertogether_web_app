import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, UserPlus, MessageCircle } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: <Search className="w-8 h-8 text-primary" />,
    title: 'Find or Create an Order',
    description: 'Browse active orders in your area or start a new one if you have a coupon or need to meet a minimum order value.',
  },
  {
    step: 2,
    icon: <UserPlus className="w-8 h-8 text-primary" />,
    title: 'Join the Group',
    description: 'Found an order you want to join? Click to get the contact details (subscription required) and connect with the poster.',
  },
  {
    step: 3,
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: 'Coordinate & Order',
    description: 'Use WhatsApp or call to coordinate the final order and payment details. Enjoy your food and the savings!',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works">
      <h2 className="text-3xl font-bold font-headline text-center mb-8">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map(step => (
          <Card key={step.step} className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                {step.icon}
              </div>
              <div className="text-sm font-bold text-primary">STEP {step.step}</div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
