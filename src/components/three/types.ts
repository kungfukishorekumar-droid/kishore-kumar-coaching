import type * as THREE from "three";

/** The three.js module namespace, loaded at runtime rather than imported. */
export type ThreeModule = typeof import("three");

export type Quality = "low" | "high";

/**
 * A scene's lifecycle, returned by its factory. The host owns the renderer and
 * the animation loop; a scene only says what to build, what to move each frame
 * and what to release.
 */
export type SceneHandle = {
  /** Called once per animation frame. `t` is seconds since the scene started. */
  frame: (t: number, dt: number) => void;
  /** Viewport changed. Width and height are CSS pixels. */
  resize?: (width: number, height: number) => void;
  /**
   * Pointer moved, in normalised device coordinates: -1…1 on both axes, with
   * (0,0) at the centre. Already smoothed by the host, so a scene can use the
   * value directly.
   */
  pointer?: (x: number, y: number) => void;
  /**
   * Release every GPU resource this scene created — geometries, materials and
   * textures. The host disposes the renderer, but three.js does not walk the
   * scene graph for you, so anything not disposed here stays on the GPU after
   * the component unmounts. That is the leak that turns several visits into a
   * lost WebGL context.
   */
  dispose: () => void;
};

export type SceneFactory = (args: {
  THREE: ThreeModule;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /**
   * "low" on phones, low-core devices and anything reporting a data saver.
   * Scenes should cut geometry detail and particle counts, not visual identity.
   */
  quality: Quality;
}) => SceneHandle;
