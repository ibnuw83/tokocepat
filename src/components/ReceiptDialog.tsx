
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
          font-size: ${is80mm ? '10pt' : '8pt'};
        }
        .print-header { text-align: center; }
        .print-header-top {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 5px;
        }
        .print-header-top img {
          width: ${is80mm ? '32px' : '24px'};
          height: ${is80mm ? '32px' : '24px'};
        }
        .print-header h1 {
          font-size: ${is80mm ? '16pt' : '12pt'};
          margin: 0;
          font-weight: bold;
        }
         .print-header p {
          font-size: ${is80mm ? '9pt' : '7pt'};
          margin: 0;
        }
        .print-separator {
          border-top: 1px dashed #000;
          margin: 8px 0;
        }
        .print-footer {
            white-space: pre-wrap;
            text-align: center;
            font-size: ${is80mm ? '9pt' : '7pt'};
        }
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
        }
        .receipt-table td {
          padding: 2px 0;
          vertical-align: top;
        }
        .receipt-table .col-left {
          text-align: left;
          word-break: break-word;
        }
        .receipt-table .col-right {
          text-align: right;
          white-space: nowrap;
        }
        .item-details {
          font-size: ${is80mm ? '8pt' : '6pt'};
          color: #555;
          padding-bottom: 4px;
        }
        .total-row td {
            font-weight: bold;
            padding-top: 4px;
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
          <div className="print-header">
              <div className="flex items-center justify-center gap-2 mb-2 print-header-top">
                {logo && <Image src={logo} alt="Logo Toko" width={32} height={32} />}
                <h1 className="text-xl font-bold">{storeName}</h1>
              </div>
              {storeAddress && <p className="text-xs text-muted-foreground">{storeAddress}</p>}
              <p className="text-xs text-muted-foreground mt-2">
                  {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
          </div>
          <div className="print-separator my-4" />
          
           <table className="w-full text-sm receipt-table">
              <tbody>
                <tr>
                    <td className="col-left">Pelanggan</td>
                    <td className="col-right font-semibold">{customerName}</td>
                </tr>
              </tbody>
           </table>

          <div className="print-separator my-4" />

           <table className="w-full text-sm receipt-table">
              <tbody>
                {items.map(item => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="col-left font-medium">{item.name}</td>
                      <td className="col-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                    <tr>
                      <td className="col-left item-details">{item.quantity} x {formatCurrency(item.price)}</td>
                      <td className="col-right"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
           </table>

          <div className="print-separator my-4"/>
          
           <table className="w-full text-sm receipt-table">
              <tbody>
                  <tr>
                    <td className="col-left">Subtotal</td>
                    <td className="col-right">{formatCurrency(subtotal)}</td>
                  </tr>
                  <tr>
                    <td className="col-left">Diskon</td>
                    <td className="col-right">{discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : `${formatCurrency(0)}`}</td>
                  </tr>
                  <tr className="total-row font-bold">
                    <td className="col-left">Total</td>
                    <td className="col-right">{formatCurrency(total)}</td>
                  </tr>
                   <tr><td colSpan={2}><div className="print-separator my-2"/></td></tr>
                  <tr>
                    <td className="col-left">Pembayaran ({paymentMethod})</td>
                    <td className="col-right">{formatCurrency(paymentMethod === 'Tunai' ? paymentAmount : total)}</td>
                  </tr>
                  <tr>
                    <td className="col-left">Kembalian</td>
                    <td className="col-right">{formatCurrency(paymentMethod === 'Tunai' ? changeAmount : 0)}</td>
                  </tr>
                   {paymentMethod !== 'Tunai' && paymentRef && (
                      <tr>
                          <td className="col-left">No. Ref</td>
                          <td className="col-right">{paymentRef}</td>
                      </tr>
                  )}
              </tbody>
           </table>

          <div className="print-separator my-4"/>
          <div className="print-footer text-xs text-muted-foreground whitespace-pre-wrap text-center">
            {receiptFooter}
          </div>
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
