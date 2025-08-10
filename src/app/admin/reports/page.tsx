
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for transaction reports
const transactions = [
  { id: "TRX001", date: "2024-05-20", total: 150000, items: 3, operator: "Kasir Pagi" },
  { id: "TRX002", date: "2024-05-20", total: 75000, items: 2, operator: "Kasir Pagi" },
  { id: "TRX003", date: "2024-05-21", total: 220000, items: 5, operator: "Kasir Malam" },
];


export default function ReportsPage() {
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
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Laporan Transaksi</CardTitle>
                    <CardDescription>Lihat riwayat semua transaksi yang telah terjadi.</CardDescription>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Laporan
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah Item</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((trx) => (
                    <TableRow key={trx.id}>
                        <TableCell className="font-medium">{trx.id}</TableCell>
                        <TableCell>{trx.date}</TableCell>
                        <TableCell>{trx.items}</TableCell>
                        <TableCell>{trx.operator}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trx.total)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <TableCaption>Total {transactions.length} transaksi.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
