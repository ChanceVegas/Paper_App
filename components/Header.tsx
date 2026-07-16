"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
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
            {unread > 0 && <span className="bell-dot mono">{unread}</span>}
          </button>
          {bellOpen && (
            <div className="notif-pop">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
