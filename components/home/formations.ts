/**
 * Procedural formation targets for the homepage particle field.
 * Everything is generated at runtime from math + canvas-sampled type —
 * no external assets. All formations share one world scale
 * (camera ≈ z11, fov 42 → ~8.5 world units visible width at origin).
 */

export const DESKTOP_COUNT = 42000;
export const MOBILE_COUNT = 15000;

// deterministic PRNG so the scene is identical on every visit
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rand: () => number): [number, number] {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  const m = Math.sqrt(-2 * Math.log(u));
  return [m * Math.cos(2 * Math.PI * v), m * Math.sin(2 * Math.PI * v)];
}

// cheap value noise for baked displacement
function vnoise(x: number, y: number, z: number) {
  const s = Math.sin(x * 1.7 + y * 2.3 + z * 1.1) * 43758.5453;
  return s - Math.floor(s);
}

/** 0 — CLOUD: drifting dust filling the stage */
export function cloud(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(101);
  for (let i = 0; i < n; i++) {
    const [gx, gy] = gaussianPair(rand);
    const [gz] = gaussianPair(rand);
    out[i * 3] = gx * 3.4;
    out[i * 3 + 1] = gy * 2.1;
    out[i * 3 + 2] = gz * 2.2;
  }
  return out;
}

/** 1 — TITLE: "GAVIKA" sampled from canvas-rendered type */
export function title(n: number, fontFamily: string): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(202);

  const W = 900;
  const H = 220;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return cloud(n);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 condensed 150px ${fontFamily}`;
  // font-stretch via canvas is spotty; widen with scale instead
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(1.14, 1);
  ctx.fillText("GAVIKA", 0, 8);
  ctx.restore();

  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4] > 120) pts.push(x, y);
    }
  }
  if (pts.length < 100) return cloud(n);

  const worldW = 9.4;
  const worldH = (worldW * H) / W;
  for (let i = 0; i < n; i++) {
    const pi = Math.floor(rand() * (pts.length / 2)) * 2;
    const px = pts[pi];
    const py = pts[pi + 1];
    out[i * 3] = (px / W - 0.5) * worldW + (rand() - 0.5) * 0.02;
    out[i * 3 + 1] = (0.5 - py / H) * worldH + (rand() - 0.5) * 0.02;
    out[i * 3 + 2] = (rand() - 0.5) * 0.25;
  }
  return out;
}

/** 2 — MONOLITH: a standing slab at 3/4 view */
export function monolith(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(303);
  const w = 2.5;
  const h = 5.4;
  const d = 1.0;
  const areas = [w * h, w * h, d * h, d * h, w * d, w * d]; // front/back/sides/top/bottom
  const total = areas.reduce((a, b) => a + b, 0);
  const rotY = 0.52; // baked 3/4 angle
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);

  for (let i = 0; i < n; i++) {
    let r = rand() * total;
    let f = 0;
    while (r > areas[f]) {
      r -= areas[f];
      f++;
    }
    const u = rand() - 0.5;
    const v = rand() - 0.5;
    let x = 0;
    let y = 0;
    let z = 0;
    if (f === 0) [x, y, z] = [u * w, v * h, d / 2];
    else if (f === 1) [x, y, z] = [u * w, v * h, -d / 2];
    else if (f === 2) [x, y, z] = [w / 2, v * h, u * d];
    else if (f === 3) [x, y, z] = [-w / 2, v * h, u * d];
    else if (f === 4) [x, y, z] = [u * w, h / 2, v * d];
    else [x, y, z] = [u * w, -h / 2, v * d];

    // slight surface breathing
    const nz = (vnoise(x * 2, y * 2, z * 2) - 0.5) * 0.05;
    x += nz;
    z += nz;

    out[i * 3] = x * cy + z * sy;
    out[i * 3 + 1] = y * 1.0;
    out[i * 3 + 2] = -x * sy + z * cy;
  }
  return out;
}

/** 3 — AIRFLOW: laminar streamlines over an unseen hull (AVELUM) */
export function airflow(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(404);
  const LINES = 110;
  const a = 3.4; // hull half-length
  const b = 1.05; // hull half-height
  const c = 1.5; // hull half-width

  for (let i = 0; i < n; i++) {
    const line = i % LINES;
    const lr = mulberry32(line * 977 + 13);
    const y0 = (lr() - 0.5) * 3.4;
    const z0 = (lr() - 0.5) * 4.2;
    const t = rand();
    const x = -7.5 + t * 15;

    // hull cross-section radius at x (teardrop: fuller at rear third)
    const xn = x / a;
    let hull = 0;
    if (Math.abs(xn) < 1) {
      const profile = Math.sqrt(1 - xn * xn);
      const tail = 0.75 + 0.25 * Math.cos(xn * Math.PI * 0.5);
      hull = profile * tail;
    }

    // radial position in normalized yz space
    const ry = y0 / b;
    const rz = z0 / c;
    const rr = Math.sqrt(ry * ry + rz * rz);
    const needed = hull * 1.12;
    let sy = y0;
    let sz = z0;
    if (rr < needed && rr > 1e-4) {
      const push = needed / rr;
      const blend = 1 - Math.pow(Math.max(0, rr / needed), 2) * 0.25;
      sy = y0 * push * blend;
      sz = z0 * push * blend;
    }
    // gentle wake convergence behind the hull
    if (xn > 1) {
      const settle = Math.min(1, (xn - 1) * 0.8);
      sy = sy * (1 - settle * 0.35);
      sz = sz * (1 - settle * 0.35);
    }

    out[i * 3] = x;
    out[i * 3 + 1] = sy - 0.2;
    out[i * 3 + 2] = sz;
  }
  return out;
}

/** 4 — LIQUID: a displaced blob with interior body (SÖLVE) */
export function liquid(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(505);
  for (let i = 0; i < n; i++) {
    // random direction
    const theta = rand() * Math.PI * 2;
    const cphi = rand() * 2 - 1;
    const sphi = Math.sqrt(1 - cphi * cphi);
    const dx = sphi * Math.cos(theta);
    const dy = cphi;
    const dz = sphi * Math.sin(theta);

    const shell = rand() < 0.72;
    let r: number;
    if (shell) {
      // displaced surface
      const disp =
        (vnoise(dx * 2.1, dy * 2.1, dz * 2.1) - 0.5) * 0.9 +
        (vnoise(dx * 4.7, dy * 4.7, dz * 4.7) - 0.5) * 0.35;
      r = 2.15 + disp * 0.85;
    } else {
      r = Math.cbrt(rand()) * 1.9;
    }
    out[i * 3] = dx * r;
    out[i * 3 + 1] = dy * r * 0.92;
    out[i * 3 + 2] = dz * r;
  }
  return out;
}

/** 5 — CASK: descending amber rings, a vortex into the barrel (OBSIDIAN) */
export function cask(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(606);
  for (let i = 0; i < n; i++) {
    const strand = rand();
    if (strand < 0.82) {
      // ring stack — wider at top, tightening as it descends
      const level = Math.floor(rand() * 15);
      const ly = 2.8 - level * 0.42;
      const radius = 3.1 - level * 0.145 + (rand() - 0.5) * 0.1;
      const ang = rand() * Math.PI * 2;
      out[i * 3] = Math.cos(ang) * radius;
      out[i * 3 + 1] = ly + (rand() - 0.5) * 0.06;
      out[i * 3 + 2] = Math.sin(ang) * radius;
    } else {
      // spiral drizzle connecting the rings
      const t = rand();
      const ang = t * Math.PI * 14;
      const radius = 3.1 - t * 2.1;
      out[i * 3] = Math.cos(ang) * radius;
      out[i * 3 + 1] = 2.8 - t * 6.3;
      out[i * 3 + 2] = Math.sin(ang) * radius;
    }
  }
  return out;
}

/** 6 — PIPELINE: five stations of work, one travelling line */
export function pipeline(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(707);
  const stations = [-6, -3, 0, 3, 6];
  for (let i = 0; i < n; i++) {
    if (rand() < 0.78) {
      const s = Math.floor(rand() * 5);
      const [gx, gy] = gaussianPair(rand);
      const [gz] = gaussianPair(rand);
      // each station a tight instrument cluster
      out[i * 3] = stations[s] + gx * 0.42;
      out[i * 3 + 1] = gy * 0.42;
      out[i * 3 + 2] = gz * 0.42;
    } else {
      // the connecting line
      const t = rand();
      out[i * 3] = -6 + t * 12;
      out[i * 3 + 1] = (rand() - 0.5) * 0.05;
      out[i * 3 + 2] = (rand() - 0.5) * 0.05;
    }
  }
  return out;
}

/** 7 — FLOOR: the dust settles. Credits. */
export function floor(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(808);
  for (let i = 0; i < n; i++) {
    const ang = rand() * Math.PI * 2;
    const radius = Math.sqrt(rand()) * 7.5;
    out[i * 3] = Math.cos(ang) * radius;
    out[i * 3 + 1] = -2.7 + rand() * 0.12;
    out[i * 3 + 2] = Math.sin(ang) * radius - 1;
  }
  return out;
}

export function buildAllFormations(
  n: number,
  fontFamily: string
): Float32Array[] {
  return [
    cloud(n),
    title(n, fontFamily),
    monolith(n),
    airflow(n),
    liquid(n),
    cask(n),
    pipeline(n),
    floor(n),
  ];
}
