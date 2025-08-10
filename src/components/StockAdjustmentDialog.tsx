
"use client";

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface StockAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'in' | 'out';
  items: { id: string; name: string }[];
  onSave: (itemId: string, quantity: number, notes: string) => void;
}

const formSchema = z.object({
  itemId: z.string().min(1, { message: "Silakan pilih barang." }),
  quantity: z.coerce.number().min(1, { message: "Jumlah minimal 1." }),
  notes: z.string().optional(),
});

export function StockAdjustmentDialog({ isOpen, onClose, type, items, onSave }: StockAdjustmentDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: "",
      quantity: 1,
      notes: "",
    },
  });

  const dialogTitle = type === 'in' ? 'Catat Barang Masuk' : 'Catat Barang Keluar';
  const dialogDescription = type === 'in'
    ? 'Formulir untuk mencatat penambahan stok barang.'
    : 'Formulir untuk mencatat pengurangan stok barang.';
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.itemId, values.quantity, values.notes || "");
    toast({
        title: "Stok Diperbarui",
        description: `Stok untuk barang pilihan telah berhasil diubah.`,
    });
    form.reset();
    onClose();
  }

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        itemId: "",
        quantity: 1,
        notes: "",
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Tanggal Transaksi: <span className="font-semibold text-foreground">{today}</span>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pilih Barang</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="-- Pilih nama barang --" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {items.map(item => (
                                <SelectItem key={item.id} value={item.id}>
                                {item.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jumlah</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catatan (Opsional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="cth: Stok opname bulanan" {...field} />
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
