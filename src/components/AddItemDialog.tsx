
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

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (barcode: string, name: string, price: number, stock: number) => void;
  onOpenScanner: () => void;
  setBarcodeSetter: (setter: (barcode: string) => void) => void;
}

const formSchema = z.object({
  barcode: z.string().min(1, { message: "Kode barang tidak boleh kosong." }),
  name: z.string().min(1, { message: "Nama barang tidak boleh kosong." }),
  price: z.coerce.number().min(0, { message: "Harga harus angka positif." }),
  stock: z.coerce.number().min(0, { message: "Stok harus angka positif." }),
});

export function AddItemDialog({ isOpen, onClose, onSave, onOpenScanner, setBarcodeSetter }: AddItemDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
      name: "",
      price: 0,
      stock: 0,
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
    onSave(values.barcode, values.name, values.price, values.stock);
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
        price: 0,
        stock: 0,
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
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Harga Satuan (IDR)</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" placeholder="cth: 22000" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
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
