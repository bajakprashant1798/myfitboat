import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border py-3 px-6 md:px-16 max-w-7xl mx-auto flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-16" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="max-w-7xl mx-auto border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
          {/* LEFT: GALLERY CAROUSEL SKELETON */}
          <div className="lg:col-span-6 xl:col-span-7 border-b lg:border-b-0 lg:border-r border-border p-8 md:p-12 flex flex-col justify-between bg-surface/30">
            {/* Main Image Box Skeleton */}
            <div className="w-full aspect-square max-w-[500px] mx-auto relative flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>

            {/* Thumbnail Row Skeletons */}
            <div className="flex gap-3 justify-center mt-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="size-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO SKELETON */}
          <div className="lg:col-span-6 xl:col-span-5 p-8 md:p-12 space-y-6 flex flex-col justify-center">
            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Variant Selector */}
            <div className="space-y-3 pt-4 border-t border-border">
              <Skeleton className="h-4 w-28" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-3 pt-4">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
