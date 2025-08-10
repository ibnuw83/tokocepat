
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


export default function ReportsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const loadTransactions = React.useCallback(() => {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadTransactions();

             // Listen for storage changes from other tabs
            window.addEventListener('storage', loadTransactions);
            return () => {
                window.removeEventListener('storage', loadTransactions);
            };
        }
    }, [router, loadTransactions]);
    
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
    
    const handleDownload = () => {
        try {
            const jsonString = JSON.stringify(transactions, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `laporan-transaksi-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: "Unduh Berhasil",
                description: "Laporan transaksi telah berhasil diunduh.",
            });
        } catch (error) {
             console.error("Gagal mengunduh laporan", error);
            toast({
                variant: "destructive",
                title: "Gagal Mengunduh",
                description: "Terjadi kesalahan saat membuat file laporan.",
            });
        }
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
                <Button variant="outline" onClick={handleDownload} disabled={transactions.length === 0}>
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
                    {transactions.length > 0 ? transactions.map((trx) => (
                    <TableRow key={trx.id}>
                        <TableCell className="font-medium">{trx.id}</TableCell>
                        <TableCell>{new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                        <TableCell>{trx.items}</TableCell>
                        <TableCell>{trx.operator}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trx.total)}</TableCell>
                    </TableRow>
                    )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            Belum ada riwayat transaksi.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                <TableCaption>Total {transactions.length} transaksi.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

    