import { useEffect } from "react";
import { useCategoryPostsStore } from "@/store/CategoryPosts.store";

export default function useCategoryPosts(options = { autoFetch: true, params: {} }) {
  // Select individual values to avoid creating new objects on every render
  // This prevents infinite loops caused by selector functions returning new objects
  const posts = useCategoryPostsStore((state) => state.posts);
  const loading = useCategoryPostsStore((state) => state.loading);
  const error = useCategoryPostsStore((state) => state.error);
  const pagination = useCategoryPostsStore((state) => state.pagination);
  const fetchCategoryPosts = useCategoryPostsStore((state) => state.fetchCategoryPosts);
  const clearCategoryPosts = useCategoryPostsStore((state) => state.clearCategoryPosts);

  useEffect(() => {
    if (options?.autoFetch && options?.params?.CategoryId) {
      fetchCategoryPosts(options.params, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.params?.CategoryId, options?.params?.subCategoryId]);

  useEffect(() => {
    return () => {
      // Clear category posts when component unmounts
      clearCategoryPosts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchCategoryPosts,
    clearCategoryPosts,
  };
}

