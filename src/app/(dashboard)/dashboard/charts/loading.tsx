import { Skeleton } from "@/components/ui/skeleton";

export default function ChartsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-10" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="h-5 w-20 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
