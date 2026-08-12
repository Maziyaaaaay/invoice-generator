export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentDetails {
  accountName: string;
  accountNumber: string;
  routingCode: string;
  bankName: string;
  upiOrPaypal: string;
}

export interface SenderProfile {
  businessName: string;
  email: string;
  phone: string;
  address: Address;
  taxId: string;
  payment: PaymentDetails;
  logoDataUrl: string;
}

export interface ClientInfo {
  name: string;
  contactPerson: string;
  email: string;
  city: string;
  country: string;
  taxId: string;
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export type ThemeName = "aurora" | "ledger" | "signature" | "mono";

export interface DesignSettings {
  theme: ThemeName;
  accentColor: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  currency: string;
  issueDate: string;
  dueDate: string;
}

export interface InvoiceState {
  profile: SenderProfile;
  client: ClientInfo;
  items: LineItem[];
  taxLabel: string;
  taxRate: number;
  notes: string;
  meta: InvoiceMeta;
  design: DesignSettings;
}

export const emptyAddress: Address = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export const emptyPayment: PaymentDetails = {
  accountName: "",
  accountNumber: "",
  routingCode: "",
  bankName: "",
  upiOrPaypal: "",
};

export const emptyProfile: SenderProfile = {
  businessName: "",
  email: "",
  phone: "",
  address: emptyAddress,
  taxId: "",
  payment: emptyPayment,
  logoDataUrl: "",
};

export const emptyClient: ClientInfo = {
  name: "",
  contactPerson: "",
  email: "",
  city: "",
  country: "",
  taxId: "",
};
