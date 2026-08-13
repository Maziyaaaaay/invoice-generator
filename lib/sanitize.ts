import { SenderProfile, emptyProfile } from "./types";

// Caps applied to untrusted profile data (URL hash, localStorage). Generous
// for real values, small enough to stop multi-megabyte payloads from being
// smuggled into state and re-saved.
const MAX_FIELD = 200;
const MAX_LOGO = 400_000;

function str(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

// Only inline data-URI images are allowed: an http(s) logo URL would make the
// browser fetch a remote resource when the invoice renders, which breaks the
// "nothing leaves your device" guarantee and works as a tracking pixel.
function logoDataUrl(value: unknown): string {
  if (typeof value !== "string" || value.length > MAX_LOGO) return "";
  return /^data:image\/(png|jpeg|gif|webp|avif);base64,[A-Za-z0-9+/=]+$/.test(value) ? value : "";
}

/**
 * Rebuilds a SenderProfile from unknown parsed JSON, keeping only known keys
 * with string values under sane length caps. Anything malformed collapses to
 * the empty-string default rather than throwing.
 */
export function sanitizeProfile(input: unknown): SenderProfile {
  if (typeof input !== "object" || input === null) return emptyProfile;
  const p = input as Record<string, unknown>;
  const address = (typeof p.address === "object" && p.address !== null ? p.address : {}) as Record<string, unknown>;
  const payment = (typeof p.payment === "object" && p.payment !== null ? p.payment : {}) as Record<string, unknown>;

  return {
    businessName: str(p.businessName),
    email: str(p.email),
    phone: str(p.phone),
    address: {
      street: str(address.street),
      city: str(address.city),
      state: str(address.state),
      zip: str(address.zip),
      country: str(address.country),
    },
    taxId: str(p.taxId),
    payment: {
      accountName: str(payment.accountName),
      accountNumber: str(payment.accountNumber),
      routingCode: str(payment.routingCode),
      bankName: str(payment.bankName),
      upiOrPaypal: str(payment.upiOrPaypal),
    },
    logoDataUrl: logoDataUrl(p.logoDataUrl),
  };
}

/** True when the sanitized profile carries at least one non-empty field. */
export function profileHasContent(profile: SenderProfile): boolean {
  return Boolean(
    profile.businessName ||
      profile.email ||
      profile.phone ||
      profile.taxId ||
      profile.logoDataUrl ||
      Object.values(profile.address).some(Boolean) ||
      Object.values(profile.payment).some(Boolean),
  );
}
