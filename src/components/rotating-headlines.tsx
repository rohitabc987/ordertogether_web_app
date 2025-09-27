
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const headlines = [
  {
    text: 'Never Pay Delivery Fees Again.',
    highlight: 'Never',
  },
  {
    text: 'Get Coupons • Free Delivery • Save Together.',
    highlight: 'Save Together',
  },
  {
    text: 'Team Up & Split Orders, Save Big.',
    highlight: 'Save Big',
  },
];

export function RotatingHeadlines() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setIsAnimatingOut(false);
      }, 500); // Wait for fade-out animation to finish
    }, 3000); // Change headline every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const currentHeadline = headlines[currentIndex];

  const renderHeadline = () => {
    if (!currentHeadline.highlight) {
      return currentHeadline.text;
    }
    const parts = currentHeadline.text.split(currentHeadline.highlight);
    return (
      <>
        {parts[0]}
        <span className="text-accent">{currentHeadline.highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <h1 className="text-4xl md:text-5xl font-bold font-headline text-white overflow-hidden h-28 md:h-32">
      <div
        key={currentIndex}
        className={cn(
          'transition-all duration-500',
          isAnimatingOut
            ? 'animate-fade-out-left'
            : 'animate-fade-in-left'
        )}
      >
        {renderHeadline()}
      </div>
    </h1>
  );
}
