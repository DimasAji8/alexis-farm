"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", error, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled}
          className={cn(
            "justify-start text-left font-normal w-full",
            !value && "text-muted-foreground",
            error && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value + 'T00:00:00'), "PPP", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar 
          mode="single" 
          selected={value ? new Date(value + 'T00:00:00') : undefined} 
          onSelect={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              onChange(`${year}-${month}-${day}`);
            } else {
              onChange('');
            }
          }} 
          initialFocus 
        />
      </PopoverContent>
    </Popover>
  );
}
