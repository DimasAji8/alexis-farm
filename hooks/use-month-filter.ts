import { useMemo } from "react";

/**
 * Convert separate month/year filters to YYYY-MM format
 * @param bulan_month - Month index (0-11)
 * @param bulan_year - Year string
 * @returns Formatted date string (YYYY-MM) or null
 */
export function useMonthFilter(bulan_month?: string | null, bulan_year?: string | null) {
  return useMemo(() => {
    if (bulan_month && bulan_year) {
      const month = String(Number(bulan_month) + 1).padStart(2, '0');
      return `${bulan_year}-${month}`;
    }
    return null;
  }, [bulan_month, bulan_year]);
}
