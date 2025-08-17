"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * AnimatedSection - animates children when scrolled into view.
 * @param {React.ReactNode} children
 * @param {number} delay - animation delay in seconds
 * @param {boolean} once - if true, animates only the first time in view
 */
export function AnimatedSection({ children, delay = 0, once = true, layout = false, mobileOnly = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px 0px" });

  // Responsive animation: slide from bottom on mobile, fade/slide on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const baseInitial = mobileOnly || isMobile
    ? { opacity: 0, y: 60, scale: 0.98 }
    : { opacity: 0, y: 40 };
  const baseAnimate = { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={baseInitial}
      animate={inView ? baseAnimate : {}}
      transition={{ duration: 0.6, delay, type: 'spring', bounce: 0.18 }}
      style={{ willChange: "opacity, transform" }}
      layout={layout}
    >
      {children}
    </motion.div>
  );
}
