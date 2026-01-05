export type MemoryNamespace =
  | "conversations"
  | "journal"
  | "strategies"
  | "tools"
  | "playbooks"
  | "knowledge-base";

export interface MemoryMetadata {
  userId: string;
  namespace: MemoryNamespace;
  conversationId?: string;
  entryId?: string;
  timestamp: number;
  title?: string;
  type?: string;
}

export interface MemoryDocument {
  id: string;
  content: string;
  metadata: MemoryMetadata;
  embedding?: number[];
}

export interface MemorySearchResult {
  id: string;
  score: number;
  content: string;
  metadata: MemoryMetadata;
}

export interface MemorySearchOptions {
  namespace: MemoryNamespace;
  topK?: number;
  filter?: Record<string, any>;
  userId: string;
}
