// Knowledge Base API - List Documents

import { NextResponse } from 'next/server';
import { getKnowledgeDocuments } from '@/lib/knowledge';
import { KnowledgeCategory } from '@/types/knowledge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as KnowledgeCategory | null;

    const documents = await getKnowledgeDocuments(category || undefined);

    return NextResponse.json({
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        subcategory: doc.subcategory,
        summary: doc.summary,
        tags: doc.tags,
        lastModified: doc.lastModified,
      })),
      total: documents.length,
    });
  } catch (error) {
    console.error('Error fetching knowledge documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge documents' },
      { status: 500 }
    );
  }
}
