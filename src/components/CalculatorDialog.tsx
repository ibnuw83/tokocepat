"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorDialog({ isOpen, onClose }: CalculatorDialogProps) {
  const [input, setInput] = React.useState("0");
  const [previousValue, setPreviousValue] = React.useState<number | null>(null);
  const [operator, setOperator] = React.useState<string | null>(null);
  const [isNewOperation, setIsNewOperation] = React.useState(true);

  const handleNumberClick = (value: string) => {
    if (isNewOperation) {
      setInput(value);
      setIsNewOperation(false);
    } else {
      setInput(prev => (prev === "0" ? value : prev + value));
    }
  };
  
  const handleDecimalClick = () => {
    if (!input.includes('.')) {
      setInput(prev => prev + '.');
      setIsNewOperation(false);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (operator && previousValue !== null && !isNewOperation) {
      handleEqualsClick();
      setPreviousValue(parseFloat(input));
    } else {
      setPreviousValue(parseFloat(input));
    }
    setOperator(op);
    setIsNewOperation(true);
  };

  const handleEqualsClick = () => {
    if (!operator || previousValue === null) return;

    const currentValue = parseFloat(input);
    let result;

    switch (operator) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '*':
        result = previousValue * currentValue;
        break;
      case '/':
        result = previousValue / currentValue;
        break;
      default:
        return;
    }
    
    setInput(String(result));
    setOperator(null);
    setPreviousValue(null);
    setIsNewOperation(true);
  };

  const handleClear = () => {
    setInput("0");
    setPreviousValue(null);
    setOperator(null);
    setIsNewOperation(true);
  };
  
  const handleBackspace = () => {
    if (isNewOperation) return;
    setInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }

  const buttons = [
    { label: 'C', handler: handleClear, className: 'col-span-2 bg-destructive text-destructive-foreground hover:bg-destructive/90' },
    { label: '⌫', handler: handleBackspace },
    { label: '/', handler: () => handleOperatorClick('/') },
    { label: '7', handler: () => handleNumberClick('7') },
    { label: '8', handler: () => handleNumberClick('8') },
    { label: '9', handler: () => handleNumberClick('9') },
    { label: '*', handler: () => handleOperatorClick('*') },
    { label: '4', handler: () => handleNumberClick('4') },
    { label: '5', handler: () => handleNumberClick('5') },
    { label: '6', handler: () => handleNumberClick('6') },
    { label: '-', handler: () => handleOperatorClick('-') },
    { label: '1', handler: () => handleNumberClick('1') },
    { label: '2', handler: () => handleNumberClick('2') },
    { label: '3', handler: () => handleNumberClick('3') },
    { label: '+', handler: () => handleOperatorClick('+') },
    { label: '0', handler: () => handleNumberClick('0'), className: 'col-span-2' },
    { label: '.', handler: handleDecimalClick },
    { label: '=', handler: handleEqualsClick, className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Kalkulator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
            <Input 
                readOnly 
                value={input}
                className="text-right text-3xl font-mono h-14"
            />
            <div className="grid grid-cols-4 gap-2">
                {buttons.map(({ label, handler, className='' }) => (
                    <Button
                        key={label}
                        onClick={handler}
                        variant="outline"
                        className={`text-xl h-14 ${className}`}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
