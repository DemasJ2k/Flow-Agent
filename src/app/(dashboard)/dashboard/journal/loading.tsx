import { Skeleton } from "@/components/ui/skeleton";

export default function JournalLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="rounded-lg bg-white shadow-md divide-y">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
