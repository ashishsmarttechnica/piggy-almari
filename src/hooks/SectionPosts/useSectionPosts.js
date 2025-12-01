import { useEffect } from "react";
import { useSectionPostsStore } from "@/store/SectionPosts.store";

export default function useSectionPosts(options = { autoFetch: true, params: {} }) {
  // Select individual values to avoid creating new objects on every render
  // This prevents infinite loops caused by selector functions returning new objects
  const sectionData = useSectionPostsStore((state) => state.sectionData);
  const posts = useSectionPostsStore((state) => state.posts);
  const loading = useSectionPostsStore((state) => state.loading);
  const error = useSectionPostsStore((state) => state.error);
  const pagination = useSectionPostsStore((state) => state.pagination);
  const fetchSectionPosts = useSectionPostsStore((state) => state.fetchSectionPosts);

  useEffect(() => {
    if (options?.autoFetch && options?.params?.id) {
      fetchSectionPosts(options?.params || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.params?.id, options?.params?.page]);

  return { sectionData, posts, loading, error, pagination, fetchSectionPosts };
}

