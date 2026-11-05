export interface Memory {
  id: string;
  content: string;
  importance: number;
  created_at: string;
}

export interface MemoryInput {
  content: string;
  importance?: number;
}

export interface MemoryCreateResponse {
  message: string;
  memory: Memory;
}

export interface MemoriesListResponse {
  count: number;
  memories: Memory[];
}

export interface MemorySingleResponse {
  message: string;
  memory: Memory;
}

export interface MemoryDeleteResponse {
  message: string;
  memory: Memory;
}

export interface MemorySearchResponse {
  query: string;
  count: number;
  memories: Memory[];
}

export interface AskInput {
  query: string;
}

export interface AskResponse {
  query: string;
  answer: string;
  memories_used: Memory[];
}

export interface HealthResponse {
  status: string;
  total_memories: number;
}

export interface RootResponse {
  message: string;
  status: string;
}

