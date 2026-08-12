import { SenderProfile } from "./types";

const PROFILE_KEY = "invoice-generator:profile:v1";
const DESIGN_KEY = "invoice-generator:design:v1";

export function loadProfile(): SenderProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SenderProfile;
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

export function loadDesignPrefs(): { theme?: string; accentColor?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DESIGN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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
