"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MATERIALS, PATTERNS, STAGES } from "@/lib/constants";
import { OVERAGE, usd } from "@/lib/pricing";
import type { Fulfilment, Order } from "@/lib/types";
import BalanceModal from "./BalanceModal";
import { EASE, Reveal } from "./motion";
import PreviewFrame from "./PreviewFrame";
import RoomPreview from "./RoomPreview";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function OrderDetail({
  order,
  onBack,
  payBalance,
}: {
  order: Order;
  onBack: () => void;
  payBalance: (code: string, fulfilment: Exclude<Fulfilment, null>, fee: number) => void;
}) {
  const [balOpen, setBalOpen] = useState(false);
  const pattern = PATTERNS.find((p) => p.id === order.design.patternId)!;
  const material = MATERIALS.find((m) => m.id === order.design.material)!;

  const stepDetail = (i: number) => {
    if (i === 4 && order.fulfilment)
      return order.fulfilment === "ship" ? "Shipped" : "Install scheduled";
    if (i === 5 && order.fulfilment)
      return order.fulfilment === "ship" ? "Delivered" : "Installed";
    return STAGES[i].detail;
  };

  return (
    <div>
      <button className="btn btn--sm backbtn" onClick={onBack}>
        <ArrowLeft size={14} strokeWidth={1.75} /> All orders
      </button>

      <div className="detail-grid">
        <div>
          <Reveal>
          <PreviewFrame
            caption={`${order.code} — ${pattern.name.toUpperCase()} / ×${order.design.scale.toFixed(2)} / ${order.studio.toUpperCase()}`}
          >
            <RoomPreview design={order.design} />
          </PreviewFrame>
          </Reveal>

          <div className="panel timelinewrap">
            <div className="panel-h mono">PRODUCTION TIMELINE</div>
            <ol className="timeline">
              {STAGES.map((s, i) => (
                <motion.li
                  key={s.key}
                  className={`tstep${i < order.stage ? " done" : ""}${i === order.stage ? " now" : ""}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.07 }}
                >
                  <span className="tmark" />
                  <span className="tlabel">
                    <span className="tname">
                      {String(i).padStart(2, "0")} — {s.label}
                    </span>
                    <span className="tdetail mono">{stepDetail(i).toUpperCase()}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <Reveal delay={0.08}>
          <div className="ticket">
            <div className="ticket-h mono">JOB TICKET — {order.code}</div>
            <div className="trow mono">
              <span>CLIENT / REF</span>
              <span>{order.name.toUpperCase()}</span>
            </div>
            <div className="trow mono">
              <span>PLACED</span>
              <span>{fmtDate(order.placedAt).toUpperCase()}</span>
            </div>
            <div className="trow mono">
              <span>STUDIO</span>
              <span>{order.studio.toUpperCase()}</span>
            </div>
            <div className="tdash" />
            <div className="trow mono">
              <span>PATTERN</span>
              <span>{pattern.name.toUpperCase()} ×{order.design.scale.toFixed(2)}</span>
            </div>
            <div className="trow mono">
              <span>PIGMENT</span>
              <span className="inkchips">
                {order.design.colors.map((c) => (
                  <i key={c} style={{ background: c }} title={c} />
                ))}
              </span>
            </div>
            <div className="trow mono">
              <span>SUBSTRATE</span>
              <span>
                {material.name.toUpperCase()} @ {usd(material.rate)}/SQFT
              </span>
            </div>
            <div className="trow mono">
              <span>WALL</span>
              <span>
                {order.design.room.w} × {order.design.room.h} FT
              </span>
            </div>
            <div className="trow mono">
              <span>BILLABLE @ ×{OVERAGE}</span>
              <span>{order.design.area} SQFT</span>
            </div>
            <div className="tdash" />
            <div className="trow trow--total mono">
              <span>TOTAL</span>
              <span>{usd(order.price)}</span>
            </div>
            <div className="trow mono">
              <span>DEPOSIT PAID (30%)</span>
              <span>{usd(order.deposit)}</span>
            </div>
            <div className="trow mono">
              <span>{order.stage >= 3 ? "BALANCE PAID" : "BALANCE DUE"}</span>
              <span>{usd(order.balance)}</span>
            </div>
            {order.fulfilment && (
              <div className="trow mono">
                <span>
                  {order.fulfilment === "ship" ? "SHIPPING" : "INSTALLATION"} (PAID)
                </span>
                <span>{usd(order.fulfilmentFee)}</span>
              </div>
            )}

            {order.stage === 2 && (
              <button
                className="btn btn--primary btn--block"
                onClick={() => setBalOpen(true)}
              >
                Pay balance &amp; choose fulfilment
              </button>
            )}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {balOpen && (
          <BalanceModal
            order={order}
            onPay={(f, fee) => payBalance(order.code, f, fee)}
            onClose={() => setBalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
