/**
 * Shared mutable state between the GSAP scroll timelines (writers)
 * and the R3F render loop (reader). Mutation instead of React state
 * keeps the scene at 60fps with zero re-renders.
 */

export const FORMATIONS = {
  CLOUD: 0,
  TITLE: 1,
  MONOLITH: 2,
  AIRFLOW: 3,
  LIQUID: 4,
  CASK: 5,
  PIPELINE: 6,
  FLOOR: 7,
} as const;

export const FORMATION_COUNT = 8;

export const sceneState = {
  /** blend weights per formation — the scene is always a mix of these */
  weights: (() => {
    const w = new Float32Array(FORMATION_COUNT);
    w[FORMATIONS.CLOUD] = 1;
    return w;
  })(),
  /** particle tint, linear rgb. Neutral bone by default; cases bring color. */
  hue: new Float32Array([0.92, 0.9, 0.86]),
  /** camera */
  camZ: 11,
  camY: 0,
  camX: 0,
  lookY: 0,
  /** free-motion amount (1 = drifting dust, 0 = held formation) */
  turbulence: 1,
  /** global particle opacity + size scalars */
  opacity: 1,
  size: 1,
  /** overall page progress 0..1 */
  progress: 0,
  /** preloader: 0 while loading, 1 once revealed */
  revealed: 0,
};

export function setWeightsExclusive(index: number, value: number) {
  // convenience for timelines: raise one formation, damp the others
  const w = sceneState.weights;
  for (let i = 0; i < w.length; i++) {
    if (i !== index) w[i] = Math.min(w[i], 1 - value);
  }
  w[index] = value;
}
