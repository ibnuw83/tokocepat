
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Download, CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALL_CASHIERS_VALUE = "ALL_CASHIERS";

export default function ReportsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);
    const [uniqueOperators, setUniqueOperators] = React.useState<string[]>([]);
    
    // Filter states
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
    const [selectedOperator, setSelectedOperator] = React.useState<string>("");

    const router = useRouter();
    const { toast } = useToast();

    const loadTransactions = React.useCallback(() => {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
            const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
            setTransactions(parsedTransactions);
            const operators = [...new Set(parsedTransactions.map(t => t.operator))];
            setUniqueOperators(operators);
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
    
    // Effect for filtering
    React.useEffect(() => {
        let items = [...transactions];

        if (selectedDate) {
            items = items.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
        }

        if (selectedOperator) {
            items = items.filter(t => t.operator === selectedOperator);
        }

        setFilteredTransactions(items);
    }, [selectedDate, selectedOperator, transactions]);


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

    const resetFilters = () => {
        setSelectedDate(undefined);
        setSelectedOperator("");
    }
    
    const handleDownload = () => {
        try {
            // Download the filtered data
            const dataToDownload = filteredTransactions.length > 0 ? filteredTransactions : transactions;
            const jsonString = JSON.stringify(dataToDownload, null, 2);
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

    const handleOperatorChange = (value: string) => {
        if (value === ALL_CASHIERS_VALUE) {
            setSelectedOperator("");
        } else {
            setSelectedOperator(value);
        }
    }


  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div>
                    <CardTitle>Laporan Transaksi</CardTitle>
                    <CardDescription>Lihat riwayat semua transaksi yang telah terjadi.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className="w-full sm:w-[240px] justify-start text-left font-normal"
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Select value={selectedOperator || ALL_CASHIERS_VALUE} onValueChange={handleOperatorChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Semua Kasir" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value={ALL_CASHIERS_VALUE}>Semua Kasir</SelectItem>
                            {uniqueOperators.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {(selectedDate || selectedOperator) && (
                         <Button variant="ghost" onClick={resetFilters} size="icon">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reset Filter</span>
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleDownload} disabled={transactions.length === 0} className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                    </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Jumlah Item</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                    <TableRow key={trx.id}>
                        <TableCell className="font-medium">{trx.id}</TableCell>
                        <TableCell>{new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                        <TableCell>{trx.customerName || 'Pelanggan Umum'}</TableCell>
                        <TableCell>{trx.items}</TableCell>
                        <TableCell>{trx.operator}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trx.total)}</TableCell>
                    </TableRow>
                    )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                             {transactions.length === 0 ? "Belum ada riwayat transaksi." : "Tidak ada transaksi yang cocok dengan filter."}
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                <TableCaption>Menampilkan {filteredTransactions.length} dari total {transactions.length} transaksi.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
