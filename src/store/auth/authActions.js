import { registerUserAPI } from '@/api/auth';
// import { createAsyncThunk } from '@reduxjs/toolkit';
import { useMutation } from '@tanstack/react-query';

// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async ({ email, password, name }, { rejectWithValue }) => {
//     try {
//       return await registerUserAPI(email, password, name);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
const useRegisterUser = () => {
  return useMutation(async ({ email, password, name }) => {
    const response = await registerUserAPI(email, password, name);
    return response;
  });
};

export default useRegisterUser;
