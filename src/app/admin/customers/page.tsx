
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial customers, will be replaced by localStorage
const initialCustomers = [
  { id: "CUS001", name: "Budi Santoso", phone: "081234567890" },
  { id: "CUS002", name: "Citra Lestari", phone: "085678901234" },
  { id: "CUS003", name: "Agus Wijaya", phone: "087890123456" },
];

export type Customer = {
  id: string;
  name: string;
  phone: string;
};

export default function CustomersPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const saveCustomersToStorage = React.useCallback((items: Customer[]) => {
        localStorage.setItem("customers", JSON.stringify(items));
        window.dispatchEvent(new Event('storage'));
    }, []);

    const loadDataFromStorage = React.useCallback(() => {
        const savedCustomers = localStorage.getItem("customers");
        if (savedCustomers) {
            setCustomers(JSON.parse(savedCustomers));
        } else {
            setCustomers(initialCustomers);
            saveCustomersToStorage(initialCustomers);
        }
        const savedTransactions = localStorage.getItem("transactions");
        if(savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    }, [saveCustomersToStorage]);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadDataFromStorage();
            window.addEventListener('storage', loadDataFromStorage);
            return () => {
                window.removeEventListener('storage', loadDataFromStorage);
            };
        }
    }, [router, loadDataFromStorage]);
    
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
    
    const handleAddNewCustomer = (values: Omit<Customer, 'id'>) => {
        const newCustomer: Customer = {
            id: `CUS${Date.now()}`,
            ...values
        };
        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        saveCustomersToStorage(updatedCustomers);
        toast({
            title: "Pelanggan Ditambahkan",
            description: `${values.name} telah ditambahkan ke daftar pelanggan.`
        })
    };

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
                                    <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
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
    </>
  );
}
