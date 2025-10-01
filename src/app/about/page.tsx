import { HowItWorks } from '@/components/how-it-works';
import { KeyFeatures } from '@/components/key-features';
import { Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Intro Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold font-headline">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ordering food alone can be expensive and boring. We created <span className="text-primary font-semibold">OrderlyGather</span> 
          to make food delivery social, affordable, and fun. Whether you have a discount code or just want to avoid delivery charges, 
          you can team up with others in your building and save together.
        </p>
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <h2 className="text-3xl font-bold font-headline text-center mb-8">How It Works</h2>
        <HowItWorks />
      </section>

      {/* Key Features */}
      <section id="key-features">
        <h2 className="text-3xl font-bold font-headline text-center mb-8">Key Features</h2>
        <KeyFeatures />
      </section>

      {/* Mission / Community Section */}
      <section className="text-center space-y-6">
        <Users className="w-10 h-10 text-primary mx-auto" />
        <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We believe food is better when shared. Our mission is to build a community where neighbors can 
          save money, reduce waste, and discover new dining experiences — together.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to save on your next order?</h3>
        <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow hover:bg-primary/90 transition">
          Start Your First Group Order
        </button>
      </section>
    </div>
  );
}
