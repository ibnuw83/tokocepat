
"use client";

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScanBarcode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  barcode: z.string().min(1, { message: "Kode barang tidak boleh kosong." }),
  name: z.string().min(1, { message: "Nama barang tidak boleh kosong." }),
  category: z.string().min(1, { message: "Kategori harus dipilih." }),
  costPrice: z.coerce.number().min(0, { message: "Harga harus angka positif." }),
  price: z.coerce.number().min(0, { message: "Harga harus angka positif." }),
  stock: z.coerce.number().min(0, { message: "Stok harus angka positif." }),
  lowStockThreshold: z.coerce.number().min(0, { message: "Batas stok harus angka positif." }),
});

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  onOpenScanner: () => void;
  setBarcodeSetter: (setter: (barcode: string) => void) => void;
}

export function AddItemDialog({ isOpen, onClose, onSave, onOpenScanner, setBarcodeSetter }: AddItemDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
      name: "",
      category: "",
      costPrice: 0,
      price: 0,
      stock: 0,
      lowStockThreshold: 5,
    },
  });

  // Expose the form's setValue function to the parent component
  React.useEffect(() => {
    if (setBarcodeSetter) {
      setBarcodeSetter((barcode: string) => {
        form.setValue("barcode", barcode, { shouldValidate: true });
      });
    }
  }, [form, setBarcodeSetter]);


  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    toast({
        title: "Barang Baru Ditambahkan",
        description: `${values.name} telah berhasil ditambahkan ke dalam stok.`,
    });
    form.reset();
    onClose();
  }

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        barcode: "",
        name: "",
        category: "",
        costPrice: 0,
        price: 0,
        stock: 0,
        lowStockThreshold: 5,
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Barang Baru</DialogTitle>
          <DialogDescription>Masukkan detail untuk barang baru yang akan ditambahkan ke inventaris.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                 <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kode Barang (Barcode)</FormLabel>
                            <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder="Pindai atau masukkan kode..." {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={onOpenScanner}>
                                    <ScanBarcode className="h-4 w-4"/>
                                    <span className="sr-only">Pindai Barcode</span>
                                </Button>
                            </div>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Barang</FormLabel>
                                <FormControl>
                                    <Input placeholder="cth: Kopi Americano" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Minuman">Minuman</SelectItem>
                                        <SelectItem value="Makanan">Makanan</SelectItem>
                                        <SelectItem value="Snack">Snack</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga Awal (Modal)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 15000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga Jual</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 22000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stok Awal</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Batas Stok Rendah</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    