
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const headlines = [
  { title: 'Craving something delicious?', highlight: 'delicious?' },
  { title: 'Tired of high delivery fees?', highlight: 'delivery fees?' },
  { title: 'Want to unlock that restaurant deal?', highlight: 'restaurant deal?' },
];

const subHeadlines = [
  "Team up with your neighbors for group orders and save money together.",
  "Combine orders to meet minimums and say goodbye to extra charges.",
  "Join forces on OrderlyGather to get the best discounts on every meal.",
];

const renderHighlightedTitle = (title: string, highlight: string) => {
  if (!highlight || !title.includes(highlight)) {
    return title;
  }
  const parts = title.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="text-accent">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};


export function RotatingHeadlines() {
  const [index, setIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFadingOut(true); // Start fade-out
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setIsFadingOut(false); // Start fade-in of new item
      }, 500); // Duration of fade-out animation
    }, 5000); // Change headline every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h1
        className={cn(
          'text-5xl md:text-6xl font-extrabold text-white transition-all duration-500',
          isFadingOut ? 'animate-fade-out-right' : 'animate-fade-in-left'
        )}
      >
        {renderHighlightedTitle(headlines[index].title, headlines[index].highlight)}
      </h1>
      <p
        className={cn(
          'text-lg md:text-xl text-slate-200 transition-all duration-500',
          isFadingOut ? 'animate-fade-out-right' : 'animate-fade-in-left animation-delay-300'
        )}
      >
        {subHeadlines[index]}
      </p>
    </div>
  );
}
