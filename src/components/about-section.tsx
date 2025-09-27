
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { PlusCircle, ChevronDown } from 'lucide-react';

export function AboutSection({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  
  const heroStyle = bannerImageUrl ? {
      backgroundImage: `url(${bannerImageUrl})`,
    } : {};

  return (
    <div 
      className="relative w-full h-[60vh] bg-cover bg-center bg-no-repeat"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="z-10 space-y-4 max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">
              Never Pay Delivery Fees Again.
            </h1>
            <p className="text-lg text-white/90">
              Team up with people in your building or campus to combine small orders into one. Save money, together.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/create-post">
                  <PlusCircle />
                  Start a New Order
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#active-orders" prefetch={false}>
                   <ChevronDown />
                  Browse Orders
                </Link>
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
