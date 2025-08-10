
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
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
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/lib/types";


export type Customer = {
  id: string;
  name: string;
  phone: string;
};

export default function CustomersPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [customerToDelete, setCustomerToDelete] = React.useState<Customer | null>(null);
    const [customerToEdit, setCustomerToEdit] = React.useState<Customer | null>(null);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            const unsubCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
                const customersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
                setCustomers(customersData);
            });
            
            const unsubTransactions = onSnapshot(collection(db, "transactions"), (snapshot) => {
                const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
                setTransactions(transactionsData);
            });

            return () => {
                unsubCustomers();
                unsubTransactions();
            };
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
    
    const handleAddNewCustomer = async (values: Omit<Customer, 'id'>) => {
        try {
            await addDoc(collection(db, "customers"), values);
            toast({
                title: "Pelanggan Ditambahkan",
                description: `${values.name} telah ditambahkan ke daftar pelanggan.`
            })
        } catch (error) {
            console.error("Error adding customer: ", error);
            toast({ variant: "destructive", title: "Gagal Menambahkan" });
        }
    };
    
    const handleEditCustomer = async (values: Customer) => {
        try {
            const customerRef = doc(db, "customers", values.id);
            await updateDoc(customerRef, { name: values.name, phone: values.phone });
            toast({
                title: "Pelanggan Diperbarui",
                description: `Data untuk ${values.name} telah diperbarui.`
            });
            setCustomerToEdit(null);
        } catch (error) {
            console.error("Error updating customer: ", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui" });
        }
    }

    const handleOpenEditDialog = (customer: Customer) => {
        setCustomerToEdit(customer);
        setEditDialogOpen(true);
    }
    
    const handleOpenDeleteDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;

        const customerTransactionCount = getCustomerTransactionCount(customerToDelete.id);
        if (customerTransactionCount > 0) {
            toast({
                variant: "destructive",
                title: "Gagal Menghapus",
                description: `Pelanggan "${customerToDelete.name}" tidak dapat dihapus karena memiliki riwayat transaksi.`
            });
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
            return;
        }

        try {
            await deleteDoc(doc(db, "customers", customerToDelete.id));
            toast({
                variant: "destructive",
                title: "Pelanggan Dihapus",
                description: `Pelanggan "${customerToDelete.name}" telah berhasil dihapus.`,
            });
        } catch (error) {
             console.error("Error deleting customer: ", error);
            toast({ variant: "destructive", title: "Gagal Menghapus" });
        } finally {
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
        }
    }


    const getCustomerTransactionCount = (customerId: string) => {
        return transactions.filter(t => t.customerId === customerId).length;
    }
    
  return (
    <>
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Data Konsumen</CardTitle>
                    <CardDescription>Lihat dan kelola data pelanggan setia toko Anda.</CardDescription>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Konsumen
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nama Konsumen</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Total Transaksi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{getCustomerTransactionCount(customer.id)} kali</TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Buka menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenEditDialog(customer)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleOpenDeleteDialog(customer)}
                                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    >
                                      Hapus
                                    </DropdownMenuItem>
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
    </AdminLayout>
    <AddCustomerDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddNewCustomer}
    />
    {customerToEdit && (
      <EditCustomerDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
              setEditDialogOpen(false);
              setCustomerToEdit(null);
          }}
          customer={customerToEdit}
          onSave={handleEditCustomer}
      />
    )}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pelanggan
                    <span className="font-bold"> "{customerToDelete?.name}" </span>
                    secara permanen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCustomerToDelete(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>Ya, Hapus</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
