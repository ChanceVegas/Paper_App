/**
 * Palette helpers carried over from the prototype. `accentFrom` derived a UI
 * accent from the client's pigment choices in the Craft Grid / Maximal Pop
 * directions; the Print Shop chrome is deliberately monochrome, so these are
 * retained for palette utilities (and future print tooling), not UI tinting.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = hex.replace("#", "");
  const full =
    m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0");
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

/** Pick the dominant pigment: most saturated, closest to mid-lightness. */
export function accentFrom(colors: string[]): string {
  let best = colors[0];
  let bestScore = -1;
  for (const c of colors) {
    const { s, l } = hexToHsl(c);
    const score = s * (1 - Math.abs(l - 0.5));
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}
