
"use client";

import * as React from 'react';
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
import { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CameraOff } from "lucide-react";

interface BarcodeScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrcodeRegionId = "barcode-scanner-region";

export function BarcodeScannerDialog({ isOpen, onClose, onScanSuccess }: BarcodeScannerDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      // We need a delay to allow the dialog to render, otherwise the element might not be found.
      const timer = setTimeout(() => {
        if (!document.getElementById(qrcodeRegionId)) {
            console.error("Barcode scanner region not found");
            setError("Tidak dapat memuat komponen pemindai. Silakan coba lagi.");
            return;
        }

        const html5QrCode = new Html5Qrcode(qrcodeRegionId);
        scannerRef.current = html5QrCode;
        
        const qrCodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
            onScanSuccess(decodedText);
            handleStop();
        };

        const qrCodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
           // We can ignore most errors as they are not critical
           // console.warn(`Code scan error: ${errorMessage}`);
        };
        
        html5QrCode.start(
            { facingMode: "environment" },
            { 
                fps: 10,
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.777778, // 16:9
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        ).catch((err) => {
            console.error("Failed to start barcode scanner", err);
            if (err.name === 'NotAllowedError') {
                setError("Izin kamera diperlukan untuk memindai barcode. Silakan aktifkan di pengaturan browser Anda.");
            } else {
                 setError(`Gagal memulai kamera: ${err.message}`);
            }
        });
      }, 100);

      return () => {
          clearTimeout(timer);
          handleStop();
      }
    }
  }, [isOpen, onScanSuccess]);

  const handleStop = () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(err => {
              console.error("Failed to stop barcode scanner.", err);
          });
      }
  }

  const handleClose = () => {
    handleStop();
    onClose();
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pindai Barcode Barang</DialogTitle>
          <DialogDescription>
            Arahkan kamera ke barcode pada kemasan produk.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 aspect-video w-full overflow-hidden rounded-md border bg-muted" id={qrcodeRegionId}>
            {/* The video stream will be rendered here by Html5Qrcode */}
        </div>
        
        {error && (
            <Alert variant="destructive">
                <CameraOff className="h-4 w-4" />
                <AlertTitle>Gagal Mengakses Kamera</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
