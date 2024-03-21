import { useEffect } from "react";

/**
 * A hook that uses Intersection Observer API to load components lazily.
 *
 * @param {React.RefObject} ref - The React ref to the element we want to observe.
 * @param {Function} onIntersect - A callback function to execute when the element is in view.
 */
const useLazyLoad = (ref, onIntersect) => {
  useEffect(() => {
    // Ensure the observer is not instantiated unless ref.current is non-null
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        },
        {
          rootMargin: "0px",
          threshold: 0.5,
        }
      );

      observer.observe(ref.current);

      return () => {
        observer.unobserve(ref.current);
      };
    }
  }, [ref, onIntersect]);
};

export default useLazyLoad;
