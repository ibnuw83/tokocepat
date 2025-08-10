
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Separator } from "@/components/ui/separator";
import type { DateRange } from "react-day-picker";

// Extend the window interface for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const ALL_CASHIERS_VALUE = "ALL_CASHIERS";

export default function ReportsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);
    const [uniqueOperators, setUniqueOperators] = React.useState<string[]>([]);
    
    // Filter states
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
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

        if (dateRange?.from) {
            items = items.filter(t => {
                const transactionDate = new Date(t.date);
                const fromDate = new Date(dateRange.from!);
                fromDate.setHours(0,0,0,0); // Start of the day

                if(dateRange.to) {
                     const toDate = new Date(dateRange.to);
                     toDate.setHours(23,59,59,999); // End of the day
                     return transactionDate >= fromDate && transactionDate <= toDate;
                }
                // If only 'from' is selected, filter for that single day
                return format(transactionDate, 'yyyy-MM-dd') === format(fromDate, 'yyyy-MM-dd');
            });
        }

        if (selectedOperator) {
            items = items.filter(t => t.operator === selectedOperator);
        }

        setFilteredTransactions(items);
    }, [dateRange, selectedOperator, transactions]);


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
        setDateRange(undefined);
        setSelectedOperator("");
    }
    
    const handleDownload = () => {
        try {
            const doc = new jsPDF();
            const dataToDownload = filteredTransactions.length > 0 ? filteredTransactions : transactions;

            // Add title
            doc.text("Laporan Transaksi", 14, 16);
            doc.setFontSize(10);
            doc.text(`Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, 22);

            // Add table
            doc.autoTable({
                startY: 30,
                head: [['ID Transaksi', 'Tanggal', 'Pelanggan', 'Jumlah Item', 'Operator', 'Total']],
                body: dataToDownload.map(trx => [
                    trx.id,
                    new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                    trx.customerName || 'Umum',
                    trx.items,
                    trx.operator,
                    formatCurrency(trx.total),
                ]),
                headStyles: { fillColor: [56, 30, 114] }, // Primary color
                styles: { halign: 'center' },
                columnStyles: {
                    0: { halign: 'left' },
                    2: { halign: 'left' },
                    5: { halign: 'right' },
                }
            });

            doc.save(`laporan-transaksi-${new Date().toISOString().split('T')[0]}.pdf`);

            toast({
                title: "Unduh Berhasil",
                description: "Laporan transaksi PDF telah berhasil dibuat.",
            });
        } catch (error) {
             console.error("Gagal mengunduh laporan PDF", error);
            toast({
                variant: "destructive",
                title: "Gagal Mengunduh",
                description: "Terjadi kesalahan saat membuat file laporan PDF.",
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
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Laporan Transaksi</CardTitle>
                    <CardDescription>Lihat riwayat semua transaksi yang telah terjadi.</CardDescription>
                </div>
                 <Button variant="outline" onClick={handleDownload} disabled={transactions.length === 0} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh PDF
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col sm:flex-row items-center gap-2 pb-6">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        id="date"
                        variant={"outline"}
                        className="w-full sm:w-auto justify-start text-left font-normal"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y", { locale: id })} -{" "}
                                {format(dateRange.to, "LLL dd, y", { locale: id })}
                            </>
                            ) : (
                                format(dateRange.from, "LLL dd, y", { locale: id })
                            )
                        ) : (
                            <span>Pilih rentang tanggal</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={id}
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
                {(dateRange || selectedOperator) && (
                        <Button variant="ghost" onClick={resetFilters} size="icon">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reset Filter</span>
                    </Button>
                )}
            </div>
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
