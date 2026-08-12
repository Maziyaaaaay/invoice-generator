import { LineItem } from "./types";

export function lineAmount(item: LineItem): number {
  const qty = Number.isFinite(item.qty) ? item.qty : 0;
  const rate = Number.isFinite(item.rate) ? item.rate : 0;
  return qty * rate;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

export function taxAmount(items: LineItem[], taxRate: number): number {
  const rate = Number.isFinite(taxRate) ? taxRate : 0;
  return (subtotal(items) * rate) / 100;
}

export function grandTotal(items: LineItem[], taxRate: number): number {
  return subtotal(items) + taxAmount(items, taxRate);
}
