
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, MoreHorizontal } from "lucide-react";
import { FinancialsEntryDialog } from "@/components/FinancialsEntryDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";


// Mock data
const initialExpenses = [
  { id: "EXP001", date: "2024-05-20", description: "Beli bahan baku kopi", amount: 500000 },
  { id: "EXP002", date: "2024-05-21", description: "Bayar listrik", amount: 300000 },
];

const initialCapital = [
  { id: "CAP001", date: "2024-05-01", description: "Modal awal bulan", amount: 5000000 },
];

export type FinancialEntry = { id: string; date: string; description: string; amount: number };

export default function FinancialsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
    const [entryToDelete, setEntryToDelete] = React.useState<{ entry: FinancialEntry, type: 'capital' | 'expense' } | null>(null);
    const [entryToEdit, setEntryToEdit] = React.useState<{ entry: FinancialEntry, type: 'capital' | 'expense' } | null>(null);
    const [dialogType, setDialogType] = React.useState<'capital' | 'expense'>('capital');
    
    const [expenses, setExpenses] = React.useState<FinancialEntry[]>([]);
    const [capital, setCapital] = React.useState<FinancialEntry[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

    const router = useRouter();
    const { toast } = useToast();

    const saveDataToStorage = React.useCallback((data: { capital?: FinancialEntry[], expenses?: FinancialEntry[] }) => {
        if (data.capital) {
            localStorage.setItem("capital", JSON.stringify(data.capital));
        }
        if (data.expenses) {
            localStorage.setItem("expenses", JSON.stringify(data.expenses));
        }
        window.dispatchEvent(new Event('storage'));
    }, []);

    const loadDataFromStorage = React.useCallback(() => {
        const storedCapital = localStorage.getItem("capital");
        setCapital(storedCapital ? JSON.parse(storedCapital) : []);
        
        const storedExpenses = localStorage.getItem("expenses");
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
        
        const storedTransactions = localStorage.getItem("transactions");
        setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
    }, []);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadDataFromStorage();
            
            // Initialize with default data if local storage is empty
            if (!localStorage.getItem("capital")) {
                saveDataToStorage({ capital: initialCapital });
            }
            if (!localStorage.getItem("expenses")) {
                saveDataToStorage({ expenses: initialExpenses });
            }

            window.addEventListener('storage', loadDataFromStorage);
            return () => {
                window.removeEventListener('storage', loadDataFromStorage);
            }
        }
    }, [router, loadDataFromStorage, saveDataToStorage]);
    
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

    const handleOpenDialog = (type: 'capital' | 'expense') => {
        setEntryToEdit(null);
        setDialogType(type);
        setDialogOpen(true);
    };
    
    const handleOpenEditDialog = (entry: FinancialEntry, type: 'capital' | 'expense') => {
        setDialogType(type);
        setEntryToEdit({ entry, type });
        setDialogOpen(true);
    };
    
    const handleOpenDeleteAlert = (entry: FinancialEntry, type: 'capital' | 'expense') => {
        setEntryToDelete({ entry, type });
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!entryToDelete) return;

        const { entry, type } = entryToDelete;
        let updatedList;

        if (type === 'capital') {
            updatedList = capital.filter(c => c.id !== entry.id);
            setCapital(updatedList);
            saveDataToStorage({ capital: updatedList });
        } else {
            updatedList = expenses.filter(e => e.id !== entry.id);
            setExpenses(updatedList);
            saveDataToStorage({ expenses: updatedList });
        }

        toast({
            variant: "destructive",
            title: "Catatan Dihapus",
            description: `Catatan "${entry.description}" telah berhasil dihapus.`,
        });
        setDeleteAlertOpen(false);
        setEntryToDelete(null);
    }


    const handleSaveEntry = (description: string, amount: number) => {
        if (entryToEdit) {
            // Update existing entry
            const { entry, type } = entryToEdit;
            const updatedEntry = { ...entry, description, amount, date: new Date().toISOString().split('T')[0] };

            if (type === 'capital') {
                const updatedList = capital.map(c => c.id === entry.id ? updatedEntry : c);
                setCapital(updatedList);
                saveDataToStorage({ capital: updatedList });
            } else {
                const updatedList = expenses.map(e => e.id === entry.id ? updatedEntry : e);
                setExpenses(updatedList);
                saveDataToStorage({ expenses: updatedList });
            }
            toast({ title: "Catatan Diperbarui" });
        } else {
            // Add new entry
            const newEntry = {
                id: `${dialogType.slice(0,3).toUpperCase()}${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description,
                amount,
            };
            if (dialogType === 'capital') {
                const updatedList = [...capital, newEntry];
                setCapital(updatedList);
                saveDataToStorage({ capital: updatedList });
            } else {
                const updatedList = [...expenses, newEntry];
                setExpenses(updatedList);
                saveDataToStorage({ expenses: updatedList });
            }
            toast({ title: "Catatan Ditambahkan" });
        }
        setEntryToEdit(null);
    };

    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

  return (
    <>
    <AdminLayout>
      <div className="p-4 md:p-8 grid gap-8">
        <div className="grid md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">Dari transaksi penjualan</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Termasuk bahan baku & operasional</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
                     <p className="text-xs text-muted-foreground">Total Pemasukan - Total Pengeluaran</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
            <CardHeader>
                <CardTitle>Catatan Modal</CardTitle>
                <CardDescription>Riwayat penambahan modal.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('capital')}><PlusCircle className="mr-2 h-4 w-4"/> Tambah Modal</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {capital.map((cap) => (
                        <TableRow key={cap.id}>
                            <TableCell>{cap.date}</TableCell>
                            <TableCell>{cap.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(cap.amount)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenEditDialog(cap, 'capital')}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenDeleteAlert(cap, 'capital')} className="text-destructive focus:text-destructive">Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Catatan Pengeluaran</CardTitle>
                <CardDescription>Riwayat pengeluaran toko.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog('expense')}><PlusCircle className="mr-2 h-4 w-4"/> Tambah Pengeluaran</Button>
                </div>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((exp) => (
                        <TableRow key={exp.id}>
                            <TableCell>{exp.date}</TableCell>
                            <TableCell>{exp.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(exp.amount)}</TableCell>
                             <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenEditDialog(exp, 'expense')}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenDeleteAlert(exp, 'expense')} className="text-destructive focus:text-destructive">Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
    <FinancialsEntryDialog
        isOpen={isDialogOpen}
        onClose={() => {
            setDialogOpen(false);
            setEntryToEdit(null);
        }}
        type={dialogType}
        onSave={handleSaveEntry}
        existingData={entryToEdit?.entry}
    />
     <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus catatan
                    <span className="font-bold"> "{entryToDelete?.entry.description}" </span>
                    secara permanen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Ya, Hapus</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
