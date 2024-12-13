import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFilterStore = create(
  persist(
    (set) => ({
      minPrice: 0,
      maxPrice: 0,
      title: '',
      categoryId: 'ALL_CATEGORY_ID',
      setMinPrice: (minPrice) => set({ minPrice }),
      setMaxPrice: (maxPrice) => set({ maxPrice }),
      setTitle: (title) => set({ title }),
      setCategoryId: (categoryId) => set({ categoryId }),
      resetFilter: () =>
        set({
          minPrice: 0,
          maxPrice: 0,
          title: '',
          categoryId: 'ALL_CATEGORY_ID',
        }),
    }),
    {
      name: 'filter',
      getStorage: () => localStorage,
    }
  )
);
