import { useQuery } from '@tanstack/react-query';

// export const selectIsLogin = (state) => state.auth.isLogin;
// export const selectUser = (state) => state.auth.user;
// export const selectRegisterStatus = (state) => state.auth.registerStatus;
// export const selectRegisterError = (state) => state.auth.registerError;

const fetchUser = async () => {
  const response = await fetch('api/auth/user');
  if (!response.ok) throw new Error(error.message);
  return response.json();
};

const useAuth = () => {
  return useQuery(['auth'], fetchUser, {
    staleTime: 5 * 60 * 1000,
  });
};

export default useAuth;
