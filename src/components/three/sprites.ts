import type * as THREE from "three";
import type { ThreeModule } from "./types";

/**
 * A soft round dot, drawn once into a 64px canvas.
 *
 * Without a map, PointsMaterial draws each particle as a hard square — which
 * at close range reads as a rendering bug rather than as light. No network
 * request, no image in the repo, one small texture per scene.
 */
export function dotTexture(THREE: ThreeModule): THREE.Texture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}
