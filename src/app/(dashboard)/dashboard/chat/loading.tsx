import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      <div className="flex flex-1 flex-col rounded-lg bg-white shadow-md overflow-hidden">
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex items-start space-x-3 justify-end">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="border-t border-gray-200 p-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
