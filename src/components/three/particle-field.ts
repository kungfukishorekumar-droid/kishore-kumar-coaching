import type * as THREE from "three";
import type { SceneFactory } from "./types";
import { dotTexture } from "./sprites";

/**
 * Two particle scenes: a slow galaxy behind the hero and rising embers behind
 * the closing call to action. Both are a single `Points` draw call each, with
 * no lights and no meshes, so their GPU cost is close to nothing; what they
 * cost is the three.js download, which is why the host decides when they load.
 */

const GOLD_PALE = 0xf0cf85;
const GOLD = 0xe0a93c;
const EMBER = 0xf4c430;
const ELECTRIC = 0x5b9dff;

/** Box–Muller: a normally distributed value, for natural-looking scatter. */
function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ── Hero: the Warrior galaxy ──────────────────────────────────────────────── */

/**
 * A three-armed spiral of gold and electric light, tilted so it is seen at an
 * angle, with a sparse shell of distant stars behind it for depth. The camera
 * follows the pointer a little, so the near arms slide against the far stars —
 * that parallax is what makes it read as space rather than as a pattern.
 *
 * It sits right of centre on wide screens, behind the portrait, so the
 * headline and buttons on the left keep a calm background to be read against.
 */
export const heroGalaxy: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const high = quality === "high";
  const sprite = dotTexture(THREE);

  const root = new THREE.Group();
  scene.add(root);

  // ── Spiral arms ────────────────────────────────────────────────────────────
  const ARMS = 3;
  const RADIUS = 6.2;
  const count = high ? 2400 : 900;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const inner = new THREE.Color(GOLD_PALE);
  const mid = new THREE.Color(GOLD);
  const outer = new THREE.Color(ELECTRIC);
  const c = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Squared random pulls more particles toward the core, like a real galaxy.
    const r = Math.pow(Math.random(), 1.6) * RADIUS + 0.15;
    const arm = ((i % ARMS) / ARMS) * Math.PI * 2;
    const twist = r * 0.95;
    // Scatter widens with radius: tight arms at the core, loose at the rim.
    const spread = 0.12 + r * 0.07;
    const a = arm + twist;
    pos[i * 3] = Math.cos(a) * r + gauss() * spread;
    pos[i * 3 + 1] = gauss() * (0.22 * (1 - r / (RADIUS * 1.15)));
    pos[i * 3 + 2] = Math.sin(a) * r + gauss() * spread;

    const t = r / RADIUS;
    if (t < 0.45) c.copy(inner).lerp(mid, t / 0.45);
    else c.copy(mid).lerp(outer, (t - 0.45) / 0.55);
    // A little per-particle variation keeps the arms from looking banded.
    const jitter = 0.75 + Math.random() * 0.35;
    col[i * 3] = c.r * jitter;
    col[i * 3 + 1] = c.g * jitter;
    col[i * 3 + 2] = c.b * jitter;
  }

  const galaxyGeo = new THREE.BufferGeometry();
  galaxyGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  galaxyGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const galaxyMat = new THREE.PointsMaterial({
    size: high ? 0.07 : 0.085,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);

  // The disk hangs in its own group so tilt and spin are separate axes: the
  // group sets the viewing angle, the galaxy spins about its own pole.
  const disk = new THREE.Group();
  disk.rotation.x = 1.08;
  disk.rotation.z = -0.32;
  disk.add(galaxy);
  root.add(disk);

  // ── Far stars ──────────────────────────────────────────────────────────────
  const starCount = high ? 600 : 220;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 14 + Math.random() * 10;
    starPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    starPos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    starPos[i * 3 + 2] = Math.cos(phi) * r - 6;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: GOLD_PALE,
    size: 0.09,
    map: sprite,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(starGeo, starMat);
  root.add(stars);

  camera.position.set(0, 0.4, 9.5);
  let offsetX = 2.6;
  let camX = 0;
  let camY = 0.4;
  let aimX = 0;
  let aimY = 0.4;

  return {
    resize(width, height) {
      // Wide: behind the portrait. Narrow (tablet portrait, split windows):
      // centred and pulled back, so the arms are not cropped to a smear.
      const aspect = width / Math.max(height, 1);
      offsetX = aspect > 1.25 ? 2.6 : 0;
      camera.position.z = aspect > 1.25 ? 9.5 : 12;
      root.position.x = offsetX;
    },
    pointer(x, y) {
      aimX = x * 1.1;
      aimY = 0.4 - y * 0.6;
    },
    frame(t, dt) {
      galaxy.rotation.y = t * 0.045;
      stars.rotation.y = t * 0.008;
      const k = Math.min(dt * 1.8, 1);
      camX += (aimX - camX) * k;
      camY += (aimY - camY) * k;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(offsetX * 0.35, 0, 0);
    },
    dispose() {
      root.clear();
      scene.remove(root);
      galaxyGeo.dispose();
      galaxyMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      sprite.dispose();
    },
  };
};

/* ── Closing CTA: rising embers ────────────────────────────────────────────── */

/**
 * Sparks rising through depth, swaying as they go, fading in at the bottom and
 * out at the top. The last beat of the page, so it is warm (gold → ember) where
 * the hero is cool.
 *
 * Fading is done through vertex colour, not opacity: PointsMaterial has one
 * opacity for the whole cloud, but under additive blending a particle drawn in
 * black adds nothing — so dimming its colour toward black is a per-particle
 * fade for free.
 */
export const risingEmbers: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const high = quality === "high";
  const sprite = dotTexture(THREE);

  const count = high ? 460 : 180;
  const W = 8;
  const H = 4.6;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const baseX = new Float32Array(count);
  const speed = new Float32Array(count);
  const phase = new Float32Array(count);
  const tint = new Float32Array(count * 3);
  const gold = new THREE.Color(GOLD);
  const ember = new THREE.Color(EMBER);
  const pale = new THREE.Color(GOLD_PALE);
  const c = new THREE.Color();

  function respawn(i: number, anywhere: boolean) {
    baseX[i] = (Math.random() * 2 - 1) * W;
    pos[i * 3 + 1] = anywhere ? (Math.random() * 2 - 1) * H : -H - Math.random() * 0.6;
    pos[i * 3 + 2] = -3.5 + Math.random() * 5.5;
    speed[i] = 0.28 + Math.random() * 0.55;
    phase[i] = Math.random() * Math.PI * 2;
    const roll = Math.random();
    c.copy(roll < 0.5 ? gold : roll < 0.85 ? ember : pale);
    tint[i * 3] = c.r;
    tint[i * 3 + 1] = c.g;
    tint[i * 3 + 2] = c.b;
  }
  for (let i = 0; i < count; i++) respawn(i, true);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: high ? 0.11 : 0.13,
    map: sprite,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  camera.position.set(0, 0, 8);

  let driftX = 0;

  return {
    pointer(x) {
      driftX = x * 0.5;
    },
    frame(t, dt) {
      const pa = geo.attributes.position as THREE.BufferAttribute;
      const ca = geo.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = pos[i * 3 + 1] + speed[i] * dt;
        if (y > H) {
          respawn(i, false);
          y = pos[i * 3 + 1];
        }
        pos[i * 3 + 1] = y;
        pos[i * 3] = baseX[i] + Math.sin(t * 0.7 + phase[i]) * 0.35;

        // 0 at both edges, 1 through the middle band.
        const n = (y + H) / (2 * H);
        const fade = Math.min(1, n * 4) * Math.min(1, (1 - n) * 2.5);
        // Each spark flickers on its own phase.
        const flicker = 0.75 + Math.sin(t * 6 + phase[i] * 3) * 0.25;
        const b = Math.max(0, fade * flicker);
        col[i * 3] = tint[i * 3] * b;
        col[i * 3 + 1] = tint[i * 3 + 1] * b;
        col[i * 3 + 2] = tint[i * 3 + 2] * b;
      }
      pa.needsUpdate = true;
      ca.needsUpdate = true;
      points.position.x += (driftX - points.position.x) * Math.min(dt * 2, 1);
    },
    dispose() {
      scene.remove(points);
      geo.dispose();
      mat.dispose();
      sprite.dispose();
    },
  };
};
