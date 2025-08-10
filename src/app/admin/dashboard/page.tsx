
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, TrendingDown, Package, Users, BarChart } from "lucide-react";
import Link from "next/link";

// Mock data for dashboard
const dashboardStats = [
  {
    title: "Total Pemasukan",
    value: "Rp 7.350.000",
    description: "Bulan ini",
    icon: TrendingUp,
    href: "/admin/financials"
  },
  {
    title: "Total Pengeluaran",
    value: "Rp 800.000",
    description: "Bulan ini",
    icon: TrendingDown,
    href: "/admin/financials"
  },
   {
    title: "Laba Bersih",
    value: "Rp 6.550.000",
    description: "Bulan ini",
    icon: DollarSign,
    href: "/admin/financials"
  },
  {
    title: "Jenis Barang",
    value: "4 Varian",
    description: "Total di inventaris",
    icon: Package,
    href: "/admin/inventory"
  },
  {
    title: "Total Konsumen",
    value: "3 Pelanggan",
    description: "Pelanggan terdaftar",
    icon: Users,
    href: "/admin/customers"
  },
   {
    title: "Total Transaksi",
    value: "3 Transaksi",
    description: "Tercatat hari ini",
    icon: BarChart,
    href: "/admin/reports"
  },
];

export default function AdminDashboardPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const userRole = sessionStorage.getItem("userRole");
        if (isLoggedIn !== "true" || userRole !== 'Administrator') {
            router.push("/login");
        } else {
            setIsMounted(true);
        }
    }, [router]);
    
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
