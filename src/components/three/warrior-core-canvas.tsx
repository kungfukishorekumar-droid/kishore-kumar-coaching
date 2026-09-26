"use client";

import { ThreeScene } from "./scene-host";
import { warriorCore } from "./warrior-core";
import { WarriorEmblem } from "@/components/ui/warrior-emblem";

/**
 * The Warrior Mind Core, ready to drop into a layout.
 *
 * Pairs the WebGL scene with the CSS emblem as its fallback — the same subject
 * drawn two ways. That pairing is the whole point: the emblem is what the
 * server renders and what a phone on a data saver, a blocklisted GPU or a
 * reduced-motion preference keeps, and it is finished work in its own right, so
 * no visitor gets a placeholder.
 */
export function WarriorCoreCanvas({ className }: { className?: string }) {
  return (
    <ThreeScene
      className={className}
      factory={warriorCore}
      fallback={<WarriorEmblem className="size-full" />}
    />
  );
}
