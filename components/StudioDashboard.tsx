"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { STUDIOS } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { EASE } from "./motion";
import StudioCard from "./StudioCard";

const LANES: { title: string; stages: number[] }[] = [
  { title: "Incoming", stages: [0] },
  { title: "In production", stages: [1] },
  { title: "Awaiting client payment", stages: [2] },
  { title: "To fulfil", stages: [3] },
  { title: "Completed", stages: [4, 5] },
];

export default function StudioDashboard({
  orders,
  advance,
}: {
  orders: Order[];
  advance: (code: string) => void;
}) {
  const [studio, setStudio] = useState<string>("all");
  const visible =
    studio === "all" ? orders : orders.filter((o) => o.studio === studio);

  return (
    <div>
      <div className="boardbar">
        <div>
          <div className="boardtitle">Production board</div>
          <div className="mono boardsub">
            {visible.length} JOB{visible.length === 1 ? "" : "S"} ·{" "}
            {studio === "all" ? "ALL STUDIOS" : studio.toUpperCase()}
          </div>
        </div>
        <label className="studiosel">
          <span className="lbl mono">STUDIO</span>
          <select value={studio} onChange={(e) => setStudio(e.target.value)}>
            <option value="all">All studios</option>
            {STUDIOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="board">
        {LANES.map((lane, li) => {
          const cards = visible
            .filter((o) => lane.stages.includes(o.stage))
            .sort((a, b) => a.stage - b.stage || a.code.localeCompare(b.code));
          return (
            <motion.div
              key={lane.title}
              className="lane"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: li * 0.06 }}
            >
              <div className="lane-h mono">
                {lane.title.toUpperCase()} — {cards.length}
              </div>
              <div className="lane-cards">
                {cards.length === 0 ? (
                  <div className="lane-empty mono">—</div>
                ) : (
                  cards.map((o) => (
                    <StudioCard
                      key={o.code}
                      order={o}
                      showStudio={studio === "all"}
                      advance={advance}
                    />
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
