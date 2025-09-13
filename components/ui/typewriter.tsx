"use client";

import React from "react";

type TypewriterTextProps = {
  text: string;
  speedMs?: number;
  className?: string;
};

export function TypewriterText({ text, speedMs = 16, className }: TypewriterTextProps) {
  const [displayed, setDisplayed] = React.useState("");
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  React.useEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }

    // If the user prefers reduced motion or text is short, skip animation
    if (prefersReducedMotion || text.length <= 8) {
      setDisplayed(text);
      return;
    }

    let index = 0;
    let rafId = 0 as unknown as number;
    let lastTime = performance.now();
    const msPerChar = Math.max(4, speedMs);

    const tick = (now: number) => {
      const elapsed = now - lastTime;
      if (elapsed >= msPerChar) {
        const charsToAdd = Math.max(1, Math.floor(elapsed / msPerChar));
        index = Math.min(text.length, index + charsToAdd);
        setDisplayed(text.slice(0, index));
        lastTime = now;
      }
      if (index < text.length) {
        rafId = requestAnimationFrame(tick);
      }
    };

    setDisplayed("");
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [text, prefersReducedMotion, speedMs]);

  return <span className={className}>{displayed}</span>;
}


