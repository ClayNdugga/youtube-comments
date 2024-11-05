import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component from Shadcn

const CommentSkeleton = () => {
  return (
    <div className="container flex flex-row">
      <div className="h-full p-1 w-full">
        <div className="flex h-full flex-col rounded-lg border px-6 py-1">
          <div className="mt-6 flex gap-4 leading-5">

            {/* Left - Skeleton for Avatar and Date */}
            <div className="lefthalf flex flex-col items-center justify-start w-1/6">
              <Skeleton className="h-9 w-9 rounded-full" /> {/* Skeleton Avatar */}
              <Skeleton className="h-4 w-16 mt-2" /> {/* Skeleton Date */}
            </div>

            {/* Right - Skeleton for Name, Text, and Likes */}
            <div className="righthalf text-left flex-1">
              <Skeleton className="h-4 w-24 mb-2" /> {/* Skeleton for Display Name */}
              <Skeleton className="h-6 w-full mb-2" /> {/* Skeleton for Comment Text */}
              <Skeleton className="h-4 w-16" /> {/* Skeleton for Likes */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
