import { create } from "zustand";
import { fetchCategoryData } from "@/api/category.api";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await fetchCategoryData();
      const list = Array.isArray(data?.data) ? data.data : [];
      set({ categories: list, loading: false });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed";
      set({ error: message, loading: false });
    }
  },
}));

export const selectCategoryState = (state) => ({
  categories: state.categories,
  loading: state.loading,
  error: state.error,
});

export const selectFetchCategories = (state) => state.fetchCategories;


