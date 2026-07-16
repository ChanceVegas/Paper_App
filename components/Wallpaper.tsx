"use client";

import { useId } from "react";
import type { PatternId } from "@/lib/types";

/**
 * Shared SVG pattern renderer. Each pattern is authored in a fixed tile
 * space (~120 units wide ≈ one repeat) and scaled via patternTransform, so
 * `scale` is a direct multiplier on the repeat size in rendered pixels.
 * Fills its container; safe to nest inside another <svg> (RoomPreview).
 */
export default function Wallpaper({
  patternId,
  colors,
  scale = 1,
}: {
  patternId: PatternId;
  colors: string[];
  scale?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = `wp-${uid}`;
  const [c0, c1, c2, c3] = colors;
  const t = `scale(${scale})`;

  let tile: React.ReactNode = null;
  let tw = 120;
  let th = 120;

  switch (patternId) {
    case "terrazzo":
      tw = 120;
      th = 120;
      tile = (
        <>
          <rect width="120" height="120" fill={c0} />
          <polygon points="10,14 27,7 32,22 16,29" fill={c1} />
          <ellipse cx="70" cy="26" rx="10" ry="6" fill={c2} transform="rotate(-18 70 26)" />
          <polygon points="96,10 113,17 106,33 92,26" fill={c3} />
          <polygon points="40,58 56,50 63,66 46,75" fill={c2} />
          <ellipse cx="102" cy="70" rx="7" ry="11" fill={c1} transform="rotate(24 102 70)" />
          <polygon points="12,92 29,86 34,102 17,110" fill={c3} />
          <ellipse cx="66" cy="102" rx="10" ry="7" fill={c2} transform="rotate(12 66 102)" />
          <polygon points="88,90 100,86 104,97 92,101" fill={c1} />
          <circle cx="48" cy="24" r="3" fill={c3} />
          <circle cx="22" cy="52" r="2.5" fill={c1} />
          <circle cx="112" cy="52" r="3" fill={c2} />
          <circle cx="94" cy="114" r="2.5" fill={c1} />
          <circle cx="40" cy="112" r="2" fill={c3} />
        </>
      );
      break;

    case "botanical":
      tw = 120;
      th = 150;
      tile = (
        <>
          <rect width="120" height="150" fill={c0} />
          <g fill="none" stroke={c2} strokeWidth="2.2">
            <path d="M30,150 C24,112 40,84 32,38" />
            <path d="M92,150 C100,110 82,76 92,18" />
          </g>
          <g fill={c1}>
            <ellipse cx="20" cy="120" rx="11" ry="4.5" transform="rotate(-32 20 120)" />
            <ellipse cx="43" cy="100" rx="11" ry="4.5" transform="rotate(24 43 100)" />
            <ellipse cx="22" cy="76" rx="11" ry="4.5" transform="rotate(-28 22 76)" />
            <ellipse cx="45" cy="56" rx="11" ry="4.5" transform="rotate(30 45 56)" />
            <ellipse cx="82" cy="126" rx="11" ry="4.5" transform="rotate(210 82 126)" />
            <ellipse cx="104" cy="98" rx="11" ry="4.5" transform="rotate(-24 104 98)" />
            <ellipse cx="80" cy="66" rx="11" ry="4.5" transform="rotate(206 80 66)" />
            <ellipse cx="103" cy="42" rx="11" ry="4.5" transform="rotate(-30 103 42)" />
          </g>
          <g fill={c3}>
            <circle cx="33" cy="30" r="3.4" />
            <circle cx="26" cy="22" r="2.6" />
            <circle cx="40" cy="22" r="2.6" />
            <circle cx="92" cy="12" r="3.4" />
            <circle cx="85" cy="5" r="2.6" />
            <circle cx="100" cy="5" r="2.6" />
          </g>
        </>
      );
      break;

    case "cathedral":
      tw = 120;
      th = 96;
      tile = (
        <>
          <rect width="120" height="96" fill={c0} />
          {/* wide band with repeating pointed-arch chain */}
          <rect x="10" width="30" height="96" fill={c1} />
          <g fill="none" stroke={c0} strokeWidth="1.6">
            <path d="M17,44 L17,22 Q25,8 33,22 L33,44 Z" />
            <path d="M17,92 L17,70 Q25,56 33,70 L33,92 Z" />
          </g>
          {/* pinstripes */}
          <rect x="52" width="2" height="96" fill={c3} />
          <rect x="60" width="2" height="96" fill={c3} />
          {/* narrow band */}
          <rect x="76" width="14" height="96" fill={c2} />
          <rect x="102" width="2" height="96" fill={c3} />
          <rect x="110" width="4" height="96" fill={c2} />
        </>
      );
      break;

    case "scallop":
      tw = 120;
      th = 120;
      tile = (
        <>
          <rect width="120" height="120" fill={c0} />
          {/* staggered fish-scale rows; later rows overdraw for the fan effect */}
          {[0, 30, 60, 90, 120].map((y, i) => {
            const odd = i % 2 === 1;
            const fill = odd ? c2 : c1;
            const cxs = odd ? [0, 60, 120] : [30, 90, -30, 150];
            return (
              <g key={y}>
                {cxs.map((cx) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy={y}
                    r="30"
                    fill={fill}
                    stroke={c3}
                    strokeWidth="1.4"
                  />
                ))}
              </g>
            );
          })}
        </>
      );
      break;

    case "trellis":
      tw = 120;
      th = 120;
      tile = (
        <>
          <rect width="120" height="120" fill={c0} />
          <g fill="none" stroke={c1} strokeWidth="5">
            <path d="M0,60 L60,0 L120,60 L60,120 Z" />
          </g>
          <g fill="none" stroke={c2} strokeWidth="1.4">
            <path d="M0,60 L60,0 L120,60 L60,120 Z" transform="translate(60,60) scale(0.82) translate(-60,-60)" />
          </g>
          {/* studs at lattice intersections */}
          {[
            [60, 0],
            [0, 60],
            [120, 60],
            [60, 120],
          ].map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x - 4}
              y={y - 4}
              width="8"
              height="8"
              fill={c2}
              transform={`rotate(45 ${x} ${y})`}
            />
          ))}
          <circle cx="60" cy="60" r="4" fill={c3} />
        </>
      );
      break;

    case "ditsy":
      tw = 120;
      th = 120;
      tile = (
        <>
          <rect width="120" height="120" fill={c0} />
          {(
            [
              [22, 22, c1],
              [78, 12, c2],
              [104, 58, c1],
              [50, 62, c2],
              [16, 88, c2],
              [82, 96, c1],
            ] as [number, number, string][]
          ).map(([x, y, fill], i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx={x}
                  cy={y - 6.5}
                  rx="3.2"
                  ry="6"
                  fill={fill}
                  transform={`rotate(${a} ${x} ${y})`}
                />
              ))}
              <circle cx={x} cy={y} r="2.8" fill={c3} />
            </g>
          ))}
          <circle cx="48" cy="14" r="1.8" fill={c3} />
          <circle cx="108" cy="26" r="1.8" fill={c3} />
          <circle cx="10" cy="52" r="1.8" fill={c3} />
          <circle cx="70" cy="44" r="1.8" fill={c3} />
          <circle cx="34" cy="104" r="1.8" fill={c3} />
          <circle cx="108" cy="108" r="1.8" fill={c3} />
              <circle cx="58" cy="88" r="1.8" fill={c3} />
        </>
      );
      break;
  }

  return (
    <svg width="100%" height="100%" style={{ display: "block" }} aria-hidden>
      <defs>
        <pattern
          id={id}
          width={tw}
          height={th}
          patternUnits="userSpaceOnUse"
          patternTransform={t}
        >
          {tile}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={c0} />
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
