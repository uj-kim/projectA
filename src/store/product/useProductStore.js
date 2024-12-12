import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProductAPI } from '@/api/product';

// Fetch products (React Query)
export const useProductsData = ({ filter, pageSize, page }) => {
  return useQuery(
    ['products', filter, pageSize, page], // 쿼리 키
    async () => {
      const result = await fetchProducts(filter, pageSize, page);
      return result;
    },
    {
      staleTime: 5 * 60 * 1000, // 데이터가 신선하다고 간주되는 시간
      cacheTime: 10 * 60 * 1000, // 캐시 유지 시간
      onError: (error) => {
        console.error('Error loading products:', error.message);
      },
    }
  );
};

// Add product (React Query)
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (productData) => {
      const newProduct = await addProductAPI(productData);
      return newProduct;
    },
    {
      onSuccess: (newProduct) => {
        // Optimistic update or cache invalidation
        queryClient.invalidateQueries(['products']);
        console.log('Product added successfully:', newProduct);
      },
      onError: (error) => {
        console.error('Error adding product:', error.message);
      },
    }
  );
};
