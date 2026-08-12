export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function channelLuminance(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** Picks whichever of black/white ink reads better against the given background color. */
export function getReadableInk(bgHex: string): string {
  const rgb = hexToRgb(bgHex);
  return contrastRatio(rgb, WHITE) >= contrastRatio(rgb, BLACK) ? "#FFFFFF" : "#16181C";
}

/** Darkens a color (via HSL lightness steps) until it passes minRatio contrast against targetBg. */
export function darkenToContrast(hex: string, targetBg = "#FFFFFF", minRatio = 4.5): string {
  const target = hexToRgb(targetBg);
  let rgb = hexToRgb(hex);
  let guard = 0;
  while (contrastRatio(rgb, target) < minRatio && guard < 60) {
    rgb = { r: rgb.r * 0.94, g: rgb.g * 0.94, b: rgb.b * 0.94 };
    guard += 1;
  }
  return rgbToHex(rgb);
}

/**
 * Samples an image on an offscreen canvas and returns the most common
 * saturated, mid-lightness color — used to suggest an accent from a logo.
 */
export function extractDominantColor(img: HTMLImageElement): string {
  try {
    const size = 48;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const lightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (sat < 0.22 || lightness > 0.93 || lightness < 0.08) continue;
      const key = `${Math.round(r / 24)},${Math.round(g / 24)},${Math.round(b / 24)}`;
      const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      bucket.n += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      buckets.set(key, bucket);
    }

    let best: { n: number; r: number; g: number; b: number } | null = null;
    const bucketList = Array.from(buckets.values());
    for (let i = 0; i < bucketList.length; i++) {
      const bucket = bucketList[i];
      if (!best || bucket.n > best.n) best = bucket;
    }
    if (!best) return "";
    return rgbToHex({ r: best.r / best.n, g: best.g / best.n, b: best.b / best.n });
  } catch {
    return "";
  }
}
