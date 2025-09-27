
'use client';

import { useState, useEffect, type RefObject } from 'react';

interface UseInViewOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const { root = null, rootMargin = '0px', threshold = 0.1, once = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) {
        // If the ref isn't attached, we're not in view
        setIsInView(false);
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
         // Update state based on whether the element is intersecting
        setIsInView(entry.isIntersecting);

        // If it's a one-time animation and it's intersecting, disconnect the observer
        if (once && entry.isIntersecting) {
            observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, root, rootMargin, threshold, once]);

  return isInView;
}
