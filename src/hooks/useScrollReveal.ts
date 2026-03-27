import { useEffect } from "react";

/**
 * useScrollReveal
 * @param deps - Optional dependencies that trigger a re-scan of the DOM for data-reveal elements.
 */
export default function useScrollReveal(deps: any[] = []) {
  useEffect(() => {
    // Small delay to ensure React has finished DOM updates
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll("[data-reveal]");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-show");
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, deps);
}
