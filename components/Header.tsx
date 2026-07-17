"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Notice, Role } from "@/lib/types";

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Header({
  role,
  setRole,
  view,
  setView,
  orderCount,
  notices,
  onOpenNotice,
}: {
  role: Role;
  setRole: (r: Role) => void;
  view: "design" | "orders";
  setView: (v: "design" | "orders") => void;
  orderCount: number;
  notices: Notice[];
  onOpenNotice: (n: Notice) => void;
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const unread = notices.filter((n) => !n.read).length;

  return (
    <header className="hdr">
      <div className="hdr-brand">
        <span className="hdr-word">ATELIER</span>
        <span className="hdr-tag mono">CUSTOM WALLCOVERINGS — MADE TO ORDER</span>
        <span className="cmyk" aria-hidden>
          <i style={{ background: "#00AEEF" }} />
          <i style={{ background: "#EC008C" }} />
          <i style={{ background: "#FFF200" }} />
          <i style={{ background: "#111110" }} />
        </span>
      </div>

      <div className="hdr-right">
        {role === "client" && (
          <nav className="hdr-nav">
            <button
              className={`navbtn${view === "design" ? " on" : ""}`}
              onClick={() => setView("design")}
            >
              Design
            </button>
            <button
              className={`navbtn${view === "orders" ? " on" : ""}`}
              onClick={() => setView("orders")}
            >
              Orders{orderCount > 0 ? ` (${orderCount})` : ""}
            </button>
          </nav>
        )}

        <div className="role-toggle mono">
          <button
            className={`seg${role === "client" ? " on" : ""}`}
            onClick={() => setRole("client")}
          >
            CLIENT
          </button>
          <button
            className={`seg${role === "studio" ? " on" : ""}`}
            onClick={() => setRole("studio")}
          >
            STUDIO
          </button>
        </div>

        <div className="bellwrap">
          <button
            className="iconbtn bell"
            onClick={() => setBellOpen((b) => !b)}
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.75} />
            <AnimatePresence>
              {unread > 0 && (
                <motion.span
                  key="dot"
                  className="bell-dot mono"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  {unread}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <AnimatePresence>
          {bellOpen && (
            <motion.div
              className="notif-pop"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              style={{ transformOrigin: "top right" }}
            >
              <div className="panel-h mono">NOTIFICATIONS — {notices.length}</div>
              {notices.length === 0 ? (
                <div className="notif-empty mono">NOTHING YET</div>
              ) : (
                notices.map((n) => (
                  <button
                    key={n.id}
                    className={`notif-item${n.read ? "" : " unread"}`}
                    onClick={() => {
                      setBellOpen(false);
                      onOpenNotice(n);
                    }}
                  >
                    <span className="mono notif-code">
                      {n.code} · {fmtTime(n.at)}
                    </span>
                    <span className="notif-text">{n.text}</span>
                  </button>
                ))
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
