// hooks/use-in-view.ts
'use client';

import { useState, useEffect, RefObject } from 'react';
import { useInView as useIntersectionObserver, IntersectionOptions } from 'react-intersection-observer';

export function useInView(ref: RefObject<Element>, options?: IntersectionOptions) {
  const { ref: observerRef, inView } = useIntersectionObserver(options);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (ref.current) {
      observerRef(ref.current);
    }
  }, [ref, observerRef]);

  useEffect(() => {
    if (inView) {
      setHasBeenInView(true);
    }
  }, [inView]);

  return hasBeenInView;
}
