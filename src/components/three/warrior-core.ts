import type * as THREE from "three";
import type { SceneFactory } from "./types";
import { dotTexture } from "./sprites";

/**
 * The Warrior Mind Core — the site's one real WebGL scene.
 *
 * It is the CSS emblem's idea built properly: a faceted core (the trained
 * mind), a counter-rotating cage around it (pressure), and five orbiting nodes
 * for the five pillars of the Warrior Mind Method — Focus, Fire, Flow, Forge,
 * Fight. Gold and electric alternate around the ring exactly as they do in the
 * rest of the brand, so the 3D reads as the same design language rather than a
 * bolted-on gadget.
 *
 * Deliberately built from primitives and no loaded model. A .glb of comparable
 * presence is 2–5MB and needs a loader, a decoder and a CDN host in the CSP;
 * this is a few hundred bytes of geometry description that the GPU builds
 * itself, and it inherits the brand palette as constants instead of baking it
 * into a texture.
 */

/** Brand palette, matching tailwind.config.js exactly. */
const GOLD = 0xe0a93c;
const GOLD_LIGHT = 0xe8bb5c;
const ELECTRIC = 0x3b82f6;
const ELECTRIC_LIGHT = 0x5b9dff;
const NAVY = 0x0b1226;

/** Focus · Fire · Flow · Forge · Fight. */
const PILLARS = 5;

export const warriorCore: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const high = quality === "high";

  // Everything hangs off one group so pointer parallax is a single transform
  // rather than a walk over the scene graph each frame.
  const root = new THREE.Group();
  scene.add(root);

  // Tracked for disposal. three.js does not release GPU memory when an object
  // is removed from a scene, so anything created here is registered here.
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  function geo<T extends THREE.BufferGeometry>(g: T): T {
    geometries.push(g);
    return g;
  }
  function mat<T extends THREE.Material>(m: T): T {
    materials.push(m);
    return m;
  }

  // ── The core ───────────────────────────────────────────────────────────────
  // flatShading keeps the facets readable; a smoothed sphere at this size just
  // looks like a ball.
  // metalness stays low on purpose. A metal surface is almost entirely
  // reflection, and with no environment map there is nothing to reflect — at
  // metalness 0.9 this rendered as a perfectly black shape on a black page,
  // which looks exactly like a scene that failed to load. Keeping it mostly
  // dielectric means the point lights below actually shade the facets, and the
  // emissive floor guarantees the silhouette is never lost.
  const core = new THREE.Mesh(
    geo(new THREE.IcosahedronGeometry(1.3, 1)),
    mat(
      new THREE.MeshStandardMaterial({
        color: 0x2a2519,
        metalness: 0.25,
        roughness: 0.42,
        emissive: GOLD,
        emissiveIntensity: 0.14,
        flatShading: true,
      })
    )
  );
  root.add(core);

  // A hair larger than the core, additive, so the facet edges catch light and
  // the silhouette never disappears against the dark page.
  const coreEdge = new THREE.Mesh(
    geo(new THREE.IcosahedronGeometry(1.31, 1)),
    mat(
      // Normal blending, not additive: on an alpha:true canvas additive barely
      // accumulates destination alpha, so the line work composited to almost
      // nothing over the page background.
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      })
    )
  );
  root.add(coreEdge);

  // ── The cage ───────────────────────────────────────────────────────────────
  const cage = new THREE.Mesh(
    geo(new THREE.IcosahedronGeometry(2.05, high ? 1 : 0)),
    mat(
      new THREE.MeshBasicMaterial({
        color: ELECTRIC_LIGHT,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      })
    )
  );
  root.add(cage);

  // ── The pillar ring ────────────────────────────────────────────────────────
  // Tilted, so the orbit reads as a path through space rather than a flat
  // circle drawn on the screen.
  const orbit = new THREE.Group();
  orbit.rotation.x = THREE.MathUtils.degToRad(72);
  orbit.rotation.z = THREE.MathUtils.degToRad(-14);
  root.add(orbit);

  const RING_RADIUS = 2.75;

  const ring = new THREE.Mesh(
    geo(new THREE.TorusGeometry(RING_RADIUS, 0.007, 3, high ? 160 : 72)),
    mat(
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      })
    )
  );
  orbit.add(ring);

  // One geometry and two materials shared across all five nodes: five draw
  // calls, not fifteen allocations.
  const nodeGeometry = geo(new THREE.SphereGeometry(0.1, high ? 20 : 10, high ? 20 : 10));
  // Opaque. These are the five pillars — the one part of the scene that must
  // read clearly at any size, so they do not depend on blending maths.
  const goldNode = mat(new THREE.MeshBasicMaterial({ color: GOLD_LIGHT }));
  const electricNode = mat(new THREE.MeshBasicMaterial({ color: ELECTRIC_LIGHT }));

  const nodes: THREE.Mesh[] = [];
  for (let i = 0; i < PILLARS; i++) {
    const node = new THREE.Mesh(nodeGeometry, i % 2 === 0 ? goldNode : electricNode);
    const angle = (i / PILLARS) * Math.PI * 2;
    node.position.set(
      Math.cos(angle) * RING_RADIUS,
      Math.sin(angle) * RING_RADIUS,
      0
    );
    orbit.add(node);
    nodes.push(node);
  }

  // ── Dust ───────────────────────────────────────────────────────────────────
  // Points, not meshes: one draw call for the whole field.
  const dustCount = high ? 700 : 240;
  const positions = new Float32Array(dustCount * 3);
  // Kept so the drift can be recomputed from the original position each frame
  // instead of accumulating float error until the field wanders off screen.
  const seeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    // Rejection-free shell distribution: a random direction at a random radius
    // in a band, so the dust surrounds the core instead of clustering at the
    // centre of the cube a naive random() fill would produce.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.2 + Math.random() * 3.6;
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.75;
    positions[i * 3 + 2] = Math.cos(phi) * r;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  const dustGeometry = geo(new THREE.BufferGeometry());
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    mat(
      new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        map: (() => {
          const t = dotTexture(THREE);
          textures.push(t);
          return t;
        })(),
        // The sprite's own transparent edge does the shaping, so depth writes
        // would punch square holes in whatever is behind each particle.
        alphaTest: 0.01,
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
  );
  root.add(dust);
  const dustBase = positions.slice();

  // ── Light ──────────────────────────────────────────────────────────────────
  // Lights are physical since three r155, so intensity is in candela and falls
  // off with distance squared — hence values in the tens, not fractions.
  const ambient = new THREE.AmbientLight(NAVY, 2.2);
  const goldKey = new THREE.PointLight(GOLD, 130, 20, 2);
  goldKey.position.set(3.2, 2.8, 4);
  const electricFill = new THREE.PointLight(ELECTRIC, 70, 20, 2);
  electricFill.position.set(-3.6, -2.4, 2.6);
  // A dim rim from behind separates the core from the page background.
  const rim = new THREE.PointLight(GOLD_LIGHT, 30, 16, 2);
  rim.position.set(0, 1.2, -4.5);
  root.add(ambient, goldKey, electricFill, rim);

  // Framing: the ring is 2.75 across and the dust reaches ~6.8, so pull back
  // enough that the orbit is never cropped by a narrow card.
  camera.position.set(0, 0, 7.4);

  let tiltX = 0;
  let tiltY = 0;

  return {
    pointer(x, y) {
      // Shallow on purpose. A decorative scene that swings hard with the mouse
      // reads as a toy; this is meant to feel like the object has weight.
      tiltY = x * 0.34;
      tiltX = y * 0.2;
    },

    resize(width, height) {
      // Portrait and narrow cards crop horizontally. Widen the field of view as
      // the frame narrows so the pillar ring stays inside it.
      const aspect = width / Math.max(height, 1);
      camera.fov = aspect < 0.9 ? 54 : aspect < 1.3 ? 47 : 42;
      camera.updateProjectionMatrix();
    },

    frame(t, dt) {
      // Lerped rather than assigned, so the parallax trails the cursor slightly.
      root.rotation.y += (tiltY - root.rotation.y) * Math.min(dt * 2.4, 1);
      root.rotation.x += (tiltX - root.rotation.x) * Math.min(dt * 2.4, 1);

      // Counter-rotation is what makes the two shells read as separate objects.
      core.rotation.y = t * 0.16;
      core.rotation.x = Math.sin(t * 0.21) * 0.14;
      coreEdge.rotation.copy(core.rotation);

      cage.rotation.y = -t * 0.1;
      cage.rotation.z = t * 0.055;

      orbit.rotation.y = t * 0.24;

      // Each pillar breathes on its own phase, so the five never pulse in
      // unison — the same trick the sparkles field uses.
      for (let i = 0; i < nodes.length; i++) {
        const pulse = 1 + Math.sin(t * 1.5 + (i / PILLARS) * Math.PI * 2) * 0.28;
        nodes[i].scale.setScalar(pulse);
      }

      // Dust drifts around its own origin. Recomputed from `dustBase` every
      // frame, so it can never accumulate away from where it started.
      const pos = dustGeometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        const s = seeds[i];
        arr[i * 3] = dustBase[i * 3] + Math.sin(t * 0.22 + s) * 0.2;
        arr[i * 3 + 1] = dustBase[i * 3 + 1] + Math.cos(t * 0.18 + s) * 0.22;
        arr[i * 3 + 2] = dustBase[i * 3 + 2] + Math.sin(t * 0.15 + s * 1.7) * 0.2;
      }
      pos.needsUpdate = true;

      dust.rotation.y = t * 0.03;
    },

    dispose() {
      root.clear();
      scene.remove(root);
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();
    },
  };
};
