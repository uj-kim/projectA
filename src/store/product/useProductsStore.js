import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProductAPI } from '@/api/product';

const useProductsStore = create(
  persist(
    (set) => ({
      items: [],
      hasNextPage: true,
      totalCount: 0,

      setProducts: (products, isInitial) =>
        set((state) => ({
          items: isInitial ? products : [...state.items, ...products],
        })),
      setHasNextPage: (hasNextPage) => set({ hasNextPage }),
      setTotalCount: (totalCount) => set({ totalCount }),
    }),
    {
      name: 'products', // 로컬스토리지 키 이름
      getStorage: () => localStorage, // 기본 스토리지는 localStorage
    }
  )
);

// TanStack Query
export const useLoadProducts = ({ filter, pageSize, page, isInitial }) => {
  const queryClient = useQueryClient();
  const { setProducts, setHasNextPage, setTotalCount } = useProductsStore();

  return useQuery({
    queryKey: ['products', filter, pageSize, page],
    queryFn: async () => {
      const result = await fetchProducts(filter, pageSize, page);
      return result;
    },
    onSuccess: ({ products, hasNextPage, totalCount }) => {
      setProducts(products, isInitial);
      setHasNextPage(hasNextPage);
      setTotalCount(totalCount);
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { setProducts, setTotalCount } = useProductsStore();

  return useMutation({
    mutationFn: async (productData) => {
      const newProduct = await addProductAPI(productData);
      return newProduct;
    },
    onSuccess: (newProduct) => {
      setProducts([newProduct], false);
      setTotalCount((prev) => prev + 1);
      queryClient.invalidateQueries(['products']);
    },
  });
};

export default useProductsStore;
