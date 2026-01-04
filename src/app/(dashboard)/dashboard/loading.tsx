import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow-md">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-5 w-24 mt-4" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
