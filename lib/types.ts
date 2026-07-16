export type Role = "client" | "studio";

export type PatternId =
  | "terrazzo"
  | "botanical"
  | "cathedral"
  | "scallop"
  | "trellis"
  | "ditsy";

export type MaterialId = "matte" | "grasscloth" | "peel" | "mural";

export type Fulfilment = "ship" | "install" | null;

export interface Design {
  patternId: PatternId;
  colors: string[]; // exactly 4 hex values
  scale: number; // repeat scale, 0.6–1.7
  material: MaterialId;
  room: { w: number; h: number }; // feet
  area: number; // billable sqft = ceil(w * h * 1.15)
}

/**
 * Canonical order lifecycle — stage is an int 0–5:
 * 0 reserved (deposit paid) · 1 production · 2 ready (balance due)
 * 3 paid · 4 dispatched · 5 complete
 */
export interface Order {
  code: string; // WP-####
  name: string;
  design: Design;
  price: number;
  deposit: number;
  balance: number;
  studio: string;
  stage: number;
  fulfilment: Fulfilment;
  fulfilmentFee: number;
  placedAt: string; // ISO datetime
}

export interface Notice {
  id: string;
  code: string; // order code the notice refers to
  text: string;
  at: string; // ISO datetime
  read: boolean;
}
