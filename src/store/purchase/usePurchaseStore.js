import create from 'zustand';

const usePurchaseStore = create((set) => ({
  // 초기 상태
  isLoading: false,
  error: null,

  // 상태 변경 함수 (액션)
  purchaseStart: () => set({ isLoading: true, error: null }),
  purchaseSuccess: () => set({ isLoading: false, error: null }),
  purchaseFailure: (error) => set({ isLoading: false, error }),
}));

export default usePurchaseStore;
