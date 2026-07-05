import { ApiService } from './ApiService';

export const AuthService = {
  login: async (data: any) => {
    return await ApiService.post<any>('/auth/login', data);
  },
  register: async (data: any) => {
    return await ApiService.post<any>('/auth/register', data);
  },
  getMe: async () => {
    return await ApiService.get<any>('/auth/me');
  },
  forgotPassword: async (email: string) => {
    return await ApiService.post<any>('/auth/forgot-password', { email });
  },
  resetPassword: async (email: string, code: string, newPassword: string) => {
    return await ApiService.post<any>('/auth/reset-password', { email, code, newPassword });
  }
};
