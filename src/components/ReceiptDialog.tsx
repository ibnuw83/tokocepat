
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
import type { Item, PaymentMethod } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Printer, X, CheckCircle } from "lucide-react";

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentAmount: number;
  changeAmount: number;
  formatCurrency: (amount: number) => string;
  onConfirm: () => void;
  customerName: string;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
}

export function ReceiptDialog({ 
  isOpen, 
  onClose, 
  items, 
  subtotal, 
  discountAmount, 
  total, 
  paymentAmount, 
  changeAmount, 
  formatCurrency, 
  onConfirm, 
  customerName,
  paymentMethod,
  paymentRef
}: ReceiptDialogProps) {
  
  // CSS for thermal printer styling
  const printStyles = `
    @media print {
      @page {
        margin: 0;
        size: 58mm auto; /* Adjust width as needed, 58mm is common */
      }
      body {
        margin: 0;
        background: #fff;
      }
      .print-container {
        padding: 5px;
        font-family: 'Courier New', monospace;
        font-size: 10px; /* Adjust font size for small paper */
        color: #000;
        width: 100%;
      }
      .print-header, .print-footer {
        text-align: center;
      }
      .print-item-list, .print-summary {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .print-item {
        display: flex;
        justify-content: space-between;
      }
      .print-item .item-info {
        display: block;
      }
      .print-separator {
        border-top: 1px dashed #000;
        margin: 10px 0;
      }
      .print-total {
        font-weight: bold;
      }
    }
  `;
  
  const handlePrint = () => {
    // This part is for printing visuals. The actual stock update happens onConfirm.
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const receiptHtml = printContent.querySelector('#receipt-visual')?.innerHTML;
      if (receiptHtml) {
        const printWindow = window.open('', '_blank', 'width=300,height=500');
        printWindow?.document.write(`
          <html>
            <head>
              <title>Cetak Struk</title>
              <style>${printStyles}</style>
            </head>
            <body>
              <div class="print-container">${receiptHtml}</div>
            </body>
          </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => {
             printWindow?.print();
             printWindow?.close();
        }, 250); // Delay to allow content to render
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" id="receipt-content">
          {/* This is the visual representation inside the dialog, not for direct printing anymore */}
          <div id="receipt-visual">
            <div className="print-header">
                <DialogTitle className="text-center text-2xl font-headline">Toko Cepat</DialogTitle>
                <p className="text-center text-sm text-muted-foreground">
                    {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
            </div>
            <Separator className="my-4 print-separator" />
            <div className="text-sm">
                Pelanggan: <span className="font-semibold">{customerName}</span>
            </div>
            <Separator className="my-4 print-separator" />
            <div className="my-4 space-y-2 print-item-list">
            {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm print-item">
                <div>
                    <p className="font-medium item-info">{item.name}</p>
                    <p className="text-muted-foreground item-info">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                </div>
            ))}
            </div>
            <Separator className="my-4 print-separator"/>
            <div className="my-4 space-y-2 print-summary">
            <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between text-sm">
                <p>Diskon</p>
                <p>-{formatCurrency(discountAmount)}</p>
            </div>
            <div className="flex justify-between font-bold text-base print-total">
                <p>Total</p>
                <p>{formatCurrency(total)}</p>
            </div>
             <Separator className="my-2 print-separator"/>
             <div className="flex justify-between text-sm">
                <p>Pembayaran ({paymentMethod})</p>
                <p>{formatCurrency(paymentMethod === 'Tunai' ? paymentAmount : total)}</p>
            </div>
             <div className="flex justify-between text-sm">
                <p>Kembalian</p>
                <p>{formatCurrency(paymentMethod === 'Tunai' ? changeAmount : 0)}</p>
            </div>
            {paymentMethod !== 'Tunai' && paymentRef && (
                <div className="flex justify-between text-sm">
                    <p>No. Referensi</p>
                    <p>{paymentRef}</p>
                </div>
            )}
            </div>
            <Separator className="my-4 print-separator"/>
            <p className="text-center text-xs text-muted-foreground pt-4 print-footer">
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
