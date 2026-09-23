import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center space-y-8 animate-pulse">
      {/* Brand animated pulse pill */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 text-brand font-mono text-xs uppercase tracking-widest">
        <div className="size-2 rounded-full bg-brand animate-ping" />
        <span>Loading MyFitBoat...</span>
      </div>

      {/* Content Placeholder Skeletons */}
      <div className="w-full max-w-4xl space-y-4">
        <Skeleton className="h-10 w-3/4 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl hidden sm:block" />
          <Skeleton className="h-64 rounded-xl hidden md:block" />
        </div>
      </div>
    </div>
  );
}
