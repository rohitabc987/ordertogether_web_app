
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

export function AboutSection({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  
  const heroStyle = bannerImageUrl ? {
      backgroundImage: `url(${bannerImageUrl})`,
    } : {};

  return (
    <div 
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex items-center justify-center text-center min-h-[300px]">
          <div className="relative z-10 space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">
                Never Pay Delivery Fees Again.
              </h1>
              <p className="text-lg text-white/90">
                Team up with people in your building or campus to combine small orders into one. Save money, together.
              </p>
              <div className="flex justify-center pt-4">
                <Button asChild size="lg">
                  <Link href="/create-post">
                    <PlusCircle />
                    Start a New Order
                  </Link>
                </Button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
