"use client";

/** Bordered proof frame with print registration crosshairs at each corner. */
function RegMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="#111110" strokeWidth="1" />
      <line x1="7" y1="0" x2="7" y2="14" stroke="#111110" strokeWidth="1" />
      <line x1="0" y1="7" x2="14" y2="7" stroke="#111110" strokeWidth="1" />
    </svg>
  );
}

export default function PreviewFrame({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  return (
    <div className="frame">
      <span className="regmark rm-tl"><RegMark /></span>
      <span className="regmark rm-tr"><RegMark /></span>
      <span className="regmark rm-bl"><RegMark /></span>
      <span className="regmark rm-br"><RegMark /></span>
      {children}
      {caption ? <div className="frame-cap mono">{caption}</div> : null}
    </div>
  );
}
