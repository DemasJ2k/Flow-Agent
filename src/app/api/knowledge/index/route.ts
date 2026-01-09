// Knowledge Base API - Index Management

import { NextResponse } from 'next/server';
import { indexKnowledgeBase, getIndexStatus, clearKnowledgeIndex } from '@/lib/knowledge/embedding';

// Get index status
export async function GET() {
  try {
    const status = await getIndexStatus();

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting index status:', error);
    return NextResponse.json(
      { error: 'Failed to get index status' },
      { status: 500 }
    );
  }
}

// Trigger reindexing
export async function POST() {
  try {
    const result = await indexKnowledgeBase();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to index knowledge base' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentsIndexed: result.documentsIndexed,
      chunksIndexed: result.chunksIndexed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error indexing knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to index knowledge base' },
      { status: 500 }
    );
  }
}

// Clear index
export async function DELETE() {
  try {
    const success = await clearKnowledgeIndex();

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to clear knowledge index' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing knowledge index:', error);
    return NextResponse.json(
      { error: 'Failed to clear knowledge index' },
      { status: 500 }
    );
  }
}
