import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSectionPosts } from "@/api/section.api";

export function useSectionPostsQuery(params = {}) {
  const { id, limit = 10, is_approved = "[1]", latitude, longitude } = params;

  return useInfiniteQuery({
    queryKey: ["sectionPosts", id, is_approved, latitude, longitude],
    queryFn: ({ pageParam = 1 }) =>
      fetchSectionPosts({
        id,
        page: pageParam,
        limit,
        is_approved,
        latitude,
        longitude,
      }),
    enabled: !!id,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage?.currantPage || lastPage?.currentPage || allPages.length;
      const totalPages = lastPage?.totalPages || 0;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    select: (data) => {
      // Transform the data to include sectionData from first page
      const firstPage = data.pages[0];
      const sectionData = firstPage?.data || null;
      return {
        ...data,
        sectionData,
      };
    },
  });
}

