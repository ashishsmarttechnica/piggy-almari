import { create } from "zustand";
import { fetchCategoryPosts } from "@/api/categoryPosts.api";

export const useCategoryPostsStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  pagination: {
    pageSize: 0,
    totalPages: 0,
    total: 0,
    currentPage: 1,
  },

  fetchCategoryPosts: async (params = {}, append = false) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await fetchCategoryPosts(params);
      const postsList = Array.isArray(data?.data) ? data.data : [];
      
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
          posts: [...currentPosts, ...newPosts],
          loading: false,
          pagination: {
            pageSize: data?.pageSize || 0,
            totalPages: data?.totalPages || 0,
            total: data?.total || 0,
            currentPage: data?.currantPage || data?.currentPage || 1,
          },
        });
      } else {
        // When not appending, replace all posts
        set({
          posts: postsList,
          loading: false,
          pagination: {
            pageSize: data?.pageSize || 0,
            totalPages: data?.totalPages || 0,
            total: data?.total || 0,
            currentPage: data?.currantPage || data?.currentPage || 1,
          },
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load category posts";
      set({ error: message, loading: false });
    }
  },

  clearCategoryPosts: () => {
    set({
      posts: [],
      loading: false,
      error: null,
      pagination: {
        pageSize: 0,
        totalPages: 0,
        total: 0,
        currentPage: 1,
      },
    });
  },
}));

export const selectCategoryPostsState = (state) => ({
  posts: state.posts,
  loading: state.loading,
  error: state.error,
  pagination: state.pagination,
});

export const selectFetchCategoryPosts = (state) => state.fetchCategoryPosts;
export const selectClearCategoryPosts = (state) => state.clearCategoryPosts;

