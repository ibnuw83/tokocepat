

export type PaymentMethod = 'Tunai' | 'Kartu Debit/Kredit' | 'QRIS/E-Wallet';

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  costPrice: number; // Menambahkan harga pokok
}

export interface Transaction {
  id: string;
  date: string; // ISO string format
  total: number;
  items: number; // Total quantity of items
  operator: string;
  customerId?: string;
  customerName?: string;
  details: Item[];
  paymentMethod: PaymentMethod;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'Administrator' | 'Kasir';
  status: 'active' | 'inactive';
}
