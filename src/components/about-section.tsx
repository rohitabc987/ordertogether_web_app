
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
      className="relative w-full h-[60vh] bg-cover bg-center bg-no-repeat"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      <div className="relative h-full flex items-center justify-start text-left">
        <div className="container mx-auto px-4">
          <div className="z-10 max-w-3xl">
              <RotatingHeadlines />
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
    </div>
  );
}
