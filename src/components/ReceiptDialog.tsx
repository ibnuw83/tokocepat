"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Printer, X } from "lucide-react";

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  subtotal: number;
  discountAmount: number;
  total: number;
  formatCurrency: (amount: number) => string;
}

export function ReceiptDialog({ isOpen, onClose, items, subtotal, discountAmount, total, formatCurrency }: ReceiptDialogProps) {
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printHtml = printContent.innerHTML;
      document.body.innerHTML = printHtml;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore event listeners
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" id="receipt-content">
        <DialogHeader className="print:text-black">
          <DialogTitle className="text-center text-2xl font-headline">Toko Cepat</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </DialogHeader>
        <Separator />
        <div className="my-4 space-y-2 print:text-black">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="my-4 space-y-2 print:text-black">
          <div className="flex justify-between text-sm">
            <p>Subtotal</p>
            <p>{formatCurrency(subtotal)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Diskon</p>
            <p>-{formatCurrency(discountAmount)}</p>
          </div>
          <div className="flex justify-between font-bold text-base">
            <p>Total</p>
            <p>{formatCurrency(total)}</p>
          </div>
        </div>
        <Separator />
        <p className="text-center text-xs text-muted-foreground pt-4 print:text-black">
          Terima kasih telah berbelanja!
        </p>
        <DialogFooter className="print:hidden">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="transition-transform active:scale-95">
              <X className="mr-2 h-4 w-4" /> Tutup
            </Button>
          </DialogClose>
          <Button onClick={handlePrint} className="transition-transform active:scale-95">
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
