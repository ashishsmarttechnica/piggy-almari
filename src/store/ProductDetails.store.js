import { create } from "zustand";
import { fetchSinglePost } from "@/api/product.api";

export const useProductDetailsStore = create((set, get) => ({
  post: null,
  ratings: null,
  reviews: [],
  relatedPosts: [],
  loading: false,
  error: null,

  fetchProductDetails: async (title, params = {}) => {
    if (get().loading) return;
    if (!title) {
      set({ error: "Product title is required", loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await fetchSinglePost(title, params);
      set({
        post: data?.data?.post || null,
        ratings: data?.data?.ratings || null,
        reviews: Array.isArray(data?.data?.reviews) ? data.data.reviews : [],
        relatedPosts: Array.isArray(data?.data?.relatedPosts) ? data.data.relatedPosts : [],
        loading: false,
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load product details";
      set({ error: message, loading: false });
    }
  },

  clearProductDetails: () => {
    set({
      post: null,
      ratings: null,
      reviews: [],
      relatedPosts: [],
      loading: false,
      error: null,
    });
  },
}));

export const selectProductDetailsState = (state) => ({
  post: state.post,
  ratings: state.ratings,
  reviews: state.reviews,
  relatedPosts: state.relatedPosts,
  loading: state.loading,
  error: state.error,
});

export const selectFetchProductDetails = (state) => state.fetchProductDetails;
export const selectClearProductDetails = (state) => state.clearProductDetails;

