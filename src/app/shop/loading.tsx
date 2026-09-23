import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-16 w-80 mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="border border-border bg-surface flex flex-col justify-between overflow-hidden"
            >
              {/* Image box skeleton */}
              <div className="p-8 bg-surface/50 border-b border-border flex items-center justify-center h-[300px]">
                <Skeleton className="w-48 h-56 rounded-lg" />
              </div>

              {/* Content skeleton */}
              <div className="p-6 space-y-4">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-28 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
