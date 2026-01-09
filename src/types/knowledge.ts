// Knowledge Base Types

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  content: string;
  summary?: string;
  tags: string[];
  filePath: string;
  lastModified?: Date;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: ChunkMetadata;
  embedding?: number[];
}

export interface ChunkMetadata {
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  section?: string;
  tags: string[];
  chunkIndex: number;
  totalChunks: number;
}

export type KnowledgeCategory = 'ict' | 'scalping' | 'general';

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;
  highlights?: string[];
}

export interface KnowledgeSearchParams {
  query: string;
  category?: KnowledgeCategory;
  subcategory?: string;
  tags?: string[];
  limit?: number;
}

export interface KnowledgeIndexStatus {
  category: KnowledgeCategory;
  totalDocuments: number;
  totalChunks: number;
  lastIndexed?: Date;
  status: 'indexed' | 'pending' | 'error';
}

// Category metadata
export const KNOWLEDGE_CATEGORIES: Record<KnowledgeCategory, {
  label: string;
  description: string;
  color: string;
}> = {
  ict: {
    label: 'ICT Concepts',
    description: 'Inner Circle Trader methodology and concepts',
    color: 'blue',
  },
  scalping: {
    label: 'Scalping',
    description: 'Short-term trading techniques and strategies',
    color: 'green',
  },
  general: {
    label: 'General',
    description: 'General trading knowledge and concepts',
    color: 'gray',
  },
};

// ICT subcategories
export const ICT_SUBCATEGORIES = [
  'order-blocks',
  'fair-value-gaps',
  'liquidity-pools',
  'market-structure',
  'killzones',
  'optimal-trade-entry',
  'breaker-blocks',
] as const;

export type ICTSubcategory = typeof ICT_SUBCATEGORIES[number];

// Scalping subcategories
export const SCALPING_SUBCATEGORIES = [
  'entry-techniques',
  'risk-management',
  'market-conditions',
  'technical-indicators',
  'trading-psychology',
  'position-sizing',
] as const;

export type ScalpingSubcategory = typeof SCALPING_SUBCATEGORIES[number];

// Subcategory labels
export const SUBCATEGORY_LABELS: Record<string, string> = {
  // ICT
  'order-blocks': 'Order Blocks',
  'fair-value-gaps': 'Fair Value Gaps',
  'liquidity-pools': 'Liquidity Pools',
  'market-structure': 'Market Structure',
  'killzones': 'Killzones',
  'optimal-trade-entry': 'Optimal Trade Entry',
  'breaker-blocks': 'Breaker Blocks',
  // Scalping
  'entry-techniques': 'Entry Techniques',
  'risk-management': 'Risk Management',
  'market-conditions': 'Market Conditions',
  'technical-indicators': 'Technical Indicators',
  'trading-psychology': 'Trading Psychology',
  'position-sizing': 'Position Sizing',
};

// Knowledge embedding config
export const KNOWLEDGE_EMBEDDING_CONFIG = {
  chunkSize: 1000, // characters per chunk
  chunkOverlap: 200, // overlap between chunks
  namespace: 'knowledge-base',
  embeddingModel: 'text-embedding-3-small',
};
