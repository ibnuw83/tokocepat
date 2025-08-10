import * as React from 'react';
import { Box } from 'lucide-react';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="py-4 px-4 md:px-8 border-b bg-card">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Box className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground">
              Toko Cepat
            </h1>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
