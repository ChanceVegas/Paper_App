"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { MATERIALS, STUDIO_FOR } from "@/lib/constants";
import { depositFor, priceFor, round2 } from "@/lib/pricing";
import { SEED_COUNTER, SEED_NOTICES, SEED_ORDERS } from "@/lib/seed";
import type { Design, Fulfilment, Notice, Order, Role } from "@/lib/types";
import ClientOrders from "./ClientOrders";
import Designer from "./Designer";
import Header from "./Header";
import { fadeUp, viewTransition } from "./motion";
import OrderDetail from "./OrderDetail";
import StudioDashboard from "./StudioDashboard";

/**
 * In-memory prototype state (intentional for this phase): orders, mock
 * notifications, WP-#### counter. Resets on refresh. The Order shape maps
 * 1:1 onto the planned DB schema for the backend milestone.
 */
export default function App() {
  const [role, setRole] = useState<Role>("client");
  const [view, setView] = useState<"design" | "orders">("design");
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [notices, setNotices] = useState<Notice[]>(SEED_NOTICES);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [counter, setCounter] = useState(SEED_COUNTER);

  const notify = (code: string, text: string) =>
    setNotices((n) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        code,
        text,
        at: new Date().toISOString(),
        read: false,
      },
      ...n,
    ]);

  const placeOrder = (design: Design, name: string): Order => {
    const rate = MATERIALS.find((m) => m.id === design.material)!.rate;
    const price = priceFor(design.area, rate);
    const deposit = depositFor(price);
    const order: Order = {
      code: `WP-${counter}`,
      name,
      design,
      price,
      deposit,
      balance: round2(price - deposit),
      studio: STUDIO_FOR[design.material],
      stage: 0,
      fulfilment: null,
      fulfilmentFee: 0,
      placedAt: new Date().toISOString(),
    };
    setCounter((c) => c + 1);
    setOrders((o) => [order, ...o]);
    return order;
  };

  /** Studio advances an order to its next lifecycle stage (0→1→2, 3→4→5). */
  const advance = (code: string) => {
    const order = orders.find((o) => o.code === code);
    if (!order) return;
    const next = order.stage + 1;
    setOrders((os) => os.map((o) => (o.code === code ? { ...o, stage: next } : o)));
    if (next === 2)
      notify(
        code,
        `Your wallpaper is printed and ready. Balance of $${order.balance.toFixed(2)} is due to release fulfilment.`,
      );
    if (next === 4)
      notify(
        code,
        order.fulfilment === "install"
          ? "Installation has been scheduled — the studio will confirm a date."
          : "Your wallpaper has shipped.",
      );
    if (next === 5)
      notify(
        code,
        order.fulfilment === "install"
          ? "Installation complete. Enjoy your wall."
          : "Delivered. Enjoy your wall.",
      );
  };

  const payBalance = (
    code: string,
    fulfilment: Exclude<Fulfilment, null>,
    fee: number,
  ) => {
    setOrders((os) =>
      os.map((o) =>
        o.code === code ? { ...o, stage: 3, fulfilment, fulfilmentFee: fee } : o,
      ),
    );
    notify(
      code,
      fulfilment === "ship"
        ? "Balance received. Your order is queued for dispatch."
        : "Balance received. Your order is queued for installation.",
    );
  };

  const openNotice = (n: Notice) => {
    setNotices((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    setRole("client");
    setView("orders");
    setOpenCode(n.code);
  };

  const openOrder = orders.find((o) => o.code === openCode) ?? null;

  const viewKey =
    role === "studio"
      ? "studio"
      : view === "design"
        ? "design"
        : openOrder
          ? `detail-${openOrder.code}`
          : "orders";

  return (
    <MotionConfig reducedMotion="user">
      <div className="shell">
        <Header
        role={role}
        setRole={setRole}
        view={view}
        setView={(v) => {
          setView(v);
          setOpenCode(null);
        }}
          orderCount={orders.length}
          notices={notices}
          onOpenNotice={openNotice}
        />

        <main className="main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={viewTransition}
            >
              {role === "studio" ? (
                <StudioDashboard orders={orders} advance={advance} />
              ) : view === "design" ? (
                <Designer
                  placeOrder={placeOrder}
                  onPlaced={(code) => {
                    setView("orders");
                    setOpenCode(code);
                  }}
                />
              ) : openOrder ? (
                <OrderDetail
                  order={openOrder}
                  onBack={() => setOpenCode(null)}
                  payBalance={payBalance}
                />
              ) : (
                <ClientOrders orders={orders} onOpen={setOpenCode} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="ftr mono">
          ATELIER — PROTOTYPE BUILD · IN-MEMORY STATE · MOCK PAYMENTS
        </footer>
      </div>
    </MotionConfig>
  );
}
