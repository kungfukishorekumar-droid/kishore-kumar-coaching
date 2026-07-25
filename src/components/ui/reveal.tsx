"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  reducedVariants,
  revealUp,
  popIn,
  fadeIn,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

const PRESETS = { up: revealUp, pop: popIn, fade: fadeIn } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Motion character: travel up (default), scale in, or plain fade. */
  variant?: keyof typeof PRESETS;
  as?: "div" | "li" | "span" | "p" | "section";
}

/**
 * Scroll-triggered entrance. Honours prefers-reduced-motion — content still
 * fades in so nothing is hidden, it just stops moving.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  const variants: Variants = reduce ? reducedVariants : PRESETS[variant];

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay: reduce ? 0 : delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container — pair with <Reveal> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.045,
  delayChildren = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(reduce ? 0 : stagger, reduce ? 0 : delayChildren)}
    >
      {children}
    </MotionTag>
  );
}
