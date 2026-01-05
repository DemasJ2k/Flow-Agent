import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isPineconeConfigured =
      !!process.env.PINECONE_API_KEY && !!process.env.PINECONE_INDEX_NAME;
    const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;

    return NextResponse.json({
      enabled: isPineconeConfigured && isOpenAIConfigured,
      pineconeConfigured: isPineconeConfigured,
      openaiConfigured: isOpenAIConfigured,
      indexName: process.env.PINECONE_INDEX_NAME || null,
    });
  } catch (error) {
    console.error("Memory status error:", error);
    return NextResponse.json(
      { error: "Failed to check memory status" },
      { status: 500 }
    );
  }
}
