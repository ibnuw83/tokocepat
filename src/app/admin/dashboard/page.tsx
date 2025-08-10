
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, TrendingDown, Package, Users, BarChart } from "lucide-react";
import Link from "next/link";
import type { Transaction } from "@/lib/types";
import type { InventoryItem } from "../inventory/page";
import type { Customer } from "../customers/page";

type FinancialEntry = { id: string; date: string; description: string; amount: number };

export default function AdminDashboardPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [stats, setStats] = React.useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        itemVariants: 0,
        totalCustomers: 0,
        totalTransactions: 0,
    });
    const router = useRouter();
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }

    const loadDashboardData = React.useCallback(() => {
        const storedTransactions = localStorage.getItem("transactions");
        const transactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
        
        const storedInventory = localStorage.getItem("inventoryItems");
        const inventory: InventoryItem[] = storedInventory ? JSON.parse(storedInventory) : [];
        
        const storedCustomers = localStorage.getItem("customers");
        const customers: Customer[] = storedCustomers ? JSON.parse(storedCustomers) : [];
        
        // Note: Expenses are managed in financials page state, not localStorage yet.
        // For now, we'll use a default or assume it's zero if not found.
        const storedExpenses = localStorage.getItem("expenses");
        const expenses: FinancialEntry[] = storedExpenses ? JSON.parse(storedExpenses) : [];

        const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        
        setStats({
            totalRevenue,
            totalExpenses,
            netProfit,
            itemVariants: inventory.length,
            totalCustomers: customers.length,
            totalTransactions: transactions.length,
        });
    }, []);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const userRole = sessionStorage.getItem("userRole");
        if (isLoggedIn !== "true" || userRole !== 'Administrator') {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadDashboardData();

            // Listen for storage changes to keep dashboard updated
            window.addEventListener('storage', loadDashboardData);
            return () => {
                window.removeEventListener('storage', loadDashboardData);
            };
        }
    }, [router, loadDashboardData]);
    
    if (!isMounted) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memuat...</span>
                </div>
            </div>
        );
    }

    const dashboardStats = [
        {
            title: "Total Pemasukan",
            value: formatCurrency(stats.totalRevenue),
            description: "Dari semua transaksi",
            icon: TrendingUp,
            href: "/admin/financials"
        },
        {
            title: "Total Pengeluaran",
            value: formatCurrency(stats.totalExpenses),
            description: "Bahan baku & operasional",
            icon: TrendingDown,
            href: "/admin/financials"
        },
        {
            title: "Laba Bersih",
            value: formatCurrency(stats.netProfit),
            description: "Pemasukan - Pengeluaran",
            icon: DollarSign,
            href: "/admin/financials"
        },
        {
            title: "Jenis Barang",
            value: `${stats.itemVariants} Varian`,
            description: "Total di inventaris",
            icon: Package,
            href: "/admin/inventory"
        },
        {
            title: "Total Konsumen",
            value: `${stats.totalCustomers} Pelanggan`,
            description: "Pelanggan terdaftar",
            icon: Users,
            href: "/admin/customers"
        },
        {
            title: "Total Transaksi",
            value: `${stats.totalTransactions} Transaksi`,
            description: "Tercatat sepanjang waktu",
            icon: BarChart,
            href: "/admin/reports"
        },
    ];
    
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Dashboard Administrator</h1>
            <p className="text-muted-foreground">Ringkasan aktivitas dan metrik penting toko Anda.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardStats.map((stat) => (
                 <Link href={stat.href} key={stat.title}>
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
