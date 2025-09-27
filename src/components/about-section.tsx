
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowDown, PlusCircle } from 'lucide-react';
import Image from 'next/image';

export function AboutSection({ bannerImageUrl }: { bannerImageUrl: string | null }) {
  const handleBrowseClick = () => {
    const element = document.getElementById('active-orders');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroStyle = bannerImageUrl ? {
      backgroundImage: `url(${bannerImageUrl})`,
    } : {};

  return (
    <div 
      className="rounded-lg bg-card shadow-sm border border-primary/10 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={heroStyle}
    >
      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card/70 backdrop-blur-sm">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Never Pay Delivery Fees Again.
          </h1>
          <p className="text-lg text-muted-foreground">
            Team up with people in your building or campus to combine small orders into one. Save money, together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild size="lg">
              <Link href="/create-post">
                <PlusCircle />
                Start a New Order
              </Link>
            </Button>
            <Button variant="secondary" size="lg" onClick={handleBrowseClick}>
              <ArrowDown />
              Browse Orders
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
           <Image
              src="https://picsum.photos/seed/group-food/600/400"
              alt="People sharing food"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              data-ai-hint="people sharing food"
            />
        </div>
      </div>
    </div>
  );
}
