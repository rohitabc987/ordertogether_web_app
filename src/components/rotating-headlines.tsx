
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const content = [
  {
    headline: 'Never Pay Delivery Fees Again — Enjoy Coupons Too 🚫💸',
    subtitle: 'Team up with people in your campus or building to combine small orders into one. Share, save, succeed.',
    highlight: 'Share, save, succeed.',
  },
  {
    headline: 'Combine Orders, Join Rides, Share Courses',
    subtitle: 'Whether it’s food, a cab, or class access — group up to unlock better deals and convenience.',
    highlight: 'Combine',
  },
  {
    headline: 'Share, Gather, Save — All in One Platform',
    subtitle: 'From orders to rides to online tools — connect with others in your area to get more together.',
    highlight: 'Share, Gather, Save',
  },
];

export function RotatingHeadlines() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
        setIsAnimatingOut(false);
      }, 500); // Wait for fade-out animation
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentContent = content[currentIndex];

  const renderHeadline = () => {
    if (!currentContent.highlight) {
      return currentContent.headline;
    }
    const parts = currentContent.headline.split(currentContent.highlight);
    return (
      <>
        {parts[0]}
        <span className="text-accent">{currentContent.highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
        key={currentIndex}
        className={cn(
          'transition-all duration-500 space-y-4',
          isAnimatingOut
            ? 'animate-fade-out-left'
            : 'animate-fade-in-left'
        )}
    >
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">
            {renderHeadline()}
        </h1>
        <p className="text-lg text-white/90 max-w-2xl">{currentContent.subtitle}</p>
    </div>
  );
}
