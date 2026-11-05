import { apiClient } from './api';
import {
  HealthResponse,
  RootResponse,
  MemoryInput,
  MemoryCreateResponse,
  MemoriesListResponse,
  MemorySingleResponse,
  MemoryDeleteResponse,
  MemorySearchResponse,
} from '../types/memory';

export const memoryService = {
  // GET /
  getRoot: async (): Promise<RootResponse> => {
    const response = await apiClient.get<RootResponse>('/');
    return response.data;
  },

  // GET /api/health
  getHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/api/health');
    return response.data;
  },

  // GET /api/memories
  getMemories: async (): Promise<MemoriesListResponse> => {
    const response = await apiClient.get<MemoriesListResponse>('/api/memories');
    return response.data;
  },

  // GET /api/memories/{memory_id}
  getMemoryById: async (memoryId: string): Promise<MemorySingleResponse> => {
    const response = await apiClient.get<MemorySingleResponse>(`/api/memories/${memoryId}`);
    return response.data;
  },

  // POST /api/memories
  createMemory: async (data: MemoryInput): Promise<MemoryCreateResponse> => {
    const response = await apiClient.post<MemoryCreateResponse>('/api/memories', data);
    return response.data;
  },

  // DELETE /api/memories/{memory_id}
  deleteMemory: async (memoryId: string): Promise<MemoryDeleteResponse> => {
    const response = await apiClient.delete<MemoryDeleteResponse>(`/api/memories/${memoryId}`);
    return response.data;
  },

  // GET /api/memories/search?q={query}
  searchMemories: async (query: string): Promise<MemorySearchResponse> => {
    const response = await apiClient.get<MemorySearchResponse>('/api/memories/search', {
      params: { q: query },
    });
    return response.data;
  },
};

