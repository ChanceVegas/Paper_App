import type { MaterialId, PatternId } from "./types";

export const PATTERNS: { id: PatternId; name: string }[] = [
  { id: "terrazzo", name: "Terrazzo" },
  { id: "botanical", name: "Botanical" },
  { id: "cathedral", name: "Cathedral Stripe" },
  { id: "scallop", name: "Scallop" },
  { id: "trellis", name: "Trellis" },
  { id: "ditsy", name: "Ditsy Floral" },
];

export const MATERIALS: {
  id: MaterialId;
  name: string;
  rate: number; // $ per billable sqft
  note: string;
}[] = [
  { id: "matte", name: "Matte non-woven", rate: 6.5, note: "Paste-the-wall, breathable" },
  { id: "grasscloth", name: "Grasscloth", rate: 12, note: "Natural fibre, hand-finished" },
  { id: "peel", name: "Peel & stick", rate: 5, note: "Removable, rental-safe" },
  { id: "mural", name: "Custom mural", rate: 14, note: "Grand-format, panel-matched" },
];

/** Orders auto-route to a production studio by material. */
export const STUDIO_FOR: Record<MaterialId, string> = {
  matte: "Meridian Wallcraft",
  grasscloth: "Kestrel Fibre Atelier",
  peel: "Dayline Print Co.",
  mural: "Grand Format House",
};

export const STUDIOS = Object.values(STUDIO_FOR);

/** 6-step client-facing timeline; index === canonical stage int. */
export const STAGES = [
  { key: "reserved", label: "Reserved", detail: "Deposit paid — slot held" },
  { key: "production", label: "In production", detail: "Printing & finishing" },
  { key: "ready", label: "Ready", detail: "Balance due" },
  { key: "paid", label: "Paid", detail: "Fulfilment booked" },
  { key: "dispatched", label: "Dispatched", detail: "Shipped / install scheduled" },
  { key: "complete", label: "Complete", detail: "Delivered / installed" },
] as const;

export const PALETTES: { name: string; colors: string[] }[] = [
  { name: "Fresco", colors: ["#E8DCC8", "#C67B4E", "#7A8B6F", "#3E3A35"] },
  { name: "Porcelain", colors: ["#F2EFE9", "#A3B5C0", "#4E6E8E", "#22303C"] },
  { name: "Verdigris", colors: ["#DCE3D5", "#88A98F", "#3F6952", "#1F3329"] },
  { name: "Ochre", colors: ["#F0E3C0", "#D9A441", "#9C5B2B", "#4A3421"] },
  { name: "Ink Wash", colors: ["#EDEDEB", "#B9BCC0", "#6B7076", "#26282B"] },
  { name: "Rosewood", colors: ["#F4E4DC", "#D8A79A", "#A65B4B", "#52281F"] },
];

export const SCALE_MIN = 0.6;
export const SCALE_MAX = 1.7;
