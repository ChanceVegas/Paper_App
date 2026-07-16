import type { Notice, Order } from "./types";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

/**
 * Two demo orders (in-memory prototype phase — state resets on refresh).
 * Figures follow the canonical math: area = ceil(w*h*1.15), deposit = 30%.
 */
export const SEED_ORDERS: Order[] = [
  {
    code: "WP-1042",
    name: "M. Okafor — nursery",
    design: {
      patternId: "ditsy",
      colors: ["#E8DCC8", "#C67B4E", "#7A8B6F", "#3E3A35"],
      scale: 0.8,
      material: "matte",
      room: { w: 10, h: 8 },
      area: 92, // ceil(10*8*1.15)
    },
    price: 598, // 92 × $6.50
    deposit: 179.4,
    balance: 418.6,
    studio: "Meridian Wallcraft",
    stage: 2, // ready — balance due
    fulfilment: null,
    fulfilmentFee: 0,
    placedAt: daysAgo(9),
  },
  {
    code: "WP-1041",
    name: "Harper Lane — dining room",
    design: {
      patternId: "trellis",
      colors: ["#DCE3D5", "#88A98F", "#3F6952", "#1F3329"],
      scale: 1,
      material: "grasscloth",
      room: { w: 12, h: 9 },
      area: 125, // ceil(12*9*1.15)
    },
    price: 1500, // 125 × $12
    deposit: 450,
    balance: 1050,
    studio: "Kestrel Fibre Atelier",
    stage: 1, // in production
    fulfilment: null,
    fulfilmentFee: 0,
    placedAt: daysAgo(12),
  },
];

export const SEED_NOTICES: Notice[] = [
  {
    id: "seed-1",
    code: "WP-1042",
    text: "Your wallpaper is printed and ready. Balance of $418.60 is due to release fulfilment.",
    at: daysAgo(1),
    read: false,
  },
];

export const SEED_COUNTER = 1043;
