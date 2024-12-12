import { useMutation, useQuery } from '@tanstack/react-query';
import create from 'zustand';
import { registerUserAPI } from '../../api/auth';

// TanStack Query 훅: 사용자 등록
export const useRegisterUser = () => {
  return useMutation(registerUserAPI);
};

// TanStack Query: 사용자 정보 가져오기 API 호출
const fetchUser = async () => {
  const response = await fetch('/api/auth/user');
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// TanStack Query 훅: 사용자 정보 가져오기
export const useAuth = () => {
  return useQuery(['auth'], fetchUser, {
    staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
  });
};

// Zustand: 클라이언트 상태 관리
export const useAuthStore = create((set) => ({
  isLogin: false,
  user: null,
  setIsLogin: (isLogin) => set({ isLogin }),
  setUser: (user) => set({ user, isLogin: !!user }),
  logout: () => set({ isLogin: false, user: null }),
}));
