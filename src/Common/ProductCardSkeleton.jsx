"use client";

// Skeleton component for loading state
export default function ProductCardSkeleton({ count = 1, delay = 0 }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="relative block overflow-hidden bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)] transition-opacity duration-300 ease-in-out rounded-sm"
            style={{ 
              aspectRatio: '3/4',
              animationDelay: `${(delay + index) * 0.1}s`
            }}
          >
            {/* Image Section Skeleton */}
            <div className="relative w-full h-full">
              {/* Main Image Skeleton */}
              <div className="absolute inset-0 skeleton-shimmer"></div>

              {/* Heart Icon Skeleton */}
              <div className="absolute right-2 top-2 md:right-3 md:top-3 w-6 h-6 md:w-7 md:h-7 skeleton-shimmer-dark rounded-full"></div>

              {/* Content Section Skeleton (bottom overlay) */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-2 md:px-4 md:py-4 skeleton-shimmer-dark">
                {/* Title Skeleton */}
                <div className="h-3 md:h-4 skeleton-shimmer rounded mb-1 md:mb-2 w-3/4 mx-auto"></div>

                {/* Description Skeleton */}
                <div className="space-y-1 md:space-y-1.5 mb-1 md:mb-2">
                  <div className="h-2 md:h-3 skeleton-shimmer rounded w-full"></div>
                  {/* <div className="h-2 md:h-3 skeleton-shimmer rounded w-4/5 mx-auto"></div> */}
                </div>

                {/* Price Skeleton */}
                <div className="h-2 md:h-3 skeleton-shimmer rounded mb-1 md:mb-2 w-1/4 mx-auto"></div>

                {/* Star Rating Skeleton */}
                <div className="flex items-center justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 md:w-4 md:h-4 skeleton-shimmer rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

