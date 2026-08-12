import {
  Address,
  ClientInfo,
  DesignSettings,
  InvoiceMeta,
  InvoiceState,
  LineItem,
  PaymentDetails,
  SenderProfile,
  emptyClient,
  emptyProfile,
} from "./types";
import { generateInvoiceNumber, generateLineItemId, todayISO, addDaysISO } from "./id";

export type InvoiceAction =
  | { type: "SET_PROFILE"; patch: Partial<SenderProfile> }
  | { type: "SET_PROFILE_ADDRESS"; patch: Partial<Address> }
  | { type: "SET_PROFILE_PAYMENT"; patch: Partial<PaymentDetails> }
  | { type: "SET_LOGO"; dataUrl: string }
  | { type: "SET_CLIENT"; patch: Partial<ClientInfo> }
  | { type: "ADD_ITEM" }
  | { type: "UPDATE_ITEM"; id: string; patch: Partial<LineItem> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SET_TAX"; label?: string; rate?: number }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SET_META"; patch: Partial<InvoiceMeta> }
  | { type: "SET_DESIGN"; patch: Partial<DesignSettings> }
  | { type: "HYDRATE_PROFILE"; profile: SenderProfile }
  | { type: "CLEAR_PROFILE" };

export function createInitialState(): InvoiceState {
  return {
    profile: emptyProfile,
    client: emptyClient,
    items: [{ id: generateLineItemId(), description: "", qty: 1, rate: 0 }],
    taxLabel: "Tax",
    taxRate: 0,
    notes: "",
    meta: {
      invoiceNumber: generateInvoiceNumber(),
      currency: "USD",
      issueDate: todayISO(),
      dueDate: addDaysISO(15),
    },
    design: {
      theme: "aurora",
      accentColor: "#5B4CF0",
    },
  };
}

export function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "SET_PROFILE_ADDRESS":
      return {
        ...state,
        profile: { ...state.profile, address: { ...state.profile.address, ...action.patch } },
      };
    case "SET_PROFILE_PAYMENT":
      return {
        ...state,
        profile: { ...state.profile, payment: { ...state.profile.payment, ...action.patch } },
      };
    case "SET_LOGO":
      return { ...state, profile: { ...state.profile, logoDataUrl: action.dataUrl } };
    case "SET_CLIENT":
      return { ...state, client: { ...state.client, ...action.patch } };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, { id: generateLineItemId(), description: "", qty: 1, rate: 0 }],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      };
    case "REMOVE_ITEM":
      if (state.items.length <= 1) {
        return {
          ...state,
          items: [{ id: generateLineItemId(), description: "", qty: 1, rate: 0 }],
        };
      }
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "SET_TAX":
      return {
        ...state,
        taxLabel: action.label ?? state.taxLabel,
        taxRate: action.rate ?? state.taxRate,
      };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "SET_META":
      return { ...state, meta: { ...state.meta, ...action.patch } };
    case "SET_DESIGN":
      return { ...state, design: { ...state.design, ...action.patch } };
    case "HYDRATE_PROFILE":
      return { ...state, profile: action.profile };
    case "CLEAR_PROFILE":
      return { ...state, profile: emptyProfile };
    default:
      return state;
  }
}
