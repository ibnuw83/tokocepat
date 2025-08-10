
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle } from "lucide-react";

// Mock data for financials
const expenses = [
  { id: "EXP001", date: "2024-05-20", description: "Beli bahan baku kopi", amount: 500000 },
  { id: "EXP002", date: "2024-05-21", description: "Bayar listrik", amount: 300000 },
];
const capital = [
  { id: "CAP001", date: "2024-05-01", description: "Modal awal bulan", amount: 5000000 },
];

export default function FinancialsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
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
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 grid gap-8">
        <div className="grid md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(7350000)}</div>
                    <p className="text-xs text-muted-foreground">Dari transaksi penjualan</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(800000)}</div>
                    <p className="text-xs text-muted-foreground">Termasuk bahan baku & operasional</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(6550000)}</div>
                     <p className="text-xs text-muted-foreground">Total Pemasukan - Total Pengeluaran</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Catatan Modal</CardTitle>
                        <CardDescription>Riwayat penambahan modal.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Tambah Modal</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-right">Jumlah</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {capital.map((cap) => (<TableRow key={cap.id}><TableCell>{cap.date}</TableCell><TableCell>{cap.description}</TableCell><TableCell className="text-right">{formatCurrency(cap.amount)}</TableCell></TableRow>))}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Catatan Pengeluaran</CardTitle>
                        <CardDescription>Riwayat pengeluaran toko.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Tambah Pengeluaran</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-right">Jumlah</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {expenses.map((exp) => (<TableRow key={exp.id}><TableCell>{exp.date}</TableCell><TableCell>{exp.description}</TableCell><TableCell className="text-right">{formatCurrency(exp.amount)}</TableCell></TableRow>))}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
