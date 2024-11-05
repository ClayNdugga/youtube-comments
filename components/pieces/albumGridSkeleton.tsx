import { Skeleton } from "@/components/ui/skeleton";

const AlbumGridSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-6xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-xl">
            {/* Album Image Skeleton */}
            <Skeleton className="h-96 w-96 object-cover" />
            {/* <Skeleton className="h-full w-full object-cover" /> */}

            {/* Gradient Overlay with Text Skeletons */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
              <Skeleton className="h-4 w-3/4 mb-1 rounded" /> {/* Title Skeleton */}
              <Skeleton className="h-3 w-1/2 rounded" />       {/* Artist Name Skeleton */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumGridSkeleton;
