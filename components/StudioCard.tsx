"use client";

import { MATERIALS, STAGES } from "@/lib/constants";
import { usd } from "@/lib/pricing";
import type { Order } from "@/lib/types";
import Wallpaper from "./Wallpaper";

/** One order on the production board, with its next lifecycle action. */
export default function StudioCard({
  order,
  showStudio,
  advance,
}: {
  order: Order;
  showStudio: boolean;
  advance: (code: string) => void;
}) {
  const material = MATERIALS.find((m) => m.id === order.design.material)!;

  const action = (() => {
    switch (order.stage) {
      case 0:
        return "Start production";
      case 1:
        return "Mark ready";
      case 3:
        return order.fulfilment === "install" ? "Mark install scheduled" : "Mark shipped";
      case 4:
        return order.fulfilment === "install" ? "Mark installed" : "Mark delivered";
      default:
        return null;
    }
  })();

  return (
    <div className="card">
      <div className="card-thumb">
        <Wallpaper
          patternId={order.design.patternId}
          colors={order.design.colors}
          scale={0.32}
        />
      </div>
      <div className="card-top">
        <span className="ordcode mono">{order.code}</span>
        <span className={`badge${order.stage === 2 ? " badge--fill" : ""} mono`}>
          {order.stage === 2 ? "AWAITING $" : STAGES[order.stage].label.toUpperCase()}
        </span>
      </div>
      <div className="card-name">{order.name}</div>
      <div className="card-meta mono">
        {material.name.toUpperCase()} · {order.design.area} SQFT · {usd(order.price)}
      </div>
      {showStudio && <div className="card-meta mono">{order.studio.toUpperCase()}</div>}
      {order.fulfilment && (
        <div className="card-meta mono">
          {order.fulfilment === "ship" ? "FULFIL — SHIP" : "FULFIL — INSTALL"}
        </div>
      )}
      {action ? (
        <button className="btn btn--sm btn--block" onClick={() => advance(order.code)}>
          {action}
        </button>
      ) : order.stage === 2 ? (
        <div className="card-wait mono">CLIENT NOTIFIED — BALANCE PENDING</div>
      ) : (
        <div className="card-wait mono">CLOSED</div>
      )}
    </div>
  );
}
