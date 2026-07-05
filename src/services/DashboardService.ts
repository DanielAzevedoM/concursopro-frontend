import { ApiService } from './ApiService';

export const DashboardService = {
  getMetrics: async () => {
    return await ApiService.get<any>('/dashboard');
  }
};
