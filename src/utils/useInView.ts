import { useEffect, useState, useRef, MutableRefObject } from 'react';

interface UseInViewOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useInView = <T extends HTMLElement = HTMLTableRowElement>(
  options: UseInViewOptions = {}
): [MutableRefObject<T | null>, boolean] => {
  const { root = null, rootMargin = '0px', threshold = 0 } = options;
  const [inView, setInView] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        console.log(entry.isIntersecting, 'intersecting entry');
      },
      { root, rootMargin, threshold }
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [root, rootMargin, threshold]);

  return [elementRef, inView];
};