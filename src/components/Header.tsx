import * as React from 'react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SidebarNav } from './SidebarNav';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="py-4 px-4 md:px-8 border-b bg-card h-[73px] flex items-center sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
         <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Buka Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-8">
                <SidebarNav />
            </SheetContent>
        </Sheet>
        
        {/* Spacer to push children to the right */}
        <div className="flex-1 md:hidden" />

        <div className="flex items-center justify-end">
          {children}
        </div>
      </div>
    </header>
  );
}
