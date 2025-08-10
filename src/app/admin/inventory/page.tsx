
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUp, ArrowDown } from "lucide-react";
import { StockAdjustmentDialog } from "@/components/StockAdjustmentDialog";
import { AddItemDialog } from "@/components/AddItemDialog";

// Mock data for inventory
const initialInventoryItems = [
  { id: "ITEM001", name: "Kopi Susu", stock: 50, price: 18000 },
  { id: "ITEM002", name: "Roti Coklat", stock: 35, price: 10000 },
  { id: "ITEM003", name: "Teh Manis", stock: 80, price: 8000 },
  { id: "ITEM004", name: "Donat Gula", stock: 42, price: 7000 },
];

export type InventoryItem = typeof initialInventoryItems[0];

export default function InventoryPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isAdjustmentDialogOpen, setAdjustmentDialogOpen] = React.useState(false);
    const [isAddItemDialogOpen, setAddItemDialogOpen] = React.useState(false);
    const [adjustmentType, setAdjustmentType] = React.useState<"in" | "out">("in");
    const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>(initialInventoryItems);
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

    const handleOpenAdjustmentDialog = (type: "in" | "out") => {
        setAdjustmentType(type);
        setAdjustmentDialogOpen(true);
    }

    const handleStockAdjustment = (itemId: string, quantity: number, notes: string) => {
        setInventoryItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const newStock = adjustmentType === 'in' ? item.stock + quantity : item.stock - quantity;
                    return { ...item, stock: newStock < 0 ? 0 : newStock };
                }
                return item;
            });
        });
    }

    const handleAddNewItem = (name: string, price: number, stock: number) => {
        const newItem: InventoryItem = {
            id: `ITEM${Date.now()}`,
            name,
            price,
            stock
        };
        setInventoryItems(prev => [...prev, newItem]);
    };


  return (
    <>
        <AdminLayout>
        <div className="p-4 md:p-8">
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Manajemen Stok</CardTitle>
                        <CardDescription>Lihat dan kelola stok barang di toko Anda.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleOpenAdjustmentDialog('in')}>
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Barang Masuk
                        </Button>
                        <Button variant="outline" onClick={() => handleOpenAdjustmentDialog('out')}>
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Barang Keluar
                        </Button>
                        <Button onClick={() => setAddItemDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Barang Baru
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>ID Barang</TableHead>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead className="text-right">Jumlah Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right font-semibold">{item.stock}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>Total {inventoryItems.length} jenis barang.</TableCaption>
                </Table>
            </CardContent>
            </Card>
        </div>
        </AdminLayout>
        <StockAdjustmentDialog
            isOpen={isAdjustmentDialogOpen}
            onClose={() => setAdjustmentDialogOpen(false)}
            type={adjustmentType}
            items={inventoryItems}
            onSave={handleStockAdjustment}
        />
        <AddItemDialog
            isOpen={isAddItemDialogOpen}
            onClose={() => setAddItemDialogOpen(false)}
            onSave={handleAddNewItem}
        />
    </>
  );
}
