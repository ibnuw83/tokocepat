import { CreditCard, FileText, Package, BookCopy, Users, Settings, LayoutDashboard, UserCog } from "lucide-react";

export const allMenuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: CreditCard, label: "Kasir" },
  { href: "/admin/inventory", icon: Package, label: "Manajemen Stok" },
  { href: "/admin/financials", icon: BookCopy, label: "Laporan Keuangan" },
  { href: "/admin/reports", icon: FileText, label: "Laporan Transaksi" },
  { href: "/admin/customers", icon: Users, label: "Data Konsumen" },
  { href: "/admin/users", icon: UserCog, label: "Manajemen Pengguna" },
  { href: "/admin/settings", icon: Settings, label: "Pengaturan Toko" },
];

export const cashierMenuItems = [
    { href: "/transactions", icon: CreditCard, label: "Kasir" },
    { href: "/admin/reports", icon: FileText, label: "Laporan Transaksi" },
]
