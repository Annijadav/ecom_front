import { create } from 'zustand';
import { GET } from '../lib/api_helapr';

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchUsedCategories: async () => {
    set({ loading: true });
    try {
      const res = await GET('/api/v1/customerproducts/used-categories');

      // console.log("✅ Category API Response:", res); // <- should log { statusCode, message, data: [...] }

      set({ categories: res.data || [], loading: false }); // ✅ FIXED: res.data not res.data.data
    } catch (err) {
      console.error("❌ Error fetching categories", err);
      set({ error: 'Failed to fetch categories', loading: false });
    }
  },

  fetchMobileNumbers: async () => {
    set({ loading: true });
    try {
      const res = await GET('/api/v1/customerproducts/mobile-numbers');
      set({ mobileNumbers: res.data || [], loading: false });
    } catch (err) {
      console.error("❌ Error fetching mobile numbers", err);
      set({ error: 'Failed to fetch mobile numbers', loading: false });
    }
  },
}));
