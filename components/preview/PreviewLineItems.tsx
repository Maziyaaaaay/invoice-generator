"use client";

import { LineItem, ThemeName } from "@/lib/types";
import { lineAmount } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";
import { THEMES } from "@/lib/themes";

export function PreviewLineItems({
  items,
  currency,
  theme,
}: {
  items: LineItem[];
  currency: string;
  theme: ThemeName;
}) {
  const visible = items.filter((i) => i.description.trim() || lineAmount(i) > 0);
  const t = THEMES[theme];

  return (
    <table className="mb-4 w-full border-collapse">
      <thead>
        <tr className={t.tableHead} style={{ color: "var(--accent-safe)" }}>
          <th className="w-1/2 border-b border-[var(--line)] pb-2 text-left">Description</th>
          <th className="border-b border-[var(--line)] pb-2 text-right">Qty</th>
          <th className="border-b border-[var(--line)] pb-2 text-right">Rate</th>
          <th className="border-b border-[var(--line)] pb-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {visible.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-4 text-[13px] text-[#9A9E9B]">
              Add what you&apos;re billing for
            </td>
          </tr>
        ) : (
          visible.map((item) => (
            <tr key={item.id} className="avoid-break">
              <td className="border-b border-[var(--line)] py-2.5 pr-3 text-[13.5px] align-top">
                {item.description || "—"}
              </td>
              <td className="tnum border-b border-[var(--line)] py-2.5 text-right text-[13.5px] align-top">
                {item.qty || 0}
              </td>
              <td className="tnum border-b border-[var(--line)] py-2.5 text-right text-[13.5px] align-top">
                {formatMoney(item.rate, currency)}
              </td>
              <td className="tnum border-b border-[var(--line)] py-2.5 text-right text-[13.5px] font-medium align-top">
                {formatMoney(lineAmount(item), currency)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
