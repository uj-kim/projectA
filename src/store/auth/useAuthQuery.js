import { useMutation } from '@tanstack/react-query';
import { registerUserAPI } from '@/api/auth';

export function useRegisterUser() {
  return useMutation({
    mutationFn: async ({ email, password, name }) => {
      return await registerUserAPI(email, password, name);
    },
  });
}
