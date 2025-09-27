
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { PlusCircle, ChevronDown } from 'lucide-react';
import { RotatingHeadlines } from './rotating-headlines';

export function AboutSection({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  
  const heroStyle = bannerImageUrl ? {
      backgroundImage: `url(${bannerImageUrl})`,
    } : {};

  return (
    <div 
      className="relative w-full h-[60vh] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative h-full flex items-center justify-start text-left px-8 sm:px-12 md:px-16">
        <div className="z-10 space-y-4 max-w-3xl">
            <RotatingHeadlines />
            <p className="text-lg text-white/90">
              Why pay alone? Combine orders, share costs, and enjoy more with less
            </p>
            <div className="flex flex-wrap justify-start items-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/create-post">
                  <PlusCircle />
                  Start a New Order
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#active-orders">
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
