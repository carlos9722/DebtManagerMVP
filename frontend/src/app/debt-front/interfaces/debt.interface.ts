export interface Debt {
  id: string;
  description: string;
  amount: string;
  isPaid: boolean;
  dueDate?: string;
  paidAt?: string | null;
  debtorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDebt {
  description: string;
  amount: number;
  debtorId: string;
  dueDate?: string;
}

export interface UpdateDebt {
  description?: string;
  amount?: number;
  dueDate?: string;
}

