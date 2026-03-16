// Draw (Lottery draw) types
export interface Draw {
  id: string;
  name: string;
  drawDate: string; // YYYY-MM-DD format
  status: 'open' | 'closed';
  createdAt: string; // ISO 8601 format
}

// Purchase record types
export type NumberType = '2-digit' | '3-digit';

export interface Purchase {
  id: string;
  drawId: string;
  customerName: string;
  numberType: NumberType;
  numberValue: string; // e.g., "45" or "123"
  amount: number;
  createdAt: string; // ISO 8601 format
}

// Summary types for 2-digit numbers
export interface TwoDigitSummary {
  number: string;
  buyerCount: number;
  totalAmount: number;
}

// Summary types for 3-digit numbers
export interface ThreeDigitSummary {
  number: string;
  buyerCount: number;
  totalAmount: number;
}

// Report data
export interface DrawReport {
  draw: Draw;
  totalAmount: number;
  purchaseCount: number;
  uniqueCustomerCount: number;
  highestAmountNumber: string;
  highestAmountValue: number;
  highestCountNumber: string;
  highestCountValue: number;
  twoDigitSummary: TwoDigitSummary[];
  threeDigitSummary: ThreeDigitSummary[];
}

// Form submission types
export interface CreateDrawInput {
  name: string;
  drawDate: string;
}

export interface CreatePurchaseInput {
  customerName: string;
  numberType: NumberType;
  numberValue: string;
  amount: number;
}

export interface UpdatePurchaseInput extends CreatePurchaseInput {
  id: string;
}
