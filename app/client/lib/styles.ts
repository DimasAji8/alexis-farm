// Reusable style constants for consistent theming
export const styles = {
  // Text styles
  text: {
    muted: "text-slate-500 dark:text-slate-400",
    primary: "text-slate-900 dark:text-slate-100",
    secondary: "text-slate-700 dark:text-slate-300",
    tertiary: "text-slate-600 dark:text-slate-400",
  },
  // Page header
  pageHeader: {
    eyebrow: "text-sm text-slate-500 dark:text-slate-400 mb-1",
    title: "text-3xl font-bold text-slate-900 dark:text-slate-100",
    description: "text-slate-600 dark:text-slate-400 mt-1",
  },
  // Buttons
  button: {
    primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
    cancel: "border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
  },
  // Dropdown menu
  dropdown: {
    itemDestructive: "cursor-pointer text-red-600 dark:text-red-400 hover:!bg-red-100 hover:!text-red-700 focus:!bg-red-100 focus:!text-red-700 dark:hover:!bg-red-900/50 dark:hover:!text-red-300 dark:focus:!bg-red-900/50 dark:focus:!text-red-300",
  },
  // Cards
  card: {
    base: "border-slate-200 dark:border-slate-700",
    table: "border-0 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden",
  },
  // Table
  table: {
    headerRow: "bg-slate-800 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-700",
    row: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
    cellMuted: "font-medium text-slate-600 dark:text-slate-400 text-sm py-3",
    cellPrimary: "font-semibold text-slate-900 dark:text-slate-100 text-sm py-3",
    cellSecondary: "font-medium text-slate-700 dark:text-slate-300 text-sm py-3",
    cellTertiary: "font-medium text-slate-600 dark:text-slate-400 text-sm py-3",
    empty: "py-10 text-center text-slate-500 dark:text-slate-400",
  },
} as const;
