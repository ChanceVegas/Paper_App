"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { MATERIALS, STAGES } from "@/lib/constants";
import { usd } from "@/lib/pricing";
import type { Order } from "@/lib/types";
import { EASE } from "./motion";
import Wallpaper from "./Wallpaper";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function ClientOrders({
  orders,
  onOpen,
}: {
  orders: Order[];
  onOpen: (code: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="empty panel">
        <div className="panel-h mono">ORDERS — 0 ON FILE</div>
        <p className="modal-copy">No orders yet. Design a wallpaper to get started.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-h mono">ORDERS — {orders.length} ON FILE</div>
      <div className="orders-list">
        {orders.map((o, i) => {
          const material = MATERIALS.find((m) => m.id === o.design.material)!;
          const stage = STAGES[o.stage];
          return (
            <motion.button
              key={o.code}
              className="ordrow"
              onClick={() => onOpen(o.code)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
            >
              <span className="thumb">
                <Wallpaper
                  patternId={o.design.patternId}
                  colors={o.design.colors}
                  scale={0.3}
                />
              </span>
              <span className="ordmain">
                <span className="ordcode mono">{o.code}</span>
                <span className="ordname">{o.name}</span>
                <span className="ordmeta mono">
                  {material.name.toUpperCase()} · {o.design.area} SQFT ·{" "}
                  {o.studio.toUpperCase()} · {fmtDate(o.placedAt)}
                </span>
              </span>
              <span className="ordside">
                <span className={`badge${o.stage === 2 ? " badge--fill" : ""} mono`}>
                  {o.stage === 2 ? "BALANCE DUE" : stage.label.toUpperCase()}
                </span>
                <span className="ordprice mono">{usd(o.price)}</span>
              </span>
              <ArrowRight size={16} strokeWidth={1.75} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
