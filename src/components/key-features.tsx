import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, IndianRupee, Rocket } from 'lucide-react';

const features = [
  {
    icon: <IndianRupee className="w-8 h-8 text-primary" />,
    title: 'Save Money',
    description: 'Avoid delivery fees by meeting minimum order values with a group.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: 'Discover New Places',
    description: 'See what others are ordering and discover new restaurants and deals.',
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
    title: 'Simple & Effective',
    description: 'A no-frills solution to a common problem. Find or create an order in seconds.',
  },
];

export function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              {feature.icon}
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
