import { SenderProfile } from "./types";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeProfileToHash(profile: SenderProfile): string {
  return utf8ToBase64(JSON.stringify(profile));
}

export function decodeProfileFromHash(hash: string): SenderProfile | null {
  try {
    const parsed = JSON.parse(base64ToUtf8(hash));
    if (parsed && typeof parsed === "object" && "businessName" in parsed) {
      return parsed as SenderProfile;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildPersonalLink(profile: SenderProfile): string {
  if (typeof window === "undefined") return "";
  const encoded = encodeProfileToHash(profile);
  return `${window.location.origin}${window.location.pathname}#p=${encoded}`;
}

export function readProfileFromLocationHash(): SenderProfile | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/[#&]p=([^&]+)/);
  if (!match) return null;
  return decodeProfileFromHash(decodeURIComponent(match[1]));
}

export function clearLocationHash(): void {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", window.location.pathname);
}
