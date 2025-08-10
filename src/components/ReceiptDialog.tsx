
"use client";

import * as React from 'react';
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
import { Printer, CheckCircle } from "lucide-react";
import Image from "next/image";

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
  
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [storeAddress, setStoreAddress] = React.useState("");
  const [logo, setLogo] = React.useState<string | null>(null);
  const [receiptFooter, setReceiptFooter] = React.useState("Terima kasih telah berbelanja!");

  React.useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem("storeName");
      const savedAddress = localStorage.getItem("storeAddress");
      const savedLogo = localStorage.getItem("storeLogo");
      const savedFooter = localStorage.getItem("receiptFooter");

      if (savedName) setStoreName(savedName);
      if (savedAddress) setStoreAddress(savedAddress);
      if (savedLogo) setLogo(savedLogo);
      if (savedFooter) setReceiptFooter(savedFooter);
    }
  }, [isOpen]);

  const printStyles = `
    @media print {
      @page {
        margin: 0;
        size: 80mm auto;
      }
      body {
        margin: 0;
        background: #fff;
      }
      .print-container {
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 11pt;
        color: #000;
        width: 100%;
        line-height: 1.4;
      }
      .print-header, .print-footer {
        text-align: center;
      }
      .print-header img {
        max-width: 40%;
        margin: 0 auto 5px;
      }
      .print-header h1 {
        font-size: 14pt;
        margin: 0;
      }
       .print-header p {
        font-size: 10pt;
        margin: 0;
      }
      .print-item-list, .print-summary {
        margin-top: 8px;
        margin-bottom: 8px;
      }
      .print-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 5px;
      }
      .print-item .item-name {
        word-break: break-all;
      }
      .print-item .item-total-price {
         text-align: right;
      }
      .print-item .item-qty-price {
        font-size: 10pt;
        grid-column: 1 / -1;
      }
      .print-summary-line {
         display: grid;
         grid-template-columns: 1fr max-content;
         gap: 5px;
      }
      .print-summary-line .summary-value {
        text-align: right;
      }
      .print-separator {
        border-top: 1px dashed #000;
        margin: 8px 0;
      }
      .print-total {
        font-weight: bold;
        font-size: 12pt;
      }
      .print-footer {
          white-space: pre-wrap;
          font-size: 10pt;
      }
    }
  `;
  
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const receiptHtml = printContent.querySelector('#receipt-visual')?.innerHTML;
      if (receiptHtml) {
        const printWindow = window.open('', '_blank', 'width=302,height=500'); // Corresponds to ~80mm
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
        }, 250);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" id="receipt-content">
        <DialogHeader>
            <DialogTitle>Pratinjau Struk</DialogTitle>
        </DialogHeader>
          <div id="receipt-visual">
            <div className="print-header text-center">
                {logo && <Image src={logo} alt="Logo Toko" width={48} height={48} className="mx-auto mb-2" />}
                <h1 className="text-xl font-bold">{storeName}</h1>
                {storeAddress && <p className="text-xs text-muted-foreground">{storeAddress}</p>}
                <p className="text-xs text-muted-foreground mt-2">
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
                <div key={item.id} className="text-sm print-item">
                    <p className="font-medium item-name">{item.name}</p>
                    <p className="font-medium item-total-price">{formatCurrency(item.quantity * item.price)}</p>
                    <p className="text-muted-foreground item-qty-price">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
            ))}
            </div>
            <Separator className="my-4 print-separator"/>
            <div className="my-4 space-y-2 print-summary">
                <div className="flex justify-between text-sm print-summary-line">
                    <p>Subtotal</p>
                    <p className="summary-value">{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex justify-between text-sm print-summary-line">
                    <p>Diskon</p>
                    <p className="summary-value">-{formatCurrency(discountAmount)}</p>
                </div>
                <div className="flex justify-between font-bold text-base print-total print-summary-line">
                    <p>Total</p>
                    <p className="summary-value">{formatCurrency(total)}</p>
                </div>
                <Separator className="my-2 print-separator"/>
                <div className="flex justify-between text-sm print-summary-line">
                    <p>Pembayaran ({paymentMethod})</p>
                    <p className="summary-value">{formatCurrency(paymentMethod === 'Tunai' ? paymentAmount : total)}</p>
                </div>
                <div className="flex justify-between text-sm print-summary-line">
                    <p>Kembalian</p>
                    <p className="summary-value">{formatCurrency(paymentMethod === 'Tunai' ? changeAmount : 0)}</p>
                </div>
                {paymentMethod !== 'Tunai' && paymentRef && (
                    <div className="flex justify-between text-sm print-summary-line">
                        <p>No. Ref</p>
                        <p className="summary-value">{paymentRef}</p>
                    </div>
                )}
            </div>
            <Separator className="my-4 print-separator"/>
            <p className="text-center text-xs text-muted-foreground pt-4 print-footer whitespace-pre-wrap">
              {receiptFooter}
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
