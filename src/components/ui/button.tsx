"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button — the most-touched element on the site, so it carries the most motion.
 *
 * Every filled button is a 3D key: a solid edge sits beneath the face (see the
 * `key-*` shadows in tailwind.config.js). Four things happen on interaction:
 *  1. hover  — the face rises 2px while the edge grows 2px, so the key lifts
 *              off its base instead of sliding up the page
 *  2. hover  — a light sweep crosses the face (::before, so `asChild` still works)
 *  3. press  — the face drops 3px onto a 1px edge: the key bottoms out
 *  4. focus  — a gold ring, offset from the button so it reads on dark ground
 *
 * Every transform is wrapped in `motion-safe:`, so a visitor with reduced-motion
 * gets the colour changes and none of the movement.
 */
const buttonVariants = cva(
  [
    // structure
    "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap rounded-full font-semibold cursor-pointer select-none",
    "[touch-action:manipulation]",
    // shared transition — colour + shadow + transform share one curve
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out",
    // lift + press (motion-safe only). The edge shadow changes in the variant
    // classes below by the same distances, which is what keeps the key's
    // bottom planted. Press is a translate now, not a scale: a key that
    // shrinks reads as receding, a key that drops reads as pressed.
    "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-[3px]",
    "motion-safe:active:duration-75",
    // hover shine sweep
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10",
    "before:-translate-x-full before:bg-gradient-to-r",
    "before:from-transparent before:via-white/25 before:to-transparent",
    "before:transition-transform before:[transition-duration:700ms] before:ease-out",
    "motion-safe:hover:before:translate-x-full",
    "motion-reduce:before:hidden",
    // focus + disabled
    "outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
    "disabled:pointer-events-none disabled:opacity-50",
    // icons travel a touch on hover
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
    "motion-safe:hover:[&_svg:last-child]:translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        primary:
          "btn-gradient-shift bg-gold-gradient text-ink font-bold shadow-key-gold motion-safe:hover:shadow-key-gold-up motion-safe:active:shadow-key-gold-down",
        electric:
          "btn-gradient-shift bg-electric-gradient text-white font-bold shadow-key-electric motion-safe:hover:shadow-key-electric-up motion-safe:active:shadow-key-electric-down",
        outline:
          "border border-gold-400/40 bg-white/5 text-gold-100 backdrop-blur shadow-key-dark hover:border-gold-400/70 hover:bg-gold-400/10 motion-safe:hover:shadow-key-dark-up motion-safe:active:shadow-key-dark-down",
        // Ghost stays flat on purpose: it is the least important action in any
        // group, and giving it a body would make it compete with the keys.
        ghost: "text-foreground/80 hover:bg-white/5 hover:text-gold-200",
        dark: "border border-white/10 bg-white/[0.06] text-foreground backdrop-blur shadow-key-dark hover:bg-white/[0.1] motion-safe:hover:shadow-key-dark-up motion-safe:active:shadow-key-dark-down",
      },
      size: {
        // every size clears the 44px touch minimum on its tap area
        // min-h as well as h: a flex-1 button in a column stack gets its
        // height from flex-basis, which overrode h-* and squashed the
        // workshop CTAs to 24px on phones. min-h is a floor flex can't take.
        sm: "h-10 min-h-10 px-4 text-sm",
        md: "h-11 min-h-11 px-6 text-sm",
        lg: "h-14 min-h-14 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and blocks input. Ignored when `asChild` is set. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Slot requires exactly one child, so the spinner only renders for real buttons.
    const content =
      !asChild && loading ? (
        <>
          <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={!asChild ? disabled || loading : undefined}
        aria-busy={!asChild && loading ? true : undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
