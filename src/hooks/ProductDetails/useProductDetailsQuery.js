import { useQuery } from "@tanstack/react-query";
import { fetchSinglePost } from "@/api/product.api";

export function useProductDetailsQuery(productTitle, params = {}) {
  return useQuery({
    queryKey: ["productDetails", productTitle, params],
    queryFn: () => fetchSinglePost(productTitle, params),
    enabled: !!productTitle,
  });
}

