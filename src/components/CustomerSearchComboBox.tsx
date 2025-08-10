
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Customer } from "@/app/admin/customers/page"

interface CustomerSearchComboBoxProps {
    customers: Customer[];
    selectedCustomer: Customer | null;
    onCustomerSelect: (customer: Customer | null) => void;
}

export function CustomerSearchComboBox({ customers, selectedCustomer, onCustomerSelect }: CustomerSearchComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (customerName: string) => {
    const customer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase()) || null;
    onCustomerSelect(customer);
    setSearchValue(customer ? customer.name.toLowerCase() : "");
    setOpen(false);
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCustomerSelect(null);
    setSearchValue("");
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-sm">
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            >
            {selectedCustomer ? selectedCustomer.name : "Pilih pelanggan..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
            <CommandInput 
                placeholder="Cari nama pelanggan..."
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <CommandList>
                <CommandEmpty>Pelanggan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                {customers.map((customer) => (
                    <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={handleSelect}
                    >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {customer.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
        {selectedCustomer && (
            <Button variant="ghost" size="icon" onClick={handleClear} className="h-9 w-9">
                <X className="h-4 w-4"/>
                <span className="sr-only">Hapus Pelanggan</span>
            </Button>
        )}
    </div>
  )
}
