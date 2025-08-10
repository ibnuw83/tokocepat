
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import type { InventoryItem } from "@/app/admin/inventory/page"

interface ItemSearchComboBoxProps {
    inventory: InventoryItem[];
    onItemSelect: (item: InventoryItem) => void;
    value: string;
    onChange: (value: string) => void;
}

export function ItemSearchComboBox({ inventory, onItemSelect, value, onChange }: ItemSearchComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    const selectedItem = inventory.find(
      (item) => item.name.toLowerCase() === currentValue.toLowerCase()
    );
    onChange(currentValue === value ? "" : currentValue);

    if (selectedItem) {
        onItemSelect(selectedItem);
    }
    setOpen(false);
  }

  // Filter out items that are out of stock
  const availableItems = inventory.filter(item => item.stock > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? inventory.find((item) => item.name.toLowerCase() === value.toLowerCase())?.name
            : "Pilih barang..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Cari nama barang..."
            value={value}
            onValueChange={onChange}
          />
          <CommandList>
            <CommandEmpty>Barang tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {availableItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={handleSelect}
                  className="flex justify-between"
                >
                    <div className="flex items-center">
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            value.toLowerCase() === item.name.toLowerCase() ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {item.name}
                    </div>
                  <span className="text-xs text-muted-foreground">Stok: {item.stock}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

    