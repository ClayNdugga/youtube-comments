import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component from Shadcn

const VideoSkeleton = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Skeleton for the image */}
          <Skeleton className="w-[640px] h-[480px] rounded-md object-cover" />

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex flex-row gap-2">
              {/* Skeletons for badges (adjusted widths) */}
              <Skeleton className="h-4 w-24" /> {/* Placeholder for New Release badge */}
              <Skeleton className="h-4 w-14" /> {/* Placeholder for duration badge */}
              <Skeleton className="h-4 w-14" /> {/* Placeholder for duration badge */}
           </div>

            {/* Skeleton for the title with more depth */}
            <div className="space-y-2 pt-4 pb-12">
                <Skeleton className="h-12 w-[640px] lg:w-[640px]" />
                <Skeleton className="h-12 w-[640px] lg:w-[640px]" />
            </div>
            

            {/* Skeleton for the description with more depth */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-[640px]" />
                <Skeleton className="h-4 w-[640px]" />
                <Skeleton className="h-4 w-[640px]" />
                <Skeleton className="h-4 w-[640px]" />
                <Skeleton className="h-4 w-[640px]" />
                <Skeleton className="h-4 w-[640px]" />
            </div>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {/* Skeleton for buttons */}
              <Skeleton className="w-full h-12 sm:w-auto" />
              <Skeleton className="w-full h-12 sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSkeleton;
