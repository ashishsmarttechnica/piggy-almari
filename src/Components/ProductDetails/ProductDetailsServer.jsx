"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";
import { useProductDetailsStore } from "@/store/ProductDetails.store";

export default function ProductDetailsServer({ productTitle: propProductTitle, initialData: propInitialData }) {
  const searchParams = useSearchParams();
  const queryProductTitle = searchParams?.get("title") || searchParams?.get("id");
  const productTitle = propProductTitle || queryProductTitle || null;

  const [initialData, setInitialData] = useState(propInitialData || null);
  const [isLoading, setIsLoading] = useState(!propInitialData);

  const fetchProductDetails = useProductDetailsStore((state) => state.fetchProductDetails);

  useEffect(() => {
    if (propInitialData && propInitialData.post) {
      setIsLoading(false);
      return;
    }

    if (productTitle) {
      const fetchPromise = fetchProductDetails(productTitle, { ratedPostsLimit: 4 });

      if (fetchPromise && typeof fetchPromise.then === "function") {
        fetchPromise
          .then(() => {
            const { post, ratings, reviews, relatedPosts } = useProductDetailsStore.getState();
            setInitialData({
              post: post || null,
              ratings: ratings || null,
              reviews: Array.isArray(reviews) ? reviews : [],
              relatedPosts: Array.isArray(relatedPosts) ? relatedPosts : [],
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else {
        setTimeout(() => {
          const { post, ratings, reviews, relatedPosts } = useProductDetailsStore.getState();
          setInitialData({
            post: post || null,
            ratings: ratings || null,
            reviews: Array.isArray(reviews) ? reviews : [],
            relatedPosts: Array.isArray(relatedPosts) ? relatedPosts : [],
          });
          setIsLoading(false);
        }, 100);
      }
    } else {
      setIsLoading(false);
    }
  }, [productTitle, fetchProductDetails, propInitialData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton-shimmer h-[600px] rounded-lg"></div>
            <div className="space-y-4">
              <div className="skeleton-shimmer h-8 w-3/4 rounded"></div>
              <div className="skeleton-shimmer h-4 w-full rounded"></div>
              <div className="skeleton-shimmer h-4 w-2/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetails initialData={initialData} productTitle={productTitle} />;
}
