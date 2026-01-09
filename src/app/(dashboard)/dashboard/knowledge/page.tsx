'use client';

import { useState, useEffect } from 'react';
import {
  Book,
  Search,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KnowledgeCard } from '@/components/knowledge/knowledge-card';
import { KnowledgeSearch } from '@/components/knowledge/knowledge-search';
import { KnowledgeViewer } from '@/components/knowledge/knowledge-viewer';
import { useToast } from '@/components/ui/toast';
import { EmptyState } from '@/components/ui/empty-state';
import {
  KNOWLEDGE_CATEGORIES,
  KnowledgeCategory,
  KnowledgeIndexStatus,
} from '@/types/knowledge';

interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  summary?: string;
  tags: string[];
  lastModified?: Date;
}

export default function KnowledgePage() {
  const { success, error: showError } = useToast();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [indexStatus, setIndexStatus] = useState<KnowledgeIndexStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{
    category: KnowledgeCategory;
    subcategory: string;
  } | null>(null);
  const [view, setView] = useState<'browse' | 'search'>('browse');

  // Fetch documents
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `/api/knowledge?category=${selectedCategory}`
          : '/api/knowledge';
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [selectedCategory]);

  // Fetch index status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/knowledge/index');
        if (response.ok) {
          const data = await response.json();
          setIndexStatus(data.status);
        }
      } catch (error) {
        console.error('Error fetching index status:', error);
      }
    }

    fetchStatus();
  }, []);

  // Handle reindex
  const handleReindex = async () => {
    try {
      setIndexing(true);
      const response = await fetch('/api/knowledge/index', { method: 'POST' });

      if (response.ok) {
        const data = await response.json();
        success(`Indexed ${data.chunksIndexed} chunks from ${data.documentsIndexed} documents`);
        // Refresh status
        const statusResponse = await fetch('/api/knowledge/index');
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setIndexStatus(statusData.status);
        }
      } else {
        showError('Failed to index knowledge base');
      }
    } catch (error) {
      console.error('Error indexing:', error);
      showError('Failed to index knowledge base');
    } finally {
      setIndexing(false);
    }
  };

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<KnowledgeCategory, KnowledgeDocument[]>);

  const totalChunks = indexStatus.reduce((sum, s) => sum + s.totalChunks, 0);
  const isIndexed = totalChunks > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Trading concepts, strategies, and techniques</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Index Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Database className="w-4 h-4 text-gray-400" />
            {isIndexed ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{totalChunks} indexed</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Not indexed</span>
              </>
            )}
          </div>

          {/* Reindex Button */}
          <Button
            onClick={handleReindex}
            disabled={indexing}
            variant="outline"
            size="sm"
          >
            {indexing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {indexing ? 'Indexing...' : 'Reindex'}
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'browse' ? 'default' : 'ghost'}
          onClick={() => setView('browse')}
          size="sm"
        >
          <Book className="w-4 h-4 mr-2" />
          Browse
        </Button>
        <Button
          variant={view === 'search' ? 'default' : 'ghost'}
          onClick={() => setView('search')}
          size="sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Content */}
      {view === 'search' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <KnowledgeSearch
            onSelectResult={(category, subcategory) =>
              setSelectedDoc({ category, subcategory })
            }
          />
        </div>
      ) : (
        <>
          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* All Categories */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-5 rounded-lg border transition-all text-left ${
                !selectedCategory
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${!selectedCategory ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Book className={`w-5 h-5 ${!selectedCategory ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <h3 className="font-semibold text-gray-900">All Topics</h3>
              </div>
              <p className="text-sm text-gray-600">Browse all trading knowledge</p>
              <div className="mt-2 text-xs text-gray-400">{documents.length} documents</div>
            </button>

            {/* ICT Category */}
            <button
              onClick={() => setSelectedCategory('ict')}
              className={`p-5 rounded-lg border transition-all text-left ${
                selectedCategory === 'ict'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${selectedCategory === 'ict' ? 'bg-blue-100' : 'bg-blue-50'}`}>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">ICT Concepts</h3>
              </div>
              <p className="text-sm text-gray-600">{KNOWLEDGE_CATEGORIES.ict.description}</p>
              <div className="mt-2 text-xs text-blue-600">{documentsByCategory.ict?.length || 0} documents</div>
            </button>

            {/* Scalping Category */}
            <button
              onClick={() => setSelectedCategory('scalping')}
              className={`p-5 rounded-lg border transition-all text-left ${
                selectedCategory === 'scalping'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${selectedCategory === 'scalping' ? 'bg-green-100' : 'bg-green-50'}`}>
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Scalping</h3>
              </div>
              <p className="text-sm text-gray-600">{KNOWLEDGE_CATEGORIES.scalping.description}</p>
              <div className="mt-2 text-xs text-green-600">{documentsByCategory.scalping?.length || 0} documents</div>
            </button>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : documents.length === 0 ? (
              <EmptyState
                icon="document"
                title="No documents found"
                description="Knowledge base documents will appear here once added."
              />
            ) : (
              <>
                {!selectedCategory ? (
                  Object.entries(documentsByCategory).map(([category, docs]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {KNOWLEDGE_CATEGORIES[category as KnowledgeCategory].label}
                          <span className="text-sm font-normal text-gray-400">({docs.length})</span>
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory(category as KnowledgeCategory)}
                        >
                          View all
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {docs.slice(0, 3).map((doc) => (
                          <KnowledgeCard
                            key={doc.id}
                            {...doc}
                            onClick={() =>
                              setSelectedDoc({
                                category: doc.category,
                                subcategory: doc.subcategory,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <KnowledgeCard
                        key={doc.id}
                        {...doc}
                        onClick={() =>
                          setSelectedDoc({
                            category: doc.category,
                            subcategory: doc.subcategory,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <KnowledgeViewer
          category={selectedDoc.category}
          subcategory={selectedDoc.subcategory}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
