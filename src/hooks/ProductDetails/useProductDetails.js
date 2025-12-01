import { useEffect } from "react";
import { useProductDetailsStore } from "@/store/ProductDetails.store";

export default function useProductDetails(productTitle = null, options = { autoFetch: true, params: {} }) {
  // Select individual values to avoid creating new objects on every render
  // This prevents infinite loops caused by selector functions returning new objects
  const post = useProductDetailsStore((state) => state.post);
  const ratings = useProductDetailsStore((state) => state.ratings);
  const reviews = useProductDetailsStore((state) => state.reviews);
  const relatedPosts = useProductDetailsStore((state) => state.relatedPosts);
  const loading = useProductDetailsStore((state) => state.loading);
  const error = useProductDetailsStore((state) => state.error);
  const fetchProductDetails = useProductDetailsStore((state) => state.fetchProductDetails);
  const clearProductDetails = useProductDetailsStore((state) => state.clearProductDetails);

  useEffect(() => {
    if (options?.autoFetch && productTitle) {
      fetchProductDetails(productTitle, options?.params || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTitle]);

  useEffect(() => {
    return () => {
      // Clear product details when component unmounts
      clearProductDetails();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    post,
    ratings,
    reviews,
    relatedPosts,
    loading,
    error,
    fetchProductDetails,
    clearProductDetails,
  };
}

