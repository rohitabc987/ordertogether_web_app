
'use client';

import { useState, useEffect, type RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  once?: boolean;
}

export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const { threshold = 0.1, once = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else {
            if(!once) {
                setIsInView(false);
            }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, once]);

  return isInView;
}
