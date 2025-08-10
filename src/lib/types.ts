
export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
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
}
