import { fetchProducts, addProductAPI } from '@/api/product';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useLoadProducts = ({ filter, pageSize, page }) => {
  return useQuery(
    ['products', filter, pageSize, page], // 쿼리 키
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
  return useMutation(
    async (productData) => {
      const newProduct = await addProductAPI(productData);
      return newProduct;
    },
    {
      onError: (error) => {
        console.log(error.message);
      },
    }
  );
};
