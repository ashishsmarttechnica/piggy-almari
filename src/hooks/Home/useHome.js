import { useEffect } from "react";
import { useHomeStore } from "@/store/Home.store";

export default function useHome(options = { autoFetch: true, params: {} }) {
  // Select individual values to avoid creating new objects on every render
  // This prevents infinite loops caused by selector functions returning new objects
  const sections = useHomeStore((state) => state.sections);
  const loading = useHomeStore((state) => state.loading);
  const error = useHomeStore((state) => state.error);
  const pagination = useHomeStore((state) => state.pagination);
  const fetchHomeData = useHomeStore((state) => state.fetchHomeData);

  useEffect(() => {
    if (options?.autoFetch) {
      fetchHomeData(options?.params || {});
    }
    // Only run on mount when autoFetch is true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sections, loading, error, pagination, fetchHomeData };
}

