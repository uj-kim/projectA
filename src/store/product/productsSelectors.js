const useProductsData = ({ filter, pageSize, page }) => {
  const { data, isLoading, error } = useLoadProducts({
    filter,
    pageSize,
    page,
  });

  return {
    products: data?.items || [],
    hasNextPage: data?.hasNextPage || false,
    isLoading,
    error,
    totalCount: data?.totalCount || 0,
  };
};
