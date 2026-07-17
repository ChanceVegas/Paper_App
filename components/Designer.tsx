"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MATERIALS,
  PALETTES,
  PATTERNS,
  SCALE_MAX,
  SCALE_MIN,
  STUDIO_FOR,
} from "@/lib/constants";
import {
  OVERAGE,
  billableSqft,
  depositFor,
  priceFor,
  round2,
  usd,
} from "@/lib/pricing";
import type { Design, MaterialId, Order, PatternId } from "@/lib/types";
import { AnimatedPrice, Reveal } from "./motion";
import PaymentModal from "./PaymentModal";
import PreviewFrame from "./PreviewFrame";
import RoomPreview from "./RoomPreview";
import Wallpaper from "./Wallpaper";

export default function Designer({
  placeOrder,
  onPlaced,
}: {
  placeOrder: (design: Design, name: string) => Order;
  onPlaced: (code: string) => void;
}) {
  const [patternId, setPatternId] = useState<PatternId>("terrazzo");
  const [colors, setColors] = useState<string[]>([...PALETTES[0].colors]);
  const [scale, setScale] = useState(1);
  const [material, setMaterial] = useState<MaterialId>("matte");
  const [w, setW] = useState(12);
  const [h, setH] = useState(9);
  const [payOpen, setPayOpen] = useState(false);

  const valid = w > 0 && h > 0;
  const area = valid ? billableSqft(w, h) : 0;
  const rate = MATERIALS.find((m) => m.id === material)!.rate;
  const price = priceFor(area, rate);
  const deposit = depositFor(price);
  const balance = round2(price - deposit);

  const design: Design = {
    patternId,
    colors,
    scale,
    material,
    room: { w, h },
    area,
  };

  const setColor = (i: number, v: string) =>
    setColors((c) => c.map((x, j) => (j === i ? v : x)));

  const num = (v: string) => {
    const n = parseFloat(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  return (
    <div className="designer-grid">
      <Reveal className="panel controls" delay={0.05}>
        <div className="panel-h mono">SPEC 01 — PATTERN</div>
        <div className="sect">
          <div className="patgrid">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                className={`patcell${p.id === patternId ? " on" : ""}`}
                onClick={() => setPatternId(p.id)}
              >
                <span className="patthumb">
                  <Wallpaper patternId={p.id} colors={colors} scale={0.34} />
                </span>
                <span className="patname mono">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-h mono">SPEC 02 — PIGMENT</div>
        <div className="sect">
          <div className="palrow">
            {PALETTES.map((p) => (
              <button
                key={p.name}
                className="palpre"
                title={p.name}
                onClick={() => setColors([...p.colors])}
              >
                {p.colors.map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </button>
            ))}
          </div>
          <div className="swatches">
            {colors.map((c, i) => (
              <label key={i} className="swatch">
                <input
                  type="color"
                  value={c}
                  onChange={(e) => setColor(i, e.target.value)}
                />
                <span className="mono">{`C${i + 1} ${c.toUpperCase()}`}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="panel-h mono">SPEC 03 — REPEAT SCALE</div>
        <div className="sect">
          <div className="sliderrow">
            <input
              type="range"
              min={SCALE_MIN}
              max={SCALE_MAX}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
            <span className="readout mono">×{scale.toFixed(2)}</span>
          </div>
        </div>

        <div className="panel-h mono">SPEC 04 — SUBSTRATE</div>
        <div className="sect matlist">
          {MATERIALS.map((m) => (
            <button
              key={m.id}
              className={`matrow${m.id === material ? " on" : ""}`}
              onClick={() => setMaterial(m.id)}
            >
              <span>
                <span className="matname">{m.name}</span>
                <span className="matnote mono">{m.note}</span>
              </span>
              <span className="matrate mono">{usd(m.rate)}/SQFT</span>
            </button>
          ))}
          <div className="routing mono">
            ROUTES TO — {STUDIO_FOR[material].toUpperCase()}
          </div>
        </div>

        <div className="panel-h mono">SPEC 05 — WALL</div>
        <div className="sect dims">
          <label className="diminput">
            <span className="lbl mono">WIDTH / FT</span>
            <input
              type="number"
              min={1}
              max={80}
              step={0.5}
              value={w || ""}
              onChange={(e) => setW(num(e.target.value))}
            />
          </label>
          <label className="diminput">
            <span className="lbl mono">HEIGHT / FT</span>
            <input
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={h || ""}
              onChange={(e) => setH(num(e.target.value))}
            />
          </label>
        </div>
      </Reveal>

      <section className="stage">
        <Reveal>
          <PreviewFrame
            caption={`PROOF — ${PATTERNS.find((p) => p.id === patternId)!.name.toUpperCase()} / ×${scale.toFixed(2)} / ${STUDIO_FOR[material].toUpperCase()}`}
          >
            <motion.div
              key={patternId}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <RoomPreview design={design} />
            </motion.div>
          </PreviewFrame>
        </Reveal>

        <Reveal delay={0.1}>
        <div className="ticket">
          <div className="ticket-h mono">JOB TICKET — ESTIMATE</div>
          <div className="trow mono">
            <span>WALL</span>
            <span>
              {w || 0} × {h || 0} FT ({round2((w || 0) * (h || 0))} SQFT NET)
            </span>
          </div>
          <div className="trow mono">
            <span>BILLABLE @ ×{OVERAGE} OVERAGE</span>
            <span>{area} SQFT</span>
          </div>
          <div className="trow mono">
            <span>SUBSTRATE RATE</span>
            <span>{usd(rate)}/SQFT</span>
          </div>
          <div className="tdash" />
          <div className="trow trow--total mono">
            <span>TOTAL</span>
            <span><AnimatedPrice value={price} /></span>
          </div>
          <div className="trow mono">
            <span>DEPOSIT DUE NOW (30%)</span>
            <span><AnimatedPrice value={deposit} /></span>
          </div>
          <div className="trow mono">
            <span>BALANCE ON COMPLETION</span>
            <span><AnimatedPrice value={balance} /></span>
          </div>
          <button
            className="btn btn--primary btn--block"
            disabled={!valid}
            onClick={() => setPayOpen(true)}
          >
            Reserve production slot — pay {usd(deposit)}
          </button>
        </div>
        </Reveal>
      </section>

      <AnimatePresence>
        {payOpen && (
          <PaymentModal
            design={design}
            price={price}
            deposit={deposit}
            onPay={(name) => placeOrder(design, name)}
            onClose={() => setPayOpen(false)}
            onView={(code) => {
              setPayOpen(false);
              onPlaced(code);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
