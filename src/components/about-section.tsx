
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info, PlusCircle } from 'lucide-react';

export function AboutSection() {
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-primary/20">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="bg-primary/10 p-3 rounded-full border border-primary/30">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl font-headline">Welcome to OrderlyGather</CardTitle>
          <CardDescription className="text-base">
            The smart way to meet minimum order values and save on delivery fees.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          Ever been just a few rupees short of a free delivery coupon? With OrderlyGather, you can team up with others in your building or campus to combine smaller orders into one. Browse active group orders below or be the one to start a new one!
        </p>
        <Button asChild>
          <Link href="/create-post">
            <PlusCircle />
            Start a New Order
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
