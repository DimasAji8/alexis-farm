import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { styles } from "@/lib/styles";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  statsCount?: number;
  statsColumns?: number;
  tableColumns?: number;
  tableRows?: number;
  showFilter?: boolean;
};

export function PageSkeleton({
  eyebrow,
  title,
  description,
  statsCount = 3,
  statsColumns = 3,
  tableColumns = 5,
  tableRows = 5,
  showFilter = true,
}: Props) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className={styles.pageHeader.eyebrow}>{eyebrow}</div>
          <h1 className={styles.pageHeader.title}>{title}</h1>
          <p className={styles.pageHeader.description}>{description}</p>
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-${statsColumns}`}>
        {Array.from({ length: statsCount }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>

      {/* Filter */}
      {showFilter && (
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800">
                {Array.from({ length: tableColumns }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-16 bg-slate-600" />
                  </th>
                ))}
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: tableRows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-200 dark:border-slate-700">
                  {Array.from({ length: tableColumns }).map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-[100px]" />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Skeleton className="h-8 w-8 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
