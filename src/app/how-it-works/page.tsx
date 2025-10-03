
import { HowItWorks as HowItWorksComponent } from '@/components/how-it-works';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <section id="how-it-works">
        <h2 className="text-3xl font-bold font-headline text-center mb-8">How It Works</h2>
        <HowItWorksComponent />
      </section>
    </div>
  );
}
