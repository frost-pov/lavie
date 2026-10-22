"use client";

import { motion, useReducedMotion } from "motion/react";

/** The giant puff count. Each character rises out of a mask on load. */
export function HeroNumeral({ text, label }: { text: string; label: string }) {
  const reduce = useReducedMotion();
  return (
    <h1 className="cond text-[clamp(8rem,25vw,24rem)] font-black leading-[0.82]">
      <span className="sr-only">{label}</span>
      <span aria-hidden className="flex overflow-hidden pb-[0.06em] pt-[0.04em]">
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={reduce ? false : { y: "108%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
