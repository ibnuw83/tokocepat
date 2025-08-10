import * as React from 'react';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="py-4 px-4 md:px-8 border-b bg-card">
      <div className="container mx-auto">
        <div className="flex items-center justify-end">
          {children}
        </div>
      </div>
    </header>
  );
}
