import { create } from "zustand";
import { fetchSectionPosts } from "@/api/section.api";

export const useSectionPostsStore = create((set, get) => ({
  sectionData: null,
  posts: [],
  loading: false,
  error: null,
  pagination: {
    pageSize: 0,
    totalPages: 0,
    total: 0,
    currentPage: 1,
  },

  fetchSectionPosts: async (params = {}, append = false) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await fetchSectionPosts(params);
      const sectionData = data?.data || null;
      const postsList = Array.isArray(sectionData?.posts) ? sectionData.posts : [];
      
      if (append) {
        // When appending, deduplicate posts by _id (preferred) or title to prevent duplicates
        const currentPosts = get().posts;
        const existingIds = new Set(
          currentPosts.map(post => post._id || post.title).filter(Boolean)
        );
        const newPosts = postsList.filter(post => {
          const id = post._id || post.title;
          return id && !existingIds.has(id);
        });
        set({
          sectionData,
          posts: [...currentPosts, ...newPosts],
          loading: false,
          pagination: {
            pageSize: data?.pageSize || 0,
            totalPages: data?.totalPages || 0,
            total: data?.total || 0,
            currentPage: data?.currentPage || 1,
          },
        });
      } else {
        // When not appending, replace all posts
        set({
          sectionData,
          posts: postsList,
          loading: false,
          pagination: {
            pageSize: data?.pageSize || 0,
            totalPages: data?.totalPages || 0,
            total: data?.total || 0,
            currentPage: data?.currentPage || 1,
          },
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load section posts";
      set({ error: message, loading: false });
    }
  },
}));

export const selectSectionPostsState = (state) => ({
  sectionData: state.sectionData,
  posts: state.posts,
  loading: state.loading,
  error: state.error,
  pagination: state.pagination,
});

export const selectFetchSectionPosts = (state) => state.fetchSectionPosts;

