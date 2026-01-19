"use client";

import { useEffect, type ReactNode } from "react";
import { useForm, Controller, type FieldValues, type DefaultValues, type Path } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { styles } from "@/lib/styles";

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "currency";
  placeholder?: string;
  required?: boolean | string;
  min?: number;
  step?: number;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2;
};

const formatCurrency = (value: string) => {
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, "")) || 0;

type Props<T extends FieldValues> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: T) => void;
  isLoading: boolean;
  title: string;
  editTitle?: string;
  fields: FieldConfig<T>[];
  defaultValues: DefaultValues<T>;
  editData?: Partial<T> | null;
  columns?: 1 | 2;
};

export function FormDialog<T extends FieldValues>({
  open, onOpenChange, onSubmit, isLoading, title, editTitle, fields, defaultValues, editData, columns = 1,
}: Props<T>) {
  const isEdit = !!editData;
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<T>({ defaultValues });

  useEffect(() => {
    if (open) reset(editData ? { ...defaultValues, ...editData } as DefaultValues<T> : defaultValues);
  }, [open, editData, reset, defaultValues]);

  const renderField = (field: FieldConfig<T>) => {
    const error = errors[field.name];
    const errorMsg = error?.message as string | undefined;
    const rules = {
      required: field.required === true ? `${field.label} wajib diisi` : field.required,
      ...(field.type === "number" && field.min !== undefined ? { min: { value: field.min, message: `Minimal ${field.min}` } } : {}),
    };

    if (field.type === "select") {
      return (
        <Controller
          name={field.name}
          control={control}
          rules={{ required: rules.required }}
          render={({ field: f }) => (
            <>
              <Select onValueChange={f.onChange} value={f.value as string}>
                <SelectTrigger className={error ? "border-red-500" : ""}><SelectValue placeholder={field.placeholder} /></SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            </>
          )}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <>
          <Textarea {...register(field.name, rules)} placeholder={field.placeholder} className={error ? "border-red-500" : ""} />
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        </>
      );
    }

    if (field.type === "currency") {
      return (
        <Controller
          name={field.name}
          control={control}
          rules={{ required: rules.required, min: field.min !== undefined ? { value: field.min, message: `Minimal ${field.min}` } : undefined }}
          render={({ field: f }) => (
            <>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={field.placeholder}
                className={error ? "border-red-500" : ""}
                value={f.value ? formatCurrency(String(f.value)) : ""}
                onChange={(e) => f.onChange(parseCurrency(e.target.value))}
              />
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            </>
          )}
        />
      );
    }

    if (field.type === "number") {
      return (
        <Controller
          name={field.name}
          control={control}
          rules={{ required: rules.required, min: field.min !== undefined ? { value: field.min, message: `Minimal ${field.min}` } : undefined }}
          render={({ field: f }) => (
            <>
              <Input
                type="number"
                min={field.min}
                step={field.step ?? "any"}
                placeholder={field.placeholder}
                className={error ? "border-red-500" : ""}
                value={f.value === undefined || f.value === null ? "" : f.value}
                onChange={(e) => f.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            </>
          )}
        />
      );
    }

    return (
      <>
        <Input
          type={field.type}
          placeholder={field.placeholder}
          className={error ? "border-red-500" : ""}
          {...register(field.name, rules)}
        />
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? (editTitle || `Edit ${title}`) : `Tambah ${title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className={columns === 2 ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {fields.map(field => (
              <div key={field.name} className={`space-y-2 ${field.colSpan === 2 ? "col-span-2" : ""}`}>
                <Label>{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className={styles.button.cancel}>Batal</Button>
            <Button type="submit" disabled={isLoading} className={styles.button.primary}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
