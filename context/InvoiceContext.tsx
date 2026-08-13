"use client";

import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { InvoiceAction, createInitialState, invoiceReducer } from "@/lib/invoiceReducer";
import { InvoiceState, SenderProfile, ThemeName } from "@/lib/types";
import { loadProfile, loadDesignPrefs, saveDesignPrefs } from "@/lib/storage";
import { readProfileFromLocationHash, clearLocationHash } from "@/lib/shareLink";

interface InvoiceContextValue {
  state: InvoiceState;
  dispatch: Dispatch<InvoiceAction>;
  pendingLinkProfile: SenderProfile | null;
  acceptPendingLink: () => void;
  dismissPendingLink: () => void;
  logoAccent: string;
  setLogoAccent: (hex: string) => void;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

// The app renders client-side only (page.tsx disables SSR), so the initial
// state can be hydrated synchronously from localStorage in the reducer's lazy
// initializer — no mount effect, no flash of an empty form. A profile carried
// in the URL hash is NOT auto-applied: it is surfaced as pendingLinkProfile
// and only dispatched after the user confirms, so a crafted link can never
// overwrite the saved profile without consent.
function createHydratedState(): InvoiceState {
  const base = createInitialState();
  const savedProfile = loadProfile();
  const prefs = loadDesignPrefs();
  return {
    ...base,
    profile: savedProfile ?? base.profile,
    design: {
      theme: (prefs?.theme as ThemeName) ?? base.design.theme,
      accentColor: prefs?.accentColor ?? base.design.accentColor,
    },
  };
}

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(invoiceReducer, undefined, createHydratedState);
  const [pendingLinkProfile, setPendingLinkProfile] = useState<SenderProfile | null>(() =>
    readProfileFromLocationHash(),
  );
  const [logoAccent, setLogoAccent] = useState("");

  useEffect(() => {
    saveDesignPrefs({ theme: state.design.theme, accentColor: state.design.accentColor });
  }, [state.design.theme, state.design.accentColor]);

  const acceptPendingLink = () => {
    if (pendingLinkProfile) {
      dispatch({ type: "HYDRATE_PROFILE", profile: pendingLinkProfile });
    }
    setPendingLinkProfile(null);
    clearLocationHash();
  };

  const dismissPendingLink = () => {
    setPendingLinkProfile(null);
    clearLocationHash();
  };

  return (
    <InvoiceContext.Provider
      value={{
        state,
        dispatch,
        pendingLinkProfile,
        acceptPendingLink,
        dismissPendingLink,
        logoAccent,
        setLogoAccent,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice(): InvoiceContextValue {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
}
