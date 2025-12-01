import { useEffect } from "react";
import { useCategoryStore } from "@/store/Category.store";

export default function useCategory(options = { autoFetch: true }) {
  // Select individual values to avoid creating new objects on every render
  // This prevents infinite loops caused by selector functions returning new objects
  const categories = useCategoryStore((state) => state.categories);
  const loading = useCategoryStore((state) => state.loading);
  const error = useCategoryStore((state) => state.error);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  useEffect(() => {
    if (options?.autoFetch) fetchCategories();
    // Only run on mount when autoFetch is true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { categories, loading, error, fetchCategories };
}


