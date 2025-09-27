import { HowItWorks } from '@/components/how-it-works';
import { KeyFeatures } from '@/components/key-features';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        <HowItWorks />
        <KeyFeatures />
      </div>
    </div>
  );
}
