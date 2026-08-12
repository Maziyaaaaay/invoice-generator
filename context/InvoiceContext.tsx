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

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(invoiceReducer, undefined, createInitialState);
  const [pendingLinkProfile, setPendingLinkProfile] = useState<SenderProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [logoAccent, setLogoAccent] = useState("");

  useEffect(() => {
    // Load whatever profile is already saved on this device first, so it's
    // never lost — a link's profile (if any) is offered as an optional
    // overlay below, and dismissing it must leave this one in place.
    const saved = loadProfile();
    if (saved) {
      dispatch({ type: "HYDRATE_PROFILE", profile: saved });
    }

    const fromHash = readProfileFromLocationHash();
    if (fromHash) {
      setPendingLinkProfile(fromHash);
    }

    const designPrefs = loadDesignPrefs();
    if (designPrefs?.theme || designPrefs?.accentColor) {
      dispatch({
        type: "SET_DESIGN",
        patch: {
          ...(designPrefs.theme ? { theme: designPrefs.theme as ThemeName } : {}),
          ...(designPrefs.accentColor ? { accentColor: designPrefs.accentColor } : {}),
        },
      });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDesignPrefs({ theme: state.design.theme, accentColor: state.design.accentColor });
  }, [hydrated, state.design.theme, state.design.accentColor]);

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
