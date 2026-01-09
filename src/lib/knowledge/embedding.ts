// Knowledge Base Embedding Service

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import {
  KnowledgeChunk,
  KnowledgeSearchResult,
  KnowledgeSearchParams,
  KnowledgeIndexStatus,
  KnowledgeCategory,
  KNOWLEDGE_EMBEDDING_CONFIG,
} from '@/types/knowledge';
import { chunkAllDocuments, getKnowledgeDocument } from './index';

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const PINECONE_INDEX = process.env.PINECONE_INDEX || 'trading-ai';
const KNOWLEDGE_NAMESPACE = KNOWLEDGE_EMBEDDING_CONFIG.namespace;

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: KNOWLEDGE_EMBEDDING_CONFIG.embeddingModel,
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in batch
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: KNOWLEDGE_EMBEDDING_CONFIG.embeddingModel,
    input: texts,
  });

  return response.data.map(d => d.embedding);
}

/**
 * Index all knowledge base documents
 */
export async function indexKnowledgeBase(): Promise<{
  success: boolean;
  documentsIndexed: number;
  chunksIndexed: number;
  error?: string;
}> {
  try {
    const { documents, chunks } = await chunkAllDocuments();

    if (chunks.length === 0) {
      return {
        success: true,
        documentsIndexed: 0,
        chunksIndexed: 0,
      };
    }

    const index = pinecone.index(PINECONE_INDEX);

    // Generate embeddings in batches
    const batchSize = 100;
    const vectors: Array<{
      id: string;
      values: number[];
      metadata: Record<string, string | number | boolean | string[]>;
    }> = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const texts = batch.map(c => c.content);
      const embeddings = await generateEmbeddings(texts);

      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        vectors.push({
          id: chunk.id,
          values: embeddings[j],
          metadata: {
            documentId: chunk.documentId,
            content: chunk.content.slice(0, 1000), // Limit metadata size
            title: chunk.metadata.title,
            category: chunk.metadata.category,
            subcategory: chunk.metadata.subcategory,
            section: chunk.metadata.section || '',
            tags: chunk.metadata.tags,
            chunkIndex: chunk.metadata.chunkIndex,
            totalChunks: chunk.metadata.totalChunks,
          },
        });
      }
    }

    // Upsert vectors to Pinecone
    const upsertBatchSize = 100;
    for (let i = 0; i < vectors.length; i += upsertBatchSize) {
      const batch = vectors.slice(i, i + upsertBatchSize);
      await index.namespace(KNOWLEDGE_NAMESPACE).upsert(batch);
    }

    return {
      success: true,
      documentsIndexed: documents.length,
      chunksIndexed: chunks.length,
    };
  } catch (error) {
    console.error('Error indexing knowledge base:', error);
    return {
      success: false,
      documentsIndexed: 0,
      chunksIndexed: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Search knowledge base using semantic search
 */
export async function searchKnowledge(
  params: KnowledgeSearchParams
): Promise<KnowledgeSearchResult[]> {
  try {
    const { query, category, subcategory, limit = 10 } = params;

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    const index = pinecone.index(PINECONE_INDEX);

    // Build filter
    const filter: Record<string, string | Record<string, string[]>> = {};
    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Query Pinecone
    const queryResponse = await index.namespace(KNOWLEDGE_NAMESPACE).query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    // Transform results
    const results: KnowledgeSearchResult[] = [];

    for (const match of queryResponse.matches) {
      const metadata = match.metadata as Record<string, unknown>;

      // Get full document
      const document = await getKnowledgeDocument(
        metadata.category as KnowledgeCategory,
        metadata.subcategory as string
      );

      if (!document) continue;

      const chunk: KnowledgeChunk = {
        id: match.id,
        documentId: metadata.documentId as string,
        content: metadata.content as string,
        metadata: {
          title: metadata.title as string,
          category: metadata.category as KnowledgeCategory,
          subcategory: metadata.subcategory as string,
          section: metadata.section as string,
          tags: metadata.tags as string[],
          chunkIndex: metadata.chunkIndex as number,
          totalChunks: metadata.totalChunks as number,
        },
      };

      results.push({
        document,
        chunk,
        score: match.score || 0,
        highlights: extractHighlights(chunk.content, query),
      });
    }

    return results;
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
}

/**
 * Get knowledge base index status
 */
export async function getIndexStatus(): Promise<KnowledgeIndexStatus[]> {
  try {
    const index = pinecone.index(PINECONE_INDEX);
    const stats = await index.describeIndexStats();

    const namespaceStats = stats.namespaces?.[KNOWLEDGE_NAMESPACE];

    if (!namespaceStats) {
      return [
        { category: 'ict', totalDocuments: 0, totalChunks: 0, status: 'pending' },
        { category: 'scalping', totalDocuments: 0, totalChunks: 0, status: 'pending' },
        { category: 'general', totalDocuments: 0, totalChunks: 0, status: 'pending' },
      ];
    }

    // We can't get per-category stats directly, so return aggregate
    const totalChunks = namespaceStats.recordCount || 0;

    return [
      {
        category: 'ict',
        totalDocuments: 7,
        totalChunks: Math.floor(totalChunks * 0.5), // Estimate
        status: totalChunks > 0 ? 'indexed' : 'pending',
      },
      {
        category: 'scalping',
        totalDocuments: 6,
        totalChunks: Math.floor(totalChunks * 0.5), // Estimate
        status: totalChunks > 0 ? 'indexed' : 'pending',
      },
      {
        category: 'general',
        totalDocuments: 0,
        totalChunks: 0,
        status: 'pending',
      },
    ];
  } catch (error) {
    console.error('Error getting index status:', error);
    return [
      { category: 'ict', totalDocuments: 0, totalChunks: 0, status: 'error' },
      { category: 'scalping', totalDocuments: 0, totalChunks: 0, status: 'error' },
      { category: 'general', totalDocuments: 0, totalChunks: 0, status: 'error' },
    ];
  }
}

/**
 * Delete all knowledge base vectors
 */
export async function clearKnowledgeIndex(): Promise<boolean> {
  try {
    const index = pinecone.index(PINECONE_INDEX);
    await index.namespace(KNOWLEDGE_NAMESPACE).deleteAll();
    return true;
  } catch (error) {
    console.error('Error clearing knowledge index:', error);
    return false;
  }
}

/**
 * Get relevant knowledge for AI context
 */
export async function getRelevantKnowledge(
  query: string,
  limit: number = 5
): Promise<string> {
  const results = await searchKnowledge({ query, limit });

  if (results.length === 0) {
    return '';
  }

  // Format knowledge for AI context
  const context = results.map((r, i) => {
    return `[Knowledge ${i + 1}: ${r.document.title} - ${r.chunk.metadata.section || 'General'}]
${r.chunk.content}
`;
  });

  return `## Relevant Trading Knowledge:\n\n${context.join('\n---\n\n')}`;
}

// Helper function to extract highlights
function extractHighlights(content: string, query: string): string[] {
  const highlights: string[] = [];
  const queryTerms = query.toLowerCase().split(/\s+/);
  const sentences = content.split(/[.!?]+/);

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase();
    if (queryTerms.some(term => sentenceLower.includes(term))) {
      highlights.push(sentence.trim());
      if (highlights.length >= 3) break;
    }
  }

  return highlights;
}
