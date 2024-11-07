import React, { forwardRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component from Shadcn


const VideoSkeleton = forwardRef((Props, ref) => {
  return (
    <section className="py-32" ref={ref}>
      <div className="container mx-auto">
        <div className="grid items-center gap-4 lg:gap-8 lg:grid-cols-2">
          {/* Skeleton for the image */}
          <Skeleton className="w-full h-0 pb-[75%] rounded-md object-cover" />

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Skeleton for the title with adjusted width */}
            <div className="space-y-1 pt-2 pb-6 lg:space-y-2 lg:pt-4 lg:pb-12">
              <Skeleton className="h-36 w-full sm:w-[480px] lg:w-[480px]" />
            </div>

            <div className="flex flex-row gap-2 pb-2">
              {/* Skeletons for badges with responsive widths */}
              <Skeleton className="h-4 w-16 sm:w-20 lg:w-24" /> {/* New Release badge */}
              <Skeleton className="h-4 w-12 sm:w-14 lg:w-16" /> {/* Duration badge */}
              <Skeleton className="h-4 w-12 sm:w-14 lg:w-16" /> {/* Another badge */}
            </div>
            {/* Skeleton for the description with reduced spacing */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-full sm:w-[480px] lg:w-[480px]" />
              <Skeleton className="h-4 w-full sm:w-[480px] lg:w-[480px]" />
              <Skeleton className="h-4 w-full sm:w-[480px] lg:w-[480px]" />
              <Skeleton className="h-4 w-full sm:w-[480px] lg:w-[480px]" />
       
            </div>

            <div className="flex w-full flex-col justify-center gap-1 sm:gap-2 sm:flex-row lg:justify-start">
              {/* Skeleton for buttons with flexible widths */}
              <Skeleton className="w-full h-10 sm:h-12 sm:w-auto" />
              <Skeleton className="w-full h-10 sm:h-12 sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default VideoSkeleton;

