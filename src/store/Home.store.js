import { create } from "zustand";
import { fetchHomeScreenData } from "@/api/home.api";

export const useHomeStore = create((set, get) => ({
  sections: [],
  loading: false,
  error: null,
  pagination: {
    pageSize: 0,
    totalPages: 0,
    total: 0,
    currentPage: 1,
  },

  fetchHomeData: async (params = {}) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await fetchHomeScreenData(params);
      const list = Array.isArray(data?.data) ? data.data : [];
      set({
        sections: list,
        loading: false,
        pagination: {
          pageSize: data?.pageSize || 0,
          totalPages: data?.totalPages || 0,
          total: data?.total || 0,
          currentPage: data?.currentPage || 1,
        },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load home data";
      set({ error: message, loading: false });
    }
  },
}));

export const selectHomeState = (state) => ({
  sections: state.sections,
  loading: state.loading,
  error: state.error,
  pagination: state.pagination,
});

export const selectFetchHomeData = (state) => state.fetchHomeData;

