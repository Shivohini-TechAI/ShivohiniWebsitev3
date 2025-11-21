import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const smoothScrollToTop = () => {
      const startY = window.scrollY;
      const duration = 800; // 🕒 total animation time in ms
      const startTime = performance.now();

      const easeOutExpo = (t: number) =>
        t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // ✨ smooth easing curve

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutExpo(progress);

        window.scrollTo(0, startY * (1 - ease));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    smoothScrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
