export interface Debtor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDebtor {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateDebtor {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

