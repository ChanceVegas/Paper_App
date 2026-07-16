/**
 * Core business rules — preserve exactly:
 * billable sqft = ceil(W × H × 1.15 overage)
 * price = billable × material rate · deposit = 30% · balance on completion
 * fulfilment: flat-rate shipping, or install priced per billable sqft
 */
export const OVERAGE = 1.15;
export const DEPOSIT_RATE = 0.3;
export const SHIP_FLAT = 85;
export const INSTALL_RATE = 4.5;

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const billableSqft = (w: number, h: number) =>
  Math.ceil(w * h * OVERAGE);

export const priceFor = (area: number, rate: number) => round2(area * rate);

export const depositFor = (price: number) => round2(price * DEPOSIT_RATE);

export const installFee = (area: number) => round2(area * INSTALL_RATE);

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
