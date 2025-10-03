
'use client';

import { useState, useEffect } from 'react';

const headlines = [
  { pre: 'Craving something ', highlight: 'delicious?' },
  { pre: 'Tired of high ', highlight: 'delivery fees?' },
  { pre: 'Want to unlock that ', highlight: 'restaurant deal?' },
];

const subHeadlines = [
  "Team up with your neighbors for group orders and save money together.",
  "Combine orders to meet minimums and say goodbye to extra charges.",
  "Join forces on OrderlyGather to get the best discounts on every meal.",
];

export function RotatingHeadlines() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 5000); // Change headline every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white animate-fade-in-left">
        {headlines[index].pre}
        <span className="text-accent">{headlines[index].highlight}</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-200 animate-fade-in-left animation-delay-300">
        {subHeadlines[index]}
      </p>
    </div>
  );
}
