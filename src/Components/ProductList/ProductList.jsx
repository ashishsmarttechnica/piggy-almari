

import { useMemo, useRef, useEffect } from "react";
import ProductCard from "@/Common/ProductCard";
import ProductCardSkeleton from "@/Common/ProductCardSkeleton";
import Filter from "@/Components/Filter/Filter";

export default function ProductList({
  sectionData,
  posts = [],
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  // Filter props
  priceType,
  setPriceType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
}) {
  const observerTarget = useRef(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}${imgPath}`;
  };

  const getProductHref = (post) => {
    if (!post?.title) return "#";
    return `/post/${encodeURIComponent(post.title)}/`;
  };

  // Posts are already filtered and sorted by the API
  const sortedPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts;
  }, [posts]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 fs-md">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-light-gray min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {sectionData && (
          <div className="mb-8">
            <h1 className="fs-4xl font-bold text-theme-black mb-2">{sectionData.name}</h1>
            {sectionData.CK_Description && (
              <div
                className="fs-md text-dark-gray"
                dangerouslySetInnerHTML={{ __html: sectionData.CK_Description }}
              />
            )}
          </div>
        )}

        {/* Filter and Sort Section */}
        <Filter
          priceType={priceType}
          setPriceType={setPriceType}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalItems={sortedPosts.length}
        />

        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : sortedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedPosts.map((post, index) => {
                // Create unique key using _id, title, and index as fallback
                const uniqueKey = post._id || `${post.title}-${index}` || `post-${index}`;
                return (
                  <ProductCard
                    key={uniqueKey}
                    href={getProductHref(post)}
                    imageSrc={getImageUrl(post.postimg)}
                    imageAlt={post.title || "Product image"}
                    title={post.title || ""}
                    subtitle={post.details || ""}
                    price={post.sell_prices || post.rent_prices || 0}
                    rating={post.overallRating || 0}
                    liked={post.wishlistFlag || post.likeFlag || false}
                    onToggleLike={(next) => {
                      console.log("Toggle like for", post._id || post.title, next);
                    }}
                  />
                );
              })}
            </div>

            {/* Infinite scroll trigger and loader */}
            {hasMore && (
              <div ref={observerTarget} className="mt-8">
                {loading && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={`loading-${i}`} className="skeleton-fade-in-slow" style={{ animationDelay: `${i * 0.08}s` }}>
                        <ProductCardSkeleton />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="fs-md text-dark-gray">No products available in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
