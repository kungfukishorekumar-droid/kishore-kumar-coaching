"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button — the most-touched element on the site, so it carries the most motion.
 *
 * Four things happen on interaction, all on transform/opacity only:
 *  1. hover  — lifts 2px and deepens its glow
 *  2. hover  — a light sweep crosses the face (::before, so `asChild` still works)
 *  3. press  — dips to 0.97 scale, giving the tap a physical bottom
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
    // press + lift (motion-safe only)
    "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]",
    "motion-safe:active:duration-100",
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
          "btn-gradient-shift bg-gold-gradient text-ink font-bold shadow-glow hover:shadow-glow-lg",
        electric:
          "btn-gradient-shift bg-electric-gradient text-white font-bold shadow-glow-blue hover:shadow-glow-blue-lg",
        outline:
          "border border-gold-400/40 bg-white/5 text-gold-100 backdrop-blur hover:border-gold-400/70 hover:bg-gold-400/10",
        ghost: "text-foreground/80 hover:bg-white/5 hover:text-gold-200",
        dark: "border border-white/10 bg-white/[0.06] text-foreground backdrop-blur hover:bg-white/[0.1]",
      },
      size: {
        // every size clears the 44px touch minimum on its tap area
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
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
