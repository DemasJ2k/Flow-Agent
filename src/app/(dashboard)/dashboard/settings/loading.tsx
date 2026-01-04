import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {[1, 2, 3].map((section) => (
        <div key={section} className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((field) => (
              <div key={field}>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
