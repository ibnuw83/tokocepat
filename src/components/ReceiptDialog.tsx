
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
import { Printer, X, CheckCircle } from "lucide-react";

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  subtotal: number;
  discountAmount: number;
  total: number;
  formatCurrency: (amount: number) => string;
  onConfirm: () => void;
}

export function ReceiptDialog({ isOpen, onClose, items, subtotal, discountAmount, total, formatCurrency, onConfirm }: ReceiptDialogProps) {
  const handlePrint = () => {
    // This part is for printing visuals. The actual stock update happens onConfirm.
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const receiptHtml = printContent.querySelector('#receipt-visual')?.innerHTML;
      if (receiptHtml) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<div class="print-container">${receiptHtml}</div>`;
        window.print();
        document.body.innerHTML = originalContents;
        // We don't reload here, allowing the user to confirm the transaction.
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" id="receipt-content">
          <div id="receipt-visual">
            <DialogHeader className="print:text-black">
            <DialogTitle className="text-center text-2xl font-headline">Toko Cepat</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
                {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
            </DialogHeader>
            <Separator className="my-4" />
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
            <Separator className="my-4"/>
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
            <Separator className="my-4"/>
            <p className="text-center text-xs text-muted-foreground pt-4 print:text-black">
            Terima kasih telah berbelanja!
            </p>
        </div>
        <DialogFooter className="print:hidden sm:justify-between gap-2 mt-4">
          <Button onClick={handlePrint} variant="outline" className="transition-transform active:scale-95 w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Cetak Struk
          </Button>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 w-full sm:w-auto">
             <DialogClose asChild>
                <Button type="button" variant="secondary" className="transition-transform active:scale-95">
                Batal
                </Button>
            </DialogClose>
            <Button onClick={onConfirm} className="transition-transform active:scale-95 mb-2 sm:mb-0">
                <CheckCircle className="mr-2 h-4 w-4" /> Selesaikan & Mulai Baru
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    