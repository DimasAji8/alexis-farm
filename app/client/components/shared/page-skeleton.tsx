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
      <div className={`grid gap-3 ${
        statsColumns === 5 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-5' :
        statsColumns === 4 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' :
        statsColumns === 3 ? 'grid-cols-2 sm:grid-cols-3' :
        'grid-cols-2 sm:grid-cols-2'
      }`}>
        {Array.from({ length: statsCount }).map((_, i) => (
          <Card key={i} className="shadow-sm border dark:border-slate-700">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50">
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-20" />
                <Skeleton className="h-6 sm:h-8 w-24" />
              </div>
            </div>
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
      <Card className="p-4 sm:p-6">
        <div className="rounded-lg overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="overflow-auto" style={{ maxHeight: '600px' }}>
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-slate-900 dark:bg-slate-700">
                <tr className="hover:bg-slate-900 dark:hover:bg-slate-700 border-b-2 border-slate-600">
                  {Array.from({ length: tableColumns }).map((_, i) => (
                    <th key={i} className="h-10 px-4 text-left align-middle font-medium text-white text-xs sm:text-sm">
                      <Skeleton className="h-4 w-16 bg-slate-600" />
                    </th>
                  ))}
                  <th className="h-10 px-4 font-medium text-white w-12 text-center">
                    <Skeleton className="h-4 w-12 bg-slate-600" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: tableRows }).map((_, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700">
                    {Array.from({ length: tableColumns }).map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 align-middle">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <Skeleton className="h-8 w-8 rounded mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
}
