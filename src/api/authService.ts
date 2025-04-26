import { SignUpProps } from '@/types/sign-up-type';
import axios from './apiClient';

export const signUpUser = async (signUpData: SignUpProps) => {
  const { data } = await axios.post('/signup', signUpData);
  return data;
};

export const sendForgotPassMail = async (email: string) => {
  const { data } = await axios.post('/password/forget', email);
  return data;
};

export type ResetPasswordData = {
  resetToken: string;
  password: string;
  emailId: string;
};

export const resetPassword = async (formData: ResetPasswordData) => {
  const { data } = await axios.post('/password/reset', formData);
  return data;
};

export const getUserDetails = async () => {
  const { data } = await axios.get('/user');
  return data;
};

interface UserData {
  emailId?: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateUserProps {
  userData: UserData;
}

export const updateUserDetails = async ({ userData }: UpdateUserProps) => {
  const { data } = await axios.put(`/profile`, userData);
  return data;
};
