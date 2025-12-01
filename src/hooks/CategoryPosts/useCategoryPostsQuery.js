import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCategoryPosts } from "@/api/categoryPosts.api";

export function useCategoryPostsQuery(params = {}) {
  const {
    CategoryId,
    subCategoryId,
    limit = 10,
    sortField = null,
    sortOrder = null,
    is_approved = "[1]",
    is_visible = true,
    latitude,
    longitude,
  } = params;

  return useInfiniteQuery({
    queryKey: [
      "categoryPosts",
      CategoryId,
      subCategoryId,
      sortField,
      sortOrder,
      is_approved,
      is_visible,
      latitude,
      longitude,
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchCategoryPosts({
        CategoryId,
        subCategoryId,
        page: pageParam,
        limit,
        sortField,
        sortOrder,
        is_approved,
        is_visible,
        latitude,
        longitude,
      }),
    enabled: !!CategoryId,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage?.currantPage || lastPage?.currentPage || allPages.length;
      const totalPages = lastPage?.totalPages || 0;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

