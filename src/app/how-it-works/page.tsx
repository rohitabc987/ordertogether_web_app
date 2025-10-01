import { HowItWorks } from '@/components/how-it-works';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">How It Works</h1>
        <p className="text-lg text-muted-foreground mt-2">Start saving on your food orders in just 3 simple steps.</p>
      </div>
      <div className="max-w-[68rem] mx-auto">
        <HowItWorks />
      </div>
    </div>
  );
}
