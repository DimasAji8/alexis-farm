"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { styles } from "@/lib/styles";

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  if (!onEdit && !onDelete) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onEdit && (
              <DropdownMenuItem
                onClick={onEdit}
                className="cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-700 dark:focus:bg-slate-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className={styles.dropdown.itemDestructive}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>{onEdit && onDelete ? "Edit / Hapus" : onEdit ? "Edit" : "Hapus"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
