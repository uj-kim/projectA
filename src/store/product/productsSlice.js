import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProductAPI } from '@/api/product';

export const useLoadProducts = ({ filter, pageSize, page }) => {
  return useQuery(
    ['products', filter, pageSize, page],
    async () => {
      const result = await fetchProducts(filter, pageSize, page);
      return result;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      onError: (error) => {
        console.error(error.message);
      },
    }
  );
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (productData) => {
      const newProduct = await addProductAPI(productData);
      return newProduct;
    },
    {
      onSuccess: (newProduct) => {
        // 캐시 무효화: products 키의 데이터를 새로고침
        queryClient.invalidateQueries(['products']);
        console.log('Product added successfully:', newProduct);
      },
      onError: (error) => {
        console.error(error.message);
      },
    }
  );
};
