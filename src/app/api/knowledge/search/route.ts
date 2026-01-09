// Knowledge Base API - Search

import { NextResponse } from 'next/server';
import { searchKnowledge } from '@/lib/knowledge/embedding';
import { searchKnowledgeLocal } from '@/lib/knowledge';
import { KnowledgeCategory } from '@/types/knowledge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') as KnowledgeCategory | null;
    const subcategory = searchParams.get('subcategory');
    const limit = parseInt(searchParams.get('limit') || '10');
    const useEmbeddings = searchParams.get('embeddings') !== 'false';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Try semantic search first, fall back to local search
    if (useEmbeddings && process.env.PINECONE_API_KEY && process.env.OPENAI_API_KEY) {
      const results = await searchKnowledge({
        query,
        category: category || undefined,
        subcategory: subcategory || undefined,
        limit,
      });

      return NextResponse.json({
        results: results.map(r => ({
          id: r.document.id,
          title: r.document.title,
          category: r.document.category,
          subcategory: r.document.subcategory,
          excerpt: r.chunk.content.slice(0, 300),
          section: r.chunk.metadata.section,
          score: r.score,
          highlights: r.highlights,
        })),
        total: results.length,
        method: 'semantic',
      });
    }

    // Fall back to local keyword search
    const documents = await searchKnowledgeLocal(query, category || undefined, limit);

    return NextResponse.json({
      results: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        subcategory: doc.subcategory,
        excerpt: doc.summary || doc.content.slice(0, 300),
        section: null,
        score: null,
        highlights: [],
      })),
      total: documents.length,
      method: 'keyword',
    });
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to search knowledge base' },
      { status: 500 }
    );
  }
}
