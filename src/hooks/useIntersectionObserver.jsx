import { useEffect, useState } from "react";

const useIntersectionObserver = (callback, options) => {
  const [node, setNode] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, options);

    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [node, callback, options]);

  return [setNode];
};

export default useIntersectionObserver;
