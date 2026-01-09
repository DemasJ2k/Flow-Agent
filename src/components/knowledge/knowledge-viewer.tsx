'use client';

import { useState, useEffect } from 'react';
import { X, Book, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KNOWLEDGE_CATEGORIES, SUBCATEGORY_LABELS, KnowledgeCategory } from '@/types/knowledge';
import ReactMarkdown from 'react-markdown';

interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  content: string;
  summary?: string;
  tags: string[];
  lastModified?: Date;
}

interface KnowledgeViewerProps {
  category: KnowledgeCategory;
  subcategory: string;
  onClose: () => void;
}

export function KnowledgeViewer({
  category,
  subcategory,
  onClose,
}: KnowledgeViewerProps) {
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        const response = await fetch(`/api/knowledge/${category}/${subcategory}`);

        if (!response.ok) {
          throw new Error('Document not found');
        }

        const data = await response.json();
        setDocument(data.document);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [category, subcategory]);

  const categoryInfo = KNOWLEDGE_CATEGORIES[category];
  const subcategoryLabel = SUBCATEGORY_LABELS[subcategory] || subcategory;

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400' },
    gray: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
  };

  const colors = colorClasses[categoryInfo.color] || colorClasses.gray;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1a1a1a] rounded-lg p-8">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md">
          <p className="text-red-400 mb-4">{error || 'Document not found'}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {categoryInfo.label}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-sm text-white/60">{subcategoryLabel}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full">
          {/* Title Section */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 p-3 rounded-lg ${colors.bg} mb-4`}>
              <Book className={`w-6 h-6 ${colors.text}`} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{document.title}</h1>

            {/* Tags */}
            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.slice(0, 10).map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5
                               text-white/50 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-white mt-6 mb-3 border-b border-white/10 pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-white mt-4 mb-2">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-medium text-white/90 mt-3 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-white/70 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-white/70 mb-4 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-white/70 mb-4 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-white/70">{children}</li>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-white/10 text-blue-400 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-[#0d0d0d] p-4 rounded-lg text-sm font-mono text-white/80 overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-[#0d0d0d] p-4 rounded-lg overflow-x-auto mb-4 border border-white/5">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-white/60 my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-white/10">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-white/5">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-white/10 px-4 py-2 text-left text-white font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-white/10 px-4 py-2 text-white/70">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    {children}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                hr: () => <hr className="border-white/10 my-6" />,
              }}
            >
              {document.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
