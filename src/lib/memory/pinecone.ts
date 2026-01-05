import { Pinecone } from "@pinecone-database/pinecone";
import type {
  MemoryDocument,
  MemorySearchResult,
  MemorySearchOptions,
  MemoryMetadata,
} from "./types";
import { getEmbeddingService } from "./embeddings";

export class PineconeMemoryService {
  private client: Pinecone;
  private indexName: string;
  private embeddingService = getEmbeddingService();

  constructor() {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not set");
    }

    this.client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || "trading-ai-memory";
  }

  private async getIndex() {
    return this.client.index(this.indexName);
  }

  async upsertMemory(document: MemoryDocument): Promise<void> {
    try {
      const index = await this.getIndex();

      // Generate embedding if not provided
      const embedding = document.embedding ||
        await this.embeddingService.generateEmbedding(document.content);

      await index.namespace(document.metadata.namespace).upsert([
        {
          id: document.id,
          values: embedding,
          metadata: {
            ...document.metadata,
            content: document.content,
          },
        },
      ]);
    } catch (error) {
      console.error("Error upserting memory:", error);
      throw new Error("Failed to store memory");
    }
  }

  async upsertMemories(documents: MemoryDocument[]): Promise<void> {
    try {
      if (documents.length === 0) return;

      const index = await this.getIndex();

      // Group documents by namespace
      const docsByNamespace = documents.reduce((acc, doc) => {
        const ns = doc.metadata.namespace;
        if (!acc[ns]) acc[ns] = [];
        acc[ns].push(doc);
        return acc;
      }, {} as Record<string, MemoryDocument[]>);

      // Generate embeddings for all documents at once
      const textsToEmbed = documents
        .filter(doc => !doc.embedding)
        .map(doc => doc.content);

      const embeddings = textsToEmbed.length > 0
        ? await this.embeddingService.generateEmbeddings(textsToEmbed)
        : [];

      let embeddingIndex = 0;

      // Upsert for each namespace
      for (const [namespace, docs] of Object.entries(docsByNamespace)) {
        const vectors = docs.map((doc) => {
          const embedding = doc.embedding || embeddings[embeddingIndex++];

          return {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              content: doc.content,
            },
          };
        });

        await index.namespace(namespace).upsert(vectors);
      }
    } catch (error) {
      console.error("Error upserting memories:", error);
      throw new Error("Failed to store memories");
    }
  }

  async searchMemory(
    query: string,
    options: MemorySearchOptions
  ): Promise<MemorySearchResult[]> {
    try {
      const index = await this.getIndex();
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      const queryOptions: any = {
        vector: queryEmbedding,
        topK: options.topK || 5,
        includeMetadata: true,
      };

      // Add user filter to only retrieve user's own memories
      if (options.filter) {
        queryOptions.filter = {
          ...options.filter,
          userId: options.userId,
        };
      } else {
        queryOptions.filter = { userId: options.userId };
      }

      const response = await index.namespace(options.namespace).query(queryOptions);

      return (response.matches || []).map((match) => ({
        id: match.id,
        score: match.score || 0,
        content: (match.metadata?.content as string) || "",
        metadata: match.metadata as unknown as MemoryMetadata,
      }));
    } catch (error) {
      console.error("Error searching memory:", error);
      throw new Error("Failed to search memory");
    }
  }

  async deleteMemory(id: string, namespace: string): Promise<void> {
    try {
      const index = await this.getIndex();
      await index.namespace(namespace).deleteOne(id);
    } catch (error) {
      console.error("Error deleting memory:", error);
      throw new Error("Failed to delete memory");
    }
  }

  async deleteMemories(ids: string[], namespace: string): Promise<void> {
    try {
      const index = await this.getIndex();
      await index.namespace(namespace).deleteMany(ids);
    } catch (error) {
      console.error("Error deleting memories:", error);
      throw new Error("Failed to delete memories");
    }
  }

  async deleteUserMemories(userId: string, namespace?: string): Promise<void> {
    try {
      const index = await this.getIndex();
      const filter = { userId };

      if (namespace) {
        await index.namespace(namespace).deleteMany(filter);
      } else {
        // Delete from all namespaces
        const namespaces = [
          "conversations",
          "journal",
          "strategies",
          "tools",
          "playbooks",
          "knowledge-base",
        ];

        for (const ns of namespaces) {
          await index.namespace(ns).deleteMany(filter);
        }
      }
    } catch (error) {
      console.error("Error deleting user memories:", error);
      throw new Error("Failed to delete user memories");
    }
  }
}

// Singleton instance
let pineconeService: PineconeMemoryService | null = null;

export function getPineconeService(): PineconeMemoryService {
  if (!pineconeService) {
    pineconeService = new PineconeMemoryService();
  }
  return pineconeService;
}
