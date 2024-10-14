// import { useCallback, useRef } from "react";

// export function useVisibility(cb: (isVisible: boolean) => void, deps: React.DependencyList): (node: any) => void {
//     const intersectionObserver = useRef<IntersectionObserver | null>(null);
//     return useCallback(node => {
//       if (intersectionObserver.current) {
//         intersectionObserver.current.disconnect();
//       }
  
//       intersectionObserver.current = new IntersectionObserver(([entry]) => {
//         cb(entry.isIntersecting);
//       });
  
//       if (node) intersectionObserver.current.observe(node);
//     }, deps); 
//   }

import { useCallback, useRef } from "react";

export function useVisibility(
  cb: (isVisible: boolean, id: number | null) => void, 
  deps: React.DependencyList
): (node: HTMLElement | null) => void {
  
  const intersectionObserver = useRef<IntersectionObserver | null>(null);

  return useCallback(node => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }

    intersectionObserver.current = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      const id = parseInt(entry.target?.id) || null;  
      cb(isVisible, isVisible ? id : null); 
    });
 
    if (node) {
      intersectionObserver.current.observe(node);
    }

  }, deps); 
}