import { apiClient } from './api';
import { AskInput, AskResponse } from '../types/memory';

export const askService = {
  // POST /api/ask
  askQuestion: async (data: AskInput): Promise<AskResponse> => {
    const response = await apiClient.post<AskResponse>('/api/ask', data);
    return response.data;
  },
};

