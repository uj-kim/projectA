import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools((set) => ({
    isLogin: false,
    user: null,
    setIsLogin: (isLogin) => set({ isLogin }),
    setUser: (user) => set({ user, isLogin: true }),
    logout: () => set({ isLogin: false, user: null }),
  }))
);

export default useAuthStore;
