import { SenderProfile } from "./types";
import { sanitizeProfile, profileHasContent } from "./sanitize";

const PROFILE_KEY = "invoice-generator:profile:v1";
const DESIGN_KEY = "invoice-generator:design:v1";

export function loadProfile(): SenderProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const profile = sanitizeProfile(JSON.parse(raw));
    return profileHasContent(profile) ? profile : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: SenderProfile): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}

const HEX_COLOR = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
const KNOWN_THEMES = ["aurora", "ledger", "signature", "mono"];

export function loadDesignPrefs(): { theme?: string; accentColor?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DESIGN_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    // accentColor is injected into CSS custom properties / inline styles, so
    // only accept a literal hex colour; theme indexes into the THEMES map.
    const theme =
      typeof p.theme === "string" && KNOWN_THEMES.includes(p.theme) ? p.theme : undefined;
    const accentColor =
      typeof p.accentColor === "string" && HEX_COLOR.test(p.accentColor)
        ? p.accentColor
        : undefined;
    if (!theme && !accentColor) return null;
    return { theme, accentColor };
  } catch {
    return null;
  }
}

export function saveDesignPrefs(prefs: { theme: string; accentColor: string }): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DESIGN_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
