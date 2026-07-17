"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { MATERIALS, PATTERNS, STUDIO_FOR } from "@/lib/constants";
import { usd } from "@/lib/pricing";
import type { Design, Order } from "@/lib/types";

/** Mock deposit payment — no real charge; Stripe lands here later. */
export default function PaymentModal({
  design,
  price,
  deposit,
  onPay,
  onClose,
  onView,
}: {
  design: Design;
  price: number;
  deposit: number;
  onPay: (name: string) => Order;
  onClose: () => void;
  onView: (code: string) => void;
}) {
  const [name, setName] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);

  const pattern = PATTERNS.find((p) => p.id === design.patternId)!;
  const material = MATERIALS.find((m) => m.id === design.material)!;

  return (
    <motion.div
      className="overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      >
        <div className="modal-h">
          <span className="mono">{placed ? "ORDER CONFIRMED" : "DEPOSIT — PRE-ORDER"}</span>
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {placed ? (
          <div className="modal-body">
            <div className="bigcode">{placed.code}</div>
            <p className="mono modal-note">
              DEPOSIT {usd(placed.deposit)} RECEIVED · ROUTED TO{" "}
              {placed.studio.toUpperCase()}
            </p>
            <p className="modal-copy">
              Your production slot is reserved. We&apos;ll notify you when the
              piece is printed and the balance of {usd(placed.balance)} is due.
            </p>
            <button
              className="btn btn--primary btn--block"
              onClick={() => onView(placed.code)}
            >
              View order
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="payrows">
              <div className="trow mono">
                <span>SPEC</span>
                <span>
                  {pattern.name.toUpperCase()} / {material.name.toUpperCase()}
                </span>
              </div>
              <div className="trow mono">
                <span>BILLABLE</span>
                <span>{design.area} SQFT</span>
              </div>
              <div className="trow mono">
                <span>TOTAL</span>
                <span>{usd(price)}</span>
              </div>
              <div className="trow trow--total mono">
                <span>DUE NOW — 30% DEPOSIT</span>
                <span>{usd(deposit)}</span>
              </div>
            </div>

            <label className="field">
              <span className="lbl mono">NAME / PROJECT REFERENCE</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="A. Client — living room"
                autoFocus
              />
            </label>
            <label className="field">
              <span className="lbl mono">CARD NUMBER (MOCK)</span>
              <input defaultValue="4242 4242 4242 4242" className="mono" readOnly />
            </label>
            <div className="fieldrow">
              <label className="field">
                <span className="lbl mono">EXP</span>
                <input defaultValue="12/28" className="mono" readOnly />
              </label>
              <label className="field">
                <span className="lbl mono">CVC</span>
                <input defaultValue="000" className="mono" readOnly />
              </label>
            </div>

            <button
              className="btn btn--primary btn--block"
              disabled={!name.trim()}
              onClick={() => setPlaced(onPay(name.trim()))}
            >
              Pay {usd(deposit)} deposit
            </button>
            <p className="mono modal-note">
              MOCK PAYMENT · AUTO-ROUTES TO {STUDIO_FOR[design.material].toUpperCase()}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
