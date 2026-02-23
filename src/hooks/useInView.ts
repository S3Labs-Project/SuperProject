import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Trigger only once when element enters view (default: true) */
  once?: boolean;
  /** Root margin for IntersectionObserver, e.g. "0px 0px -80px 0px" to trigger earlier */
  rootMargin?: string;
  /** Threshold 0–1 for how much visibility triggers (default: 0.1) */
  threshold?: number;
}

/**
 * Returns ref and inView state. When element enters viewport, inView becomes true.
 * Respects prefers-reduced-motion: when set, inView is true immediately so content isn't hidden.
 */
export function useInView(options: UseInViewOptions = {}) {
  const { once = true, rootMargin = "0px 0px -60px 0px", threshold = 0.1 } = options;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        if (once) observer.disconnect();
      },
      { rootMargin, threshold }
    );

    observer.observe(el);

    // If already in viewport on mount (e.g. above the fold), set inView immediately
    const rect = el.getBoundingClientRect();
    const windowH = typeof window !== "undefined" ? window.innerHeight : 0;
    if (rect.top < windowH - 60 && rect.bottom > 0) {
      setInView(true);
      if (once) observer.disconnect();
    }

    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
