import { LineItem } from "./types";

function clampDiscount(pct: number): number {
  if (!Number.isFinite(pct)) return 0;
  return Math.min(100, Math.max(0, pct));
}

export function lineGrossAmount(item: LineItem): number {
  const qty = Number.isFinite(item.qty) ? item.qty : 0;
  const rate = Number.isFinite(item.rate) ? item.rate : 0;
  return qty * rate;
}

export function lineDiscountAmount(item: LineItem): number {
  return (lineGrossAmount(item) * clampDiscount(item.discountPercent)) / 100;
}

export function lineAmount(item: LineItem): number {
  return lineGrossAmount(item) - lineDiscountAmount(item);
}

/** Sum of line amounts after each line's own discount, before the overall invoice discount. */
export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

/** The invoice-level discount applied on top of the (already line-discounted) subtotal. */
export function overallDiscountAmount(items: LineItem[], overallDiscountPercent: number): number {
  return (subtotal(items) * clampDiscount(overallDiscountPercent)) / 100;
}

/** Subtotal after both line discounts and the overall discount — the base tax is computed on. */
export function netAfterDiscounts(items: LineItem[], overallDiscountPercent: number): number {
  return subtotal(items) - overallDiscountAmount(items, overallDiscountPercent);
}

export function taxAmount(items: LineItem[], taxRate: number, overallDiscountPercent: number): number {
  const rate = Number.isFinite(taxRate) ? taxRate : 0;
  return (netAfterDiscounts(items, overallDiscountPercent) * rate) / 100;
}

export function grandTotal(items: LineItem[], taxRate: number, overallDiscountPercent: number): number {
  return (
    netAfterDiscounts(items, overallDiscountPercent) + taxAmount(items, taxRate, overallDiscountPercent)
  );
}
