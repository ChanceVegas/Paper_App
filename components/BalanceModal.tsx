"use client";

import { useState } from "react";
import { Truck, Wrench, X } from "lucide-react";
import { INSTALL_RATE, SHIP_FLAT, installFee, round2, usd } from "@/lib/pricing";
import type { Fulfilment, Order } from "@/lib/types";

/** Balance + fulfilment payment (mock). Ship = flat fee; install = per sqft. */
export default function BalanceModal({
  order,
  onPay,
  onClose,
}: {
  order: Order;
  onPay: (fulfilment: Exclude<Fulfilment, null>, fee: number) => void;
  onClose: () => void;
}) {
  const [fulfilment, setFulfilment] = useState<Exclude<Fulfilment, null>>("ship");
  const [done, setDone] = useState(false);

  const fee = fulfilment === "ship" ? SHIP_FLAT : installFee(order.design.area);
  const total = round2(order.balance + fee);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <span className="mono">
            {done ? "PAID IN FULL" : `BALANCE — ${order.code}`}
          </span>
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {done ? (
          <div className="modal-body">
            <div className="bigcode">{usd(total)}</div>
            <p className="mono modal-note">PAYMENT RECEIVED · {order.studio.toUpperCase()}</p>
            <p className="modal-copy">
              {fulfilment === "ship"
                ? "Your wallpaper will be dispatched by the studio shortly."
                : "The studio will contact you to schedule installation."}
            </p>
            <button className="btn btn--primary btn--block" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="lbl mono">FULFILMENT</div>
            <div className="fulrow">
              <button
                className={`fulcell${fulfilment === "ship" ? " on" : ""}`}
                onClick={() => setFulfilment("ship")}
              >
                <Truck size={18} strokeWidth={1.75} />
                <span>Ship to me</span>
                <span className="mono">{usd(SHIP_FLAT)} FLAT</span>
              </button>
              <button
                className={`fulcell${fulfilment === "install" ? " on" : ""}`}
                onClick={() => setFulfilment("install")}
              >
                <Wrench size={18} strokeWidth={1.75} />
                <span>Studio install</span>
                <span className="mono">
                  {usd(INSTALL_RATE)}/SQFT × {order.design.area}
                </span>
              </button>
            </div>

            <div className="payrows">
              <div className="trow mono">
                <span>BALANCE (70%)</span>
                <span>{usd(order.balance)}</span>
              </div>
              <div className="trow mono">
                <span>{fulfilment === "ship" ? "SHIPPING" : "INSTALLATION"}</span>
                <span>{usd(fee)}</span>
              </div>
              <div className="trow trow--total mono">
                <span>DUE NOW</span>
                <span>{usd(total)}</span>
              </div>
            </div>

            <label className="field">
              <span className="lbl mono">CARD NUMBER (MOCK)</span>
              <input defaultValue="4242 4242 4242 4242" className="mono" readOnly />
            </label>

            <button
              className="btn btn--primary btn--block"
              onClick={() => {
                onPay(fulfilment, fee);
                setDone(true);
              }}
            >
              Pay {usd(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
