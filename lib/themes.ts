import { ThemeName } from "./types";

export interface ThemeClasses {
  label: string;
  paper: string;
  heading: string;
  dividerWidth: string;
  dividerStyle: "solid" | "dashed";
  tableHead: string;
  grandTotal: string;
  swatch: string;
}

export const THEMES: Record<ThemeName, ThemeClasses> = {
  aurora: {
    label: "Aurora",
    paper: "font-sans",
    heading: "text-[28px] font-bold tracking-tight",
    dividerWidth: "2px",
    dividerStyle: "solid",
    tableHead: "text-[10px] font-bold uppercase tracking-[0.1em]",
    grandTotal: "text-[22px] font-extrabold tracking-tight",
    swatch: "linear-gradient(135deg,#5B4CF0,#EC4899)",
  },
  ledger: {
    label: "Ledger",
    paper: "font-mono",
    heading: "text-xl font-bold uppercase tracking-[0.12em]",
    dividerWidth: "1px",
    dividerStyle: "dashed",
    tableHead: "text-[10px] font-semibold uppercase tracking-[0.08em]",
    grandTotal: "text-lg font-bold",
    swatch: "repeating-linear-gradient(45deg,#16181C,#16181C 4px,#fff 4px,#fff 8px)",
  },
  signature: {
    label: "Signature",
    paper: "font-serif",
    heading: "text-[32px] font-medium tracking-tight italic",
    dividerWidth: "1px",
    dividerStyle: "solid",
    tableHead: "text-[10px] font-medium uppercase tracking-[0.1em] font-sans",
    grandTotal: "text-2xl font-medium",
    swatch: "#8A5A24",
  },
  mono: {
    label: "Mono",
    paper: "font-sans",
    heading: "text-base font-semibold uppercase tracking-[0.22em]",
    dividerWidth: "2px",
    dividerStyle: "solid",
    tableHead: "text-[10px] font-semibold uppercase tracking-[0.08em]",
    grandTotal: "text-base font-semibold",
    swatch: "#16181C",
  },
};

export const THEME_ORDER: ThemeName[] = ["aurora", "ledger", "signature", "mono"];
