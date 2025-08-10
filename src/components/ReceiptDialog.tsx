
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
  const [paperSize, setPaperSize] = React.useState("80mm");

  React.useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem("storeName");
      const savedAddress = localStorage.getItem("storeAddress");
      const savedLogo = localStorage.getItem("storeLogo");
      const savedFooter = localStorage.getItem("receiptFooter");
      const savedPaperSize = localStorage.getItem("receiptPaperSize");

      if (savedName) setStoreName(savedName);
      if (savedAddress) setStoreAddress(savedAddress);
      if (savedLogo) setLogo(savedLogo);
      if (savedFooter) setReceiptFooter(savedFooter);
      if (savedPaperSize) setPaperSize(savedPaperSize);
    }
  }, [isOpen]);

  const getPrintStyles = (size: string) => {
    const is80mm = size === '80mm';
    return `
      @media print {
        @page {
          margin: 0;
          size: ${size} auto;
        }
        body {
          margin: 0;
          background: #fff;
        }
        .print-container {
          padding: 10px;
          font-family: 'Courier New', monospace;
          color: #000;
          width: 100%;
          line-height: 1.4;
          font-size: ${is80mm ? '12pt' : '10pt'};
        }
        .print-header, .print-footer {
          text-align: center;
        }
        .print-header img {
          max-width: 40%;
          margin: 0 auto 5px;
        }
        .print-header h1 {
          font-size: ${is80mm ? '18pt' : '14pt'};
          margin: 0;
        }
         .print-header p {
          font-size: ${is80mm ? '11pt' : '9pt'};
          margin: 0;
        }
        .print-item-list, .print-summary {
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .print-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: ${is80mm ? '12px' : '8px'};
        }
        .print-row .left {
          text-align: left;
          word-break: break-word;
        }
        .print-row .right {
          text-align: right;
          white-space: nowrap;
        }
        .item-qty-price {
          font-size: ${is80mm ? '10pt' : '8pt'};
          color: #555;
        }
        .print-separator {
          border-top: 1px dashed #000;
          margin: 8px 0;
        }
        .print-total .right {
          font-weight: bold;
          font-size: ${is80mm ? '14pt' : '12pt'};
        }
        .print-footer {
            white-space: pre-wrap;
            font-size: ${is80mm ? '10pt' : '8pt'};
        }
      }
    `;
  };

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
              <style>${getPrintStyles(paperSize)}</style>
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
            <div className="print-row">
              <span className="left">Pelanggan</span>
              <span className="right font-semibold">{customerName}</span>
            </div>
          </div>
          <Separator className="my-4 print-separator" />
          <div className="my-4 space-y-3 print-item-list">
          {items.map(item => (
              <div key={item.id} className="text-sm">
                  <div className="print-row">
                      <div className="left font-medium">{item.name}</div>
                      <div className="right font-medium">{formatCurrency(item.quantity * item.price)}</div>
                  </div>
                  <div className="print-row">
                    <div className="left text-muted-foreground item-qty-price">{item.quantity} x {formatCurrency(item.price)}</div>
                  </div>
              </div>
          ))}
          </div>
          <Separator className="my-4 print-separator"/>
          <div className="my-4 space-y-2 print-summary">
              <div className="print-row text-sm">
                  <span className="left">Subtotal</span>
                  <span className="right">{formatCurrency(subtotal)}</span>
              </div>
              <div className="print-row text-sm">
                  <span className="left">Diskon</span>
                  <span className="right">{discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : `${formatCurrency(0)}`}</span>
              </div>
              <div className="print-row font-bold text-base print-total">
                  <span className="left">Total</span>
                  <span className="right">{formatCurrency(total)}</span>
              </div>
              <Separator className="my-2 print-separator"/>
              <div className="print-row text-sm">
                  <span className="left">Pembayaran ({paymentMethod})</span>
                  <span className="right">{formatCurrency(paymentMethod === 'Tunai' ? paymentAmount : total)}</span>
              </div>
              <div className="print-row text-sm">
                  <span className="left">Kembalian</span>
                  <span className="right">{formatCurrency(paymentMethod === 'Tunai' ? changeAmount : 0)}</span>
              </div>
              {paymentMethod !== 'Tunai' && paymentRef && (
                  <div className="print-row text-sm">
                      <span className="left">No. Ref</span>
                      <span className="right">{paymentRef}</span>
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
