// Knowledge Base API - Get Single Document

import { NextResponse } from 'next/server';
import { getKnowledgeDocument } from '@/lib/knowledge';
import { KnowledgeCategory } from '@/types/knowledge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string; subcategory: string }> }
) {
  try {
    const { category, subcategory } = await params;

    const document = await getKnowledgeDocument(
      category as KnowledgeCategory,
      subcategory
    );

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error fetching knowledge document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge document' },
      { status: 500 }
    );
  }
}
