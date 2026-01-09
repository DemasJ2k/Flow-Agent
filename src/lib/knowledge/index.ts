// Knowledge Base Service

import { promises as fs } from 'fs';
import path from 'path';
import {
  KnowledgeDocument,
  KnowledgeChunk,
  KnowledgeCategory,
  ChunkMetadata,
  KNOWLEDGE_EMBEDDING_CONFIG,
  ICT_SUBCATEGORIES,
  SCALPING_SUBCATEGORIES,
  SUBCATEGORY_LABELS,
} from '@/types/knowledge';

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'knowledge-base');

/**
 * Get all knowledge documents from a category
 */
export async function getKnowledgeDocuments(
  category?: KnowledgeCategory
): Promise<KnowledgeDocument[]> {
  const documents: KnowledgeDocument[] = [];

  const categories: KnowledgeCategory[] = category
    ? [category]
    : ['ict', 'scalping', 'general'];

  for (const cat of categories) {
    const categoryPath = path.join(KNOWLEDGE_BASE_PATH, cat);

    try {
      const files = await fs.readdir(categoryPath);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(categoryPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        const subcategory = file.replace('.md', '');
        const title = extractTitle(content) || SUBCATEGORY_LABELS[subcategory] || subcategory;
        const tags = extractTags(content, cat, subcategory);
        const summary = extractSummary(content);

        documents.push({
          id: `${cat}-${subcategory}`,
          title,
          category: cat,
          subcategory,
          content,
          summary,
          tags,
          filePath,
          lastModified: stats.mtime,
        });
      }
    } catch {
      // Category folder doesn't exist, skip
      continue;
    }
  }

  return documents;
}

/**
 * Get a single knowledge document
 */
export async function getKnowledgeDocument(
  category: KnowledgeCategory,
  subcategory: string
): Promise<KnowledgeDocument | null> {
  const filePath = path.join(KNOWLEDGE_BASE_PATH, category, `${subcategory}.md`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);

    const title = extractTitle(content) || SUBCATEGORY_LABELS[subcategory] || subcategory;
    const tags = extractTags(content, category, subcategory);
    const summary = extractSummary(content);

    return {
      id: `${category}-${subcategory}`,
      title,
      category,
      subcategory,
      content,
      summary,
      tags,
      filePath,
      lastModified: stats.mtime,
    };
  } catch {
    return null;
  }
}

/**
 * Get all subcategories for a category
 */
export function getSubcategories(category: KnowledgeCategory): string[] {
  switch (category) {
    case 'ict':
      return [...ICT_SUBCATEGORIES];
    case 'scalping':
      return [...SCALPING_SUBCATEGORIES];
    default:
      return [];
  }
}

/**
 * Chunk a document for embedding
 */
export function chunkDocument(document: KnowledgeDocument): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const { chunkSize, chunkOverlap } = KNOWLEDGE_EMBEDDING_CONFIG;

  // Split content into sections based on headers
  const sections = splitIntoSections(document.content);

  for (const section of sections) {
    const sectionChunks = chunkText(section.content, chunkSize, chunkOverlap);

    sectionChunks.forEach((chunkContent, index) => {
      chunks.push({
        id: `${document.id}-${section.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        documentId: document.id,
        content: chunkContent,
        metadata: {
          title: document.title,
          category: document.category,
          subcategory: document.subcategory,
          section: section.title,
          tags: document.tags,
          chunkIndex: index,
          totalChunks: sectionChunks.length,
        },
      });
    });
  }

  // If no sections found, chunk the entire document
  if (chunks.length === 0) {
    const textChunks = chunkText(document.content, chunkSize, chunkOverlap);

    textChunks.forEach((chunkContent, index) => {
      chunks.push({
        id: `${document.id}-${index}`,
        documentId: document.id,
        content: chunkContent,
        metadata: {
          title: document.title,
          category: document.category,
          subcategory: document.subcategory,
          tags: document.tags,
          chunkIndex: index,
          totalChunks: textChunks.length,
        },
      });
    });
  }

  return chunks;
}

/**
 * Chunk all documents in the knowledge base
 */
export async function chunkAllDocuments(): Promise<{
  documents: KnowledgeDocument[];
  chunks: KnowledgeChunk[];
}> {
  const documents = await getKnowledgeDocuments();
  const allChunks: KnowledgeChunk[] = [];

  for (const doc of documents) {
    const chunks = chunkDocument(doc);
    allChunks.push(...chunks);
  }

  return { documents, chunks: allChunks };
}

// Helper functions

function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractSummary(content: string): string | undefined {
  // Look for ## Overview or ## Summary section
  const overviewMatch = content.match(/##\s+(Overview|Summary)\s*\n([\s\S]*?)(?=\n##|\n$)/i);
  if (overviewMatch) {
    return overviewMatch[2].trim().slice(0, 500);
  }

  // Otherwise, get first paragraph after title
  const paragraphMatch = content.match(/^#[^\n]+\n\n([^\n#]+)/);
  return paragraphMatch ? paragraphMatch[1].trim().slice(0, 500) : undefined;
}

function extractTags(content: string, category: string, subcategory: string): string[] {
  const tags = new Set<string>([category, subcategory]);

  // Extract tags from headers
  const headerMatches = content.matchAll(/^#{2,4}\s+(.+)$/gm);
  for (const match of headerMatches) {
    const header = match[1].toLowerCase();
    if (header.length < 30) {
      tags.add(header.replace(/[^a-z0-9\s]/g, '').trim());
    }
  }

  // Add common trading terms found in content
  const tradingTerms = [
    'support', 'resistance', 'trend', 'breakout', 'reversal',
    'entry', 'exit', 'stop loss', 'take profit', 'risk management',
    'bullish', 'bearish', 'momentum', 'volume', 'price action',
    'fibonacci', 'ema', 'rsi', 'macd', 'bollinger',
  ];

  for (const term of tradingTerms) {
    if (content.toLowerCase().includes(term)) {
      tags.add(term);
    }
  }

  return Array.from(tags).slice(0, 20);
}

interface Section {
  title: string;
  content: string;
}

function splitIntoSections(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split('\n');

  let currentSection: Section | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);

    if (headerMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
      }

      currentSection = {
        title: headerMatch[2].trim(),
        content: '',
      };
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
  }

  return sections;
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];

  if (text.length <= chunkSize) {
    return [text];
  }

  let start = 0;
  while (start < text.length) {
    let end = start + chunkSize;

    // Try to break at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start + chunkSize / 2) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;

    if (start >= text.length - overlap) {
      break;
    }
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Search knowledge base content locally (without embeddings)
 */
export async function searchKnowledgeLocal(
  query: string,
  category?: KnowledgeCategory,
  limit: number = 10
): Promise<KnowledgeDocument[]> {
  const documents = await getKnowledgeDocuments(category);
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);

  // Score each document based on query match
  const scored = documents.map(doc => {
    let score = 0;
    const contentLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();

    // Title match (high weight)
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score += 10;
      }
    }

    // Tag match (medium weight)
    for (const term of queryTerms) {
      if (doc.tags.some(tag => tag.includes(term))) {
        score += 5;
      }
    }

    // Content match (lower weight, based on frequency)
    for (const term of queryTerms) {
      const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
      score += Math.min(matches, 10); // Cap at 10 to avoid over-weighting
    }

    return { doc, score };
  });

  // Sort by score and return top results
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.doc);
}
