import { getPineconeService } from "./pinecone";
import type {
  MemoryDocument,
  MemorySearchResult,
  MemoryNamespace,
  MemoryMetadata,
} from "./types";

export * from "./types";

export class MemoryService {
  private pinecone = getPineconeService();

  // Store a conversation message
  async storeConversationMessage(
    userId: string,
    conversationId: string,
    messageId: string,
    content: string,
    role: "user" | "assistant"
  ): Promise<void> {
    const document: MemoryDocument = {
      id: `conv_${conversationId}_${messageId}`,
      content,
      metadata: {
        userId,
        namespace: "conversations",
        conversationId,
        timestamp: Date.now(),
        type: role,
      },
    };

    await this.pinecone.upsertMemory(document);
  }

  // Store journal entry
  async storeJournalEntry(
    userId: string,
    entryId: string,
    title: string,
    content: string
  ): Promise<void> {
    const document: MemoryDocument = {
      id: `journal_${entryId}`,
      content: `${title}\n\n${content}`,
      metadata: {
        userId,
        namespace: "journal",
        entryId,
        title,
        timestamp: Date.now(),
      },
    };

    await this.pinecone.upsertMemory(document);
  }

  // Store strategy
  async storeStrategy(
    userId: string,
    strategyId: string,
    name: string,
    content: string,
    category?: string
  ): Promise<void> {
    const document: MemoryDocument = {
      id: `strategy_${strategyId}`,
      content: `${name}\n\n${content}`,
      metadata: {
        userId,
        namespace: "strategies",
        entryId: strategyId,
        title: name,
        type: category,
        timestamp: Date.now(),
      },
    };

    await this.pinecone.upsertMemory(document);
  }

  // Store tool
  async storeTool(
    userId: string,
    toolId: string,
    name: string,
    content: string,
    category?: string
  ): Promise<void> {
    const document: MemoryDocument = {
      id: `tool_${toolId}`,
      content: `${name}\n\n${content}`,
      metadata: {
        userId,
        namespace: "tools",
        entryId: toolId,
        title: name,
        type: category,
        timestamp: Date.now(),
      },
    };

    await this.pinecone.upsertMemory(document);
  }

  // Store playbook
  async storePlaybook(
    userId: string,
    playbookId: string,
    name: string,
    content: string,
    category?: string
  ): Promise<void> {
    const document: MemoryDocument = {
      id: `playbook_${playbookId}`,
      content: `${name}\n\n${content}`,
      metadata: {
        userId,
        namespace: "playbooks",
        entryId: playbookId,
        title: name,
        type: category,
        timestamp: Date.now(),
      },
    };

    await this.pinecone.upsertMemory(document);
  }

  // Search across a specific namespace
  async search(
    query: string,
    namespace: MemoryNamespace,
    userId: string,
    topK: number = 5
  ): Promise<MemorySearchResult[]> {
    return this.pinecone.searchMemory(query, {
      namespace,
      userId,
      topK,
    });
  }

  // Search across multiple namespaces
  async searchAll(
    query: string,
    namespaces: MemoryNamespace[],
    userId: string,
    topK: number = 3
  ): Promise<MemorySearchResult[]> {
    const searches = namespaces.map((namespace) =>
      this.search(query, namespace, userId, topK)
    );

    const results = await Promise.all(searches);
    const allResults = results.flat();

    // Sort by score and return top results
    return allResults.sort((a, b) => b.score - a.score).slice(0, topK * 2);
  }

  // Get context for AI chat
  async getRelevantContext(
    query: string,
    userId: string,
    options: {
      includeConversations?: boolean;
      includeJournal?: boolean;
      includeStrategies?: boolean;
      includeTools?: boolean;
      includePlaybooks?: boolean;
      topK?: number;
    } = {}
  ): Promise<string> {
    const {
      includeConversations = true,
      includeJournal = true,
      includeStrategies = true,
      includeTools = false,
      includePlaybooks = false,
      topK = 3,
    } = options;

    const namespaces: MemoryNamespace[] = [];
    if (includeConversations) namespaces.push("conversations");
    if (includeJournal) namespaces.push("journal");
    if (includeStrategies) namespaces.push("strategies");
    if (includeTools) namespaces.push("tools");
    if (includePlaybooks) namespaces.push("playbooks");

    if (namespaces.length === 0) return "";

    const results = await this.searchAll(query, namespaces, userId, topK);

    if (results.length === 0) return "";

    // Format context
    let context = "## Relevant Context from Your Trading History\n\n";

    for (const result of results) {
      const source = result.metadata.namespace;
      const title = result.metadata.title || "Untitled";

      context += `### ${source.charAt(0).toUpperCase() + source.slice(1)}: ${title}\n`;
      context += `${result.content}\n\n`;
    }

    return context;
  }

  // Delete memory
  async deleteMemory(
    id: string,
    namespace: MemoryNamespace
  ): Promise<void> {
    await this.pinecone.deleteMemory(id, namespace);
  }

  // Delete user's all memories
  async deleteUserMemories(
    userId: string,
    namespace?: MemoryNamespace
  ): Promise<void> {
    await this.pinecone.deleteUserMemories(userId, namespace);
  }
}

// Singleton instance
let memoryService: MemoryService | null = null;

export function getMemoryService(): MemoryService {
  if (!memoryService) {
    memoryService = new MemoryService();
  }
  return memoryService;
}
