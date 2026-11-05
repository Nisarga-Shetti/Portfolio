export const EARTH_PX = 256;

const TEX_W = 512;
const TEX_H = 256;
const TWO_PI = Math.PI * 2;
const SPIN_SECONDS = 28;
const CLOUD_DRIFT_RAD_PER_SEC = 0.05;
const AMBIENT = 0.07;
const ATMOSPHERE_RGB = [0.3, 0.85, 1] as const;
const CLOUD_RGB = 0.95;

type Vec3 = [number, number, number];

function normalize(x: number, y: number, z: number): Vec3 {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
}

const LIGHT = normalize(-0.55, 0.6, 0.58);
const HALF = normalize(LIGHT[0], LIGHT[1], LIGHT[2] + 1);

function hash(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = fade(x - ix);
  const fy = fade(y - iy);
  const fz = fade(z - iz);
  const c = (dx: number, dy: number, dz: number) => hash(ix + dx, iy + dy, iz + dz);
  const a = mix(mix(c(0, 0, 0), c(1, 0, 0), fx), mix(c(0, 1, 0), c(1, 1, 0), fx), fy);
  const b = mix(mix(c(0, 0, 1), c(1, 0, 1), fx), mix(c(0, 1, 1), c(1, 1, 1), fx), fy);
  return mix(a, b, fz);
}

function fbm(x: number, y: number, z: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let px = x;
  let py = y;
  let pz = z;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(px, py, pz);
    norm += amp;
    px = px * 2.03 + 17.1;
    py = py * 2.03 + 9.7;
    pz = pz * 2.03 + 3.3;
    amp *= 0.5;
  }
  return sum / norm;
}

interface Surface {
  rgb: Float32Array;
  ocean: Float32Array;
  cloud: Float32Array;
}

function buildSurface(): Surface {
  const count = TEX_W * TEX_H;
  const rgb = new Float32Array(count * 3);
  const ocean = new Float32Array(count);
  const cloud = new Float32Array(count);

  for (let row = 0; row < TEX_H; row++) {
    const lat = (0.5 - (row + 0.5) / TEX_H) * Math.PI;
    const cl = Math.cos(lat);
    const sl = Math.sin(lat);
    for (let col = 0; col < TEX_W; col++) {
      const lon = ((col + 0.5) / TEX_W - 0.5) * TWO_PI;
      const px = cl * Math.sin(lon);
      const py = sl;
      const pz = cl * Math.cos(lon);
      const i = row * TEX_W + col;

      const height = fbm(px * 2.2 + 11.3, py * 2.2 + 3.7, pz * 2.2 + 7.9, 5);
      const moist = fbm(px * 3.1 + 5.1, py * 3.1 + 9.2, pz * 3.1 + 2.4, 4);
      const iceNoise = fbm(px * 5 + 1, py * 5 + 2, pz * 5 + 3, 3);
      const ice = smoothstep(0.84, 0.92, Math.abs(py) + (iceNoise - 0.5) * 0.14);
      cloud[i] = smoothstep(0.52, 0.66, fbm(px * 3.4 + 31, py * 3.4 + 17, pz * 3.4 + 23, 4));

      let r: number;
      let g: number;
      let b: number;
      const isOcean = height < 0.5;
      if (isOcean) {
        const k = smoothstep(0.4, 0.5, height);
        r = mix(0.02, 0.1, k);
        g = mix(0.1, 0.5, k);
        b = mix(0.3, 0.72, k);
      } else {
        const lowR = mix(0.16, 0.3, smoothstep(0.52, 0.62, moist));
        const lowG = mix(0.38, 0.46, smoothstep(0.52, 0.62, moist));
        const lowB = mix(0.16, 0.2, smoothstep(0.52, 0.62, moist));
        const desert = 1 - smoothstep(0.38, 0.46, moist);
        const rock = smoothstep(0.66, 0.74, height);
        r = mix(mix(lowR, 0.72, desert), 0.44, rock);
        g = mix(mix(lowG, 0.6, desert), 0.42, rock);
        b = mix(mix(lowB, 0.38, desert), 0.4, rock);
      }
      r = mix(r, 0.95, ice);
      g = mix(g, 0.97, ice);
      b = mix(b, 1, ice);

      ocean[i] = isOcean ? 1 - ice : 0;
      rgb[i * 3] = r;
      rgb[i * 3 + 1] = g;
      rgb[i * 3 + 2] = b;
    }
  }
  return { rgb, ocean, cloud };
}

interface Disc {
  frac: Float32Array;
  row: Uint16Array;
  ndl: Float32Array;
  ndh: Float32Array;
  rim: Float32Array;
  alpha: Float32Array;
}

function buildDisc(): Disc {
  const count = EARTH_PX * EARTH_PX;
  const disc: Disc = {
    frac: new Float32Array(count),
    row: new Uint16Array(count),
    ndl: new Float32Array(count),
    ndh: new Float32Array(count),
    rim: new Float32Array(count),
    alpha: new Float32Array(count),
  };

  for (let py = 0; py < EARTH_PX; py++) {
    for (let px = 0; px < EARTH_PX; px++) {
      const i = py * EARTH_PX + px;
      const x = ((px + 0.5) / EARTH_PX) * 2 - 1;
      const y = 1 - ((py + 0.5) / EARTH_PX) * 2;
      const r = Math.hypot(x, y);
      if (r >= 1) continue;
      const z = Math.sqrt(1 - r * r);
      const lon = Math.atan2(x, z);
      const lat = Math.asin(y);

      disc.frac[i] = lon / TWO_PI + 0.5;
      disc.row[i] = Math.min(TEX_H - 1, Math.max(0, Math.floor((0.5 - lat / Math.PI) * TEX_H)));
      disc.ndl[i] = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
      disc.ndh[i] = x * HALF[0] + y * HALF[1] + z * HALF[2];
      disc.rim[i] = Math.pow(1 - z, 2.6);
      disc.alpha[i] = Math.min(1, (1 - r) * (EARTH_PX / 2));
    }
  }
  return disc;
}

function wrapColumn(value: number): number {
  const w = value - Math.floor(value);
  return Math.min(TEX_W - 1, Math.floor(w * TEX_W));
}

function clampByte(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v * 255)));
}

export interface Earth {
  render(data: Uint8ClampedArray, t: number): void;
}

export function buildEarth(): Earth {
  const surface = buildSurface();
  const disc = buildDisc();
  const count = EARTH_PX * EARTH_PX;

  return {
    render(data, t) {
      const angle = (t / SPIN_SECONDS) * TWO_PI;
      const cloudAngle = angle + t * CLOUD_DRIFT_RAD_PER_SEC;
      for (let i = 0; i < count; i++) {
        const o = i * 4;
        const alpha = disc.alpha[i];
        if (alpha === 0) {
          data[o + 3] = 0;
          continue;
        }

        const rowBase = disc.row[i] * TEX_W;
        const frac = disc.frac[i];
        const texel = rowBase + wrapColumn(frac + angle / TWO_PI);
        const cover = surface.cloud[rowBase + wrapColumn(frac + cloudAngle / TWO_PI)];
        const ndl = disc.ndl[i];
        const diffuse = Math.max(0, ndl);
        const lit = AMBIENT + diffuse * 0.95;

        const t3 = texel * 3;
        const baseR = surface.rgb[t3] * (1 - cover) + CLOUD_RGB * cover;
        const baseG = surface.rgb[t3 + 1] * (1 - cover) + CLOUD_RGB * cover;
        const baseB = surface.rgb[t3 + 2] * (1 - cover) + CLOUD_RGB * cover;

        const spec =
          ndl > 0
            ? Math.pow(Math.max(disc.ndh[i], 0), 40) * 0.8 * surface.ocean[texel] * (1 - cover)
            : 0;
        const rimAmount = disc.rim[i] * (0.25 + 0.75 * diffuse) * 0.6;

        data[o] = clampByte(baseR * lit + spec + ATMOSPHERE_RGB[0] * rimAmount);
        data[o + 1] = clampByte(baseG * lit + spec + ATMOSPHERE_RGB[1] * rimAmount);
        data[o + 2] = clampByte(baseB * lit + spec + ATMOSPHERE_RGB[2] * rimAmount);
        data[o + 3] = Math.round(alpha * 255);
      }
    },
  };
}
