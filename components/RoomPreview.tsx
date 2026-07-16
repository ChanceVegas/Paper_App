"use client";

import Wallpaper from "./Wallpaper";
import type { Design } from "@/lib/types";

const fmtFt = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} FT`;

/**
 * Flat-elevation room scene. The papered wall is drawn true to the W×H
 * aspect ratio, and the pattern repeat is sized in real terms: one tile
 * (120 design units) reads as ~1.75 ft on the wall at repeat scale 1.
 */
export default function RoomPreview({ design }: { design: Design }) {
  const { w, h } = design.room;
  const valid = w > 0 && h > 0;
  const W = valid ? w : 12;
  const H = valid ? h : 9;

  const zoneW = 640;
  const zoneH = 340;
  const floorY = 430;
  const k = Math.min(zoneW / W, zoneH / H); // px per foot
  const pw = W * k;
  const ph = H * k;
  const px = 60 + (zoneW - pw) / 2;
  const py = floorY - ph;

  const patternScale = ((k * 1.75) / 120) * design.scale;

  return (
    <svg viewBox="0 0 760 540" className="scene" role="img" aria-label="Room preview">
      {/* adjacent wall */}
      <rect width="760" height="540" fill="#E7E6E2" />

      {/* papered wall */}
      <svg x={px} y={py} width={pw} height={ph}>
        <Wallpaper
          patternId={design.patternId}
          colors={design.colors}
          scale={patternScale}
        />
      </svg>
      <rect x={px} y={py} width={pw} height={ph} fill="none" stroke="#111110" strokeWidth="1" />

      {/* skirting */}
      <rect x={px} y={floorY - 12} width={pw} height={12} fill="#F4F4F2" stroke="#111110" strokeWidth="1" />

      {/* floor */}
      <rect x="0" y={floorY} width="760" height="110" fill="#DBDAD5" />
      <line x1="0" y1={floorY} x2="760" y2={floorY} stroke="#111110" strokeWidth="1.2" />

      {/* credenza */}
      <g stroke="#111110" strokeWidth="1.5" fill="#FBFBFA">
        <rect x="400" y="362" width="176" height="62" />
        <line x1="488" y1="362" x2="488" y2="424" />
        <line x1="436" y1="393" x2="452" y2="393" strokeWidth="2.5" />
        <line x1="524" y1="393" x2="540" y2="393" strokeWidth="2.5" />
        <line x1="410" y1="424" x2="410" y2="438" />
        <line x1="566" y1="424" x2="566" y2="438" />
      </g>

      {/* potted plant */}
      <g stroke="#111110" strokeWidth="1.5" fill="#FBFBFA">
        <path d="M196,438 L188,394 L236,394 L228,438 Z" />
        <g fill="none">
          <path d="M212,394 C212,360 200,346 188,338" />
          <path d="M212,394 C214,356 226,342 240,334" />
          <path d="M212,394 C210,366 206,352 212,330" />
          <ellipse cx="185" cy="336" rx="10" ry="5" transform="rotate(-36 185 336)" />
          <ellipse cx="243" cy="332" rx="10" ry="5" transform="rotate(32 243 332)" />
          <ellipse cx="213" cy="326" rx="10" ry="5" transform="rotate(-84 213 326)" />
        </g>
      </g>

      {/* dimension callouts */}
      <g stroke="#111110" strokeWidth="1">
        <line x1={px} y1={py - 16} x2={px + pw} y2={py - 16} />
        <line x1={px} y1={py - 21} x2={px} y2={py - 11} />
        <line x1={px + pw} y1={py - 21} x2={px + pw} y2={py - 11} />
        <line x1={px + pw + 16} y1={py} x2={px + pw + 16} y2={floorY} />
        <line x1={px + pw + 11} y1={py} x2={px + pw + 21} y2={py} />
        <line x1={px + pw + 11} y1={floorY} x2={px + pw + 21} y2={floorY} />
      </g>
      <text x={px + pw / 2} y={py - 26} textAnchor="middle" className="scene-dim">
        {fmtFt(W)}
      </text>
      <text
        x={px + pw + 30}
        y={py + ph / 2}
        textAnchor="middle"
        className="scene-dim"
        transform={`rotate(-90 ${px + pw + 30} ${py + ph / 2})`}
      >
        {fmtFt(H)}
      </text>
    </svg>
  );
}
